import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createHmac,
  scrypt,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import { Repository } from 'typeorm';
import type { Env } from '../../env.model.js';
import { LoginDto } from '../dto/login.dto.js';
import { User } from '../entities/user.entity.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { PasswordHasher } from '@nestjs/authentication';

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const SESSION_ISSUER = 'ph-control';
const SESSION_AUDIENCE = 'ph-control-web';
const scryptAsync = promisify(scrypt);

interface SessionClaims {
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly allowedOrigins: Set<string>;

  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    config: ConfigService<Env>,
    private readonly passwordHasher: PasswordHasher,
  ) {
    const secret = config.get('JWT_SECRET', { infer: true });
    if (!secret || Buffer.byteLength(secret) < 32) {
      throw new Error('JWT_SECRET must be configured with at least 32 bytes.');
    }
    this.jwtSecret = secret;

    const configuredOrigins = config.get('FRONTEND_ORIGINS', { infer: true });
    const origins = configuredOrigins
      ? configuredOrigins.split(',')
      : process.env.NODE_ENV === 'production'
        ? []
        : ['http://localhost:5173'];
    this.allowedOrigins = new Set(
      origins
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map((origin) => new URL(origin).origin),
    );
  }

  async login(dto: LoginDto): Promise<{ token: string; user: AuthenticatedUser }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .addSelect('user.password')
      .where('LOWER(user.email) = :email', { email })
      .getOne();

    const passwordMatches =
      (await this.passwordHasher.verify(dto.password, user?.password)) ||
      (await this.verifyLegacyPassword(dto.password, user?.password));
    if (!user || !passwordMatches || !user.isActived) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    user.lastLogin = new Date();
    await this.users.save(user);

    const publicUser = this.toAuthenticatedUser(user);
    return {
      token: this.signToken(user.id),
      user: publicUser,
    };
  }

  async resolveSession(token: string): Promise<AuthenticatedUser> {
    const claims = this.verifyToken(token);
    if (!claims) {
      throw new UnauthorizedException('La sesión no es válida o expiró.');
    }

    const user = await this.users.findOne({
      where: { id: claims.sub },
      relations: { userRoles: { role: true } },
    });
    if (!user || !user.isActived) {
      throw new UnauthorizedException('La sesión no es válida o expiró.');
    }
    return this.toAuthenticatedUser(user);
  }

  isOriginAllowed(origin: string): boolean {
    try {
      return this.allowedOrigins.has(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  readSessionCookie(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null;
    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('ph_session='));
    if (!cookie) return null;
    const value = cookie.slice('ph_session='.length);
    return value || null;
  }

  get sessionTtlSeconds(): number {
    return SESSION_TTL_SECONDS;
  }

  get cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/api',
      maxAge: SESSION_TTL_SECONDS * 1000,
    };
  }

  private async verifyLegacyPassword(
    password: string,
    encodedHash: string | undefined,
  ): Promise<boolean> {
    const match = encodedHash?.match(/^scrypt\$([a-f0-9]+)\$([a-f0-9]{128})$/i);
    if (!match) {
      return false;
    }
    const salt = match[1];
    const expected = Buffer.from(match[2], 'hex');
    const derived = await scryptAsync(password, salt, 64) as Buffer;
    return timingSafeEqual(derived, expected);
  }

  private signToken(userId: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const claims: SessionClaims = {
      sub: userId,
      iat: issuedAt,
      exp: issuedAt + SESSION_TTL_SECONDS,
      iss: SESSION_ISSUER,
      aud: SESSION_AUDIENCE,
    };
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const signedContent = `${header}.${payload}`;
    const signature = createHmac('sha256', this.jwtSecret).update(signedContent).digest('base64url');
    return `${signedContent}.${signature}`;
  }

  private verifyToken(token: string): SessionClaims | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerPart, payloadPart, signaturePart] = parts;

    try {
      const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8')) as {
        alg?: unknown;
        typ?: unknown;
      };
      if (header.alg !== 'HS256' || header.typ !== 'JWT') return null;

      const expectedSignature = createHmac('sha256', this.jwtSecret)
        .update(`${headerPart}.${payloadPart}`)
        .digest();
      const actualSignature = Buffer.from(signaturePart, 'base64url');
      if (
        actualSignature.length !== expectedSignature.length ||
        !timingSafeEqual(actualSignature, expectedSignature)
      ) {
        return null;
      }

      const claims = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Partial<SessionClaims>;
      const now = Math.floor(Date.now() / 1000);
      if (
        typeof claims.sub !== 'string' ||
        typeof claims.iat !== 'number' ||
        typeof claims.exp !== 'number' ||
        claims.iss !== SESSION_ISSUER ||
        claims.aud !== SESSION_AUDIENCE ||
        claims.iat > now + 60 ||
        claims.exp <= now ||
        claims.exp - claims.iat > SESSION_TTL_SECONDS
      ) {
        return null;
      }
      return claims as SessionClaims;
    } catch {
      return null;
    }
  }

  private toAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      phId: user.phId,
      email: user.email,
      isActived: user.isActived,
      lastLogin: user.lastLogin,
      userRoles: (user.userRoles ?? []).flatMap((userRole) =>
        userRole.role
          ? [{
              role: {
                id: userRole.role.id,
                phId: userRole.role.phId,
                name: userRole.role.name,
                description: userRole.role.description,
              },
            }]
          : [],
      ),
    };
  }
}
