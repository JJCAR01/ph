import { Injectable } from '@nestjs/common';
import { CreateComplexDto } from '../dto/create-complex.dto.js';
import { UpdateComplexDto } from '../dto/update-complex.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Complex } from '../entities/complex.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ComplexService {

  constructor(
  @InjectRepository(Complex)
    private readonly complexesRepository: Repository<Complex>
  ){}

  create(createComplexDto: CreateComplexDto) {
    const complex = this.complexesRepository.create(createComplexDto);
    return this.complexesRepository.save(complex);
  }

  findAll() {
    return this.complexesRepository.find({
      relations: { settings: true, blocks: true, properties: true },
    });
  }

  findOne(id: string) {
    return this.complexesRepository.findOne({
      where: { id },
      relations: { settings: true, blocks: true, properties: true },
    });
  }

  update(id: string, updateComplexDto: UpdateComplexDto) {
    return this.complexesRepository.update(id, updateComplexDto);
  }

  remove(id: string) {
    return this.complexesRepository.delete(id);
  }
}
