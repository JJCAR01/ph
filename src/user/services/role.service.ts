import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto.js';
import { UpdateRoleDto } from '../dto/update-role.dto.js';
import { Role } from '../entities/role.entity.js';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
  ) {}

  create(dto: CreateRoleDto) {
    const { phId, ...roleData } = dto;
    return this.roles.save(
      this.roles.create({
        ...roleData,
        complex: phId ? { id: phId } : null,
      }),
    );
  }

  findAll() {
    return this.roles.find();
  }

  async findOne(id: string) {
    const role = await this.roles.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.roles.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }
    const { phId, ...roleData } = dto;
    this.roles.merge(role, {
      ...roleData,
      ...(phId === undefined
        ? {}
        : { complex: phId ? { id: phId } : null }),
    });
    return this.roles.save(role);
  }

  async remove(id: string) {
    const result = await this.roles.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Role ${id} not found`);
    }
    return result;
  }
}
