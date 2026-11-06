import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComplexService } from '../services/complex.service.js';
import { CreateComplexDto } from '../dto/create-complex.dto.js';
import { UpdateComplexDto } from '../dto/update-complex.dto.js';

@Controller('complex')
export class ComplexController {
  constructor(private readonly complexService: ComplexService) {}

  @Post()
  create(@Body() createComplexDto: CreateComplexDto) {
    return this.complexService.create(createComplexDto);
  }

  @Get()
  findAll() {
    return this.complexService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complexService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplexDto: UpdateComplexDto) {
    return this.complexService.update(id, updateComplexDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complexService.remove(id);
  }
}
