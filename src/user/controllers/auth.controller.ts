import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { Public } from '../auth/public.decorator.js';
import type { AuthenticatedRequest } from '../auth/auth.types.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const origin = request.headers.origin;
    if (origin && !this.auth.isOriginAllowed(origin)) {
      throw new ForbiddenException('Origin is not allowed.');
    }
    const session = await this.auth.login(dto);
    response.cookie('ph_session', session.token, this.auth.cookieOptions);
    return { user: session.user, expiresIn: this.auth.sessionTtlSeconds };
  }

  @Get('me')
  currentUser(@Req() request: AuthenticatedRequest) {
    return { user: request.authUser };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('ph_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api',
    });
    return { loggedOut: true };
  }
}
