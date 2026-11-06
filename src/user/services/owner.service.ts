import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Property } from '../../property/entities/property.entity.js';
import { CreateOwnerDto } from '../dto/create-owner.dto.js';
import { UpdateOwnerDto } from '../dto/update-owner.dto.js';
import { OwnerPerson } from '../entities/owner.entity.js';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(OwnerPerson)
    private readonly owners: Repository<OwnerPerson>,
    @InjectRepository(Property)
    private readonly properties: Repository<Property>,
  ) {}

  async create(dto: CreateOwnerDto) {
    const { phId, propertyIds = [], ...ownerData } = dto;
    const properties = await this.resolveProperties(propertyIds, phId);
    const owner = await this.owners.save(
      this.owners.create({
        ...ownerData,
        phone: ownerData.phone ?? null,
        email: ownerData.email ?? null,
        complex: { id: phId },
        properties,
      }),
    );
    return this.findOne(owner.id);
  }

  findAll() {
    return this.owners.find({ relations: { properties: true } });
  }

  async findOne(id: string) {
    const owner = await this.owners.findOne({
      where: { id },
      relations: { properties: true },
    });
    if (!owner) {
      throw new NotFoundException(`Owner ${id} not found`);
    }
    return owner;
  }

  async update(id: string, dto: UpdateOwnerDto) {
    const owner = await this.owners.findOne({
      where: { id },
      relations: { properties: true },
    });
    if (!owner) {
      throw new NotFoundException(`Owner ${id} not found`);
    }

    const { phId, propertyIds, ...ownerData } = dto;
    const targetPhId = phId ?? owner.phId;
    const targetPropertyIds =
      propertyIds ?? owner.properties.map((property) => property.id);
    const properties = await this.resolveProperties(
      targetPropertyIds,
      targetPhId,
    );

    this.owners.merge(owner, {
      ...ownerData,
      ...(phId === undefined ? {} : { complex: { id: phId } }),
      properties,
    });
    return this.owners.save(owner);
  }

  async remove(id: string) {
    const result = await this.owners.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Owner ${id} not found`);
    }
    return result;
  }

  private async resolveProperties(ids: string[], phId: string) {
    if (ids.length === 0) {
      return [];
    }

    const properties = await this.properties.find({
      where: { id: In(ids), complex: { id: phId } },
    });
    if (properties.length !== new Set(ids).size) {
      throw new NotFoundException(
        'One or more properties do not exist in the specified complex',
      );
    }
    return properties;
  }
}
