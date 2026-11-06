import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConceptDto } from '../dto/create-concept.dto.js';
import { UpdateConceptDto } from '../dto/update-concept.dto.js';
import { Concept } from '../entities/concept.entity.js';

@Injectable()
export class ConceptService {
  constructor(
    @InjectRepository(Concept)
    private readonly concepts: Repository<Concept>,
  ) {}

  create(dto: CreateConceptDto) {
    const { phId, ...data } = dto;
    return this.concepts.save(
      this.concepts.create({
        ...data,
        description: data.description ?? null,
        complex: phId ? { id: phId } : null,
      }),
    );
  }

  findAll() {
    return this.concepts.find();
  }

  async findOne(id: string) {
    const concept = await this.concepts.findOneBy({ id });
    if (!concept) {
      throw new NotFoundException(`Concept ${id} not found`);
    }
    return concept;
  }

  async update(id: string, dto: UpdateConceptDto) {
    const concept = await this.findOne(id);
    const { phId, ...data } = dto;
    this.concepts.merge(concept, {
      ...data,
      ...(phId === undefined
        ? {}
        : { complex: phId ? { id: phId } : null }),
    });
    return this.concepts.save(concept);
  }

  async remove(id: string) {
    const result = await this.concepts.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Concept ${id} not found`);
    }
    return result;
  }
}
