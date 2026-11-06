import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from '../dto/create-property.dto.js';
import { UpdatePropertyDto } from '../dto/update-property.dto.js';
import { Property } from '../entities/property.entity.js';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
  ) {}

  create(createPropertyDto: CreatePropertyDto) {
    const { phId, blockId, ...propertyData } = createPropertyDto;
    const property = this.propertiesRepository.create({
      ...propertyData,
      complex: { id: phId },
      block: { id: blockId },
    });
    return this.propertiesRepository.save(property);
  }

  findAll() {
    return this.propertiesRepository.find({
      relations: { complex: true, block: true },
    });
  }

  findOne(id: string) {
    return this.propertiesRepository.findOne({
      where: { id },
      relations: { complex: true, block: true },
    });
  }

  update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const { phId, blockId, ...propertyData } = updatePropertyDto;
    return this.propertiesRepository.update(id, {
      ...propertyData,
      ...(phId === undefined ? {} : { complex: { id: phId } }),
      ...(blockId === undefined ? {} : { block: { id: blockId } }),
    });
  }

  remove(id: string) {
    return this.propertiesRepository.delete(id);
  }
}
