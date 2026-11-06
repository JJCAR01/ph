import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller.js';
import { Property } from '../property/entities/property.entity.js';
import { AuthGuard } from './auth/auth.guard.js';
import { OwnerController } from './controllers/owner.controller.js';
import { RoleController } from './controllers/role.controller.js';
import { UserController } from './controllers/user.controller.js';
import { OwnerPerson } from './entities/owner.entity.js';
import { Role } from './entities/role.entity.js';
import { UserRole } from './entities/user-role.entity.js';
import { User } from './entities/user.entity.js';
import { OwnerService } from './services/owner.service.js';
import { RoleService } from './services/role.service.js';
import { UserService } from './services/user.service.js';
import { AuthService } from './services/auth.service.js';
import { AdminBootstrapService } from './services/admin-bootstrap.service.js';
import { PasswordHasher } from '@nestjs/authentication';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, OwnerPerson, Property]),
  ],
  controllers: [AuthController, UserController, RoleController, OwnerController],
  providers: [
    UserService,
    RoleService,
    OwnerService,
    AuthService,
    AdminBootstrapService,
    AuthGuard,
    PasswordHasher,
    { provide: APP_GUARD, useExisting: AuthGuard },
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
