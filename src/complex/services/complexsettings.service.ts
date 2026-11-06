import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplexSettings } from '../entities/complexsettings.entity.js';
import { CreateComplexSettingsDto } from '../dto/create-complexsettings.dto.js';
import { UpdateComplexSettingsDto } from '../dto/update-complexsettings.dto.js';

@Injectable()
export class ComplexSettingsService {
  constructor(
    @InjectRepository(ComplexSettings)
    private readonly complexSettingsRepository: Repository<ComplexSettings>,
  ) {}

  create(createComplexSettingsDto: CreateComplexSettingsDto) {
    const { phId, ...settingsData } = createComplexSettingsDto;
    const settings = this.complexSettingsRepository.create({
      ...settingsData,
      complex: { id: phId },
    });
    return this.complexSettingsRepository.save(settings);
  }

  findAll() {
    return this.complexSettingsRepository.find({ relations: { complex: true } });
  }

  findOne(id: string) {
    return this.complexSettingsRepository.findOne({
      where: { id },
      relations: { complex: true },
    });
  }

  update(id: string, updateComplexSettingsDto: UpdateComplexSettingsDto) {
    const { phId, ...settingsData } = updateComplexSettingsDto;
    return this.complexSettingsRepository.update(id, {
      ...settingsData,
      ...(phId === undefined ? {} : { complex: { id: phId } }),
    });
  }

  remove(id: string) {
    return this.complexSettingsRepository.delete(id);
  }
}
