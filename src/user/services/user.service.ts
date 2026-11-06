import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { Role } from '../entities/role.entity.js';
import { UserRole } from '../entities/user-role.entity.js';
import { User } from '../entities/user.entity.js';
import { PasswordHasher } from '@nestjs/authentication';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoles: Repository<UserRole>,
    
    private readonly passwordHasher: PasswordHasher, // <-- Inyectas el hasher aquí

  ) {}

  async create(dto: CreateUserDto) {
    const { phId, password, ...userData } = dto;
    const user = await this.users.save(
      this.users.create({
        ...userData,
        password: await this.passwordHasher.hash(password),
        complex: { id: phId },
      }),
    );
    return this.findOne(user.id);
  }

  findAll() {
    return this.users.find({ relations: { userRoles: { role: true } } });
  }

  async findOne(id: string) {
    const user = await this.users.findOne({
      where: { id },
      relations: { userRoles: { role: true } },
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.users.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const { phId, password, ...userData } = dto;
    this.users.merge(user, {
      ...userData,
      ...(phId === undefined ? {} : { complex: { id: phId } }),
      ...(password === undefined
        ? {}
        : { password: await this.passwordHasher.hash(password) }),
    });
    await this.users.save(user);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.users.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return result;
  }

  async assignRole(userId: string, roleId: string) {
    const [user, role] = await Promise.all([
      this.users.findOneBy({ id: userId }),
      this.roles.findOneBy({ id: roleId }),
    ]);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    if (!role) {
      throw new NotFoundException(`Role ${roleId} not found`);
    }
    if (role.phId !== null && role.phId !== user.phId) {
      throw new BadRequestException(
        'A role can only be assigned to a user in the same complex or globally',
      );
    }

    const existing = await this.userRoles.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });
    if (existing) {
      return existing;
    }
    return this.userRoles.save(this.userRoles.create({ user, role }));
  }

  async removeRole(userId: string, roleId: string) {
    const assignment = await this.userRoles.findOne({
      where: { user: { id: userId }, role: { id: roleId } },
    });
    if (!assignment) {
      throw new NotFoundException(
        `Role ${roleId} is not assigned to user ${userId}`,
      );
    }
    await this.userRoles.remove(assignment);
    return { deleted: true };
  }

}
