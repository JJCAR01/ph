import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOwnerDto } from '../dto/create-owner.dto.js';
import { UpdateOwnerDto } from '../dto/update-owner.dto.js';
import { OwnerService } from '../services/owner.service.js';

@Controller('owners')
export class OwnerController {
  constructor(private readonly owners: OwnerService) {}

  @Post()
  create(@Body() dto: CreateOwnerDto) {
    return this.owners.create(dto);
  }

  @Get()
  findAll() {
    return this.owners.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.owners.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOwnerDto) {
    return this.owners.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.owners.remove(id);
  }
}
