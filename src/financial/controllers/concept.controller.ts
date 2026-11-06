import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateConceptDto } from '../dto/create-concept.dto.js';
import { UpdateConceptDto } from '../dto/update-concept.dto.js';
import { ConceptService } from '../services/concept.service.js';

@Controller('financial-concepts')
export class ConceptController {
  constructor(private readonly concepts: ConceptService) {}

  @Post()
  create(@Body() dto: CreateConceptDto) {
    return this.concepts.create(dto);
  }

  @Get()
  findAll() {
    return this.concepts.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concepts.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConceptDto) {
    return this.concepts.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concepts.remove(id);
  }
}
