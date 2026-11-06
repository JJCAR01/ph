import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateComplexSettingsDto } from '../dto/create-complexsettings.dto.js';
import { UpdateComplexSettingsDto } from '../dto/update-complexsettings.dto.js';
import { ComplexSettingsService } from '../services/complexsettings.service.js';

@Controller('complex-settings')
export class ComplexSettingsController {
  constructor(
    private readonly complexSettingsService: ComplexSettingsService,
  ) {}

  @Post()
  create(@Body() createComplexSettingsDto: CreateComplexSettingsDto) {
    return this.complexSettingsService.create(createComplexSettingsDto);
  }

  @Get()
  findAll() {
    return this.complexSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complexSettingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplexSettingsDto: UpdateComplexSettingsDto,
  ) {
    return this.complexSettingsService.update(id, updateComplexSettingsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complexSettingsService.remove(id);
  }
}
