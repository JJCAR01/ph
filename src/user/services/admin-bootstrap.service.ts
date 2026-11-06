import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PasswordHasher } from '@nestjs/authentication';
import { isEmail } from 'class-validator';
import type { Env } from '../../env.model.js';
import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity.js';
import { UserRole } from '../entities/user-role.entity.js';
import { User } from '../entities/user.entity.js';

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly config: ConfigService<Env>,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.get('ADMIN_EMAIL', { infer: true })
      ?.trim()
      .toLowerCase();
    const password = this.config.get('ADMIN_PASSWORD', { infer: true });

    if (!email && !password) {
      this.logger.warn(
        'ADMIN_EMAIL and ADMIN_PASSWORD are unset; global admin bootstrap was skipped.',
      );
      return;
    }
    if (!email || !password) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must both be configured.',
      );
    }
    if (!isEmail(email)) {
      throw new Error('ADMIN_EMAIL must be a valid email address.');
    }
    if (password.length < 16) {
      throw new Error('ADMIN_PASSWORD must contain at least 16 characters.');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        'SELECT pg_advisory_xact_lock(hashtext($1))',
        ['ph-global-admin-bootstrap'],
      );

      const users = manager.getRepository(User);
      const roles = manager.getRepository(Role);
      const userRoles = manager.getRepository(UserRole);

      let user = await users.findOne({
        where: { email },
        relations: { complex: true },
      });
      if (user?.complex) {
        throw new Error(
          'ADMIN_EMAIL is already used by a complex-scoped user; choose a dedicated global admin email.',
        );
      }

      user ??= await users.save(
        users.create({
          email,
          password: await this.passwordHasher.hash(password),
          isActived: true,
          complex: null,
        }),
      );

      let role = await roles
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.complex', 'complex')
        .where('role.name = :name', { name: 'ADMIN' })
        .andWhere('complex.id IS NULL')
        .getOne();
      role ??= await roles.save(
          roles.create({
            name: 'ADMIN',
            description: 'Administrador global con acceso a todos los conjuntos',
            complex: null,
          }),
        );

      const assignment = await userRoles.findOne({
        where: { user: { id: user.id }, role: { id: role.id } },
      });
      if (!assignment) {
        await userRoles.save(userRoles.create({ user, role }));
      }
    });

    this.logger.log(`Global admin account is ready for ${email}.`);
  }
}
