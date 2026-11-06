import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFinancialDocumentDto } from '../dto/create-financial-document.dto.js';
import { UpdateFinancialDocumentDto } from '../dto/update-financial-document.dto.js';
import { FinancialDocumentService } from '../services/financial-document.service.js';

@Controller('financial-documents')
export class FinancialDocumentController {
  constructor(private readonly documents: FinancialDocumentService) {}

  @Post()
  create(@Body() dto: CreateFinancialDocumentDto) {
    return this.documents.create(dto);
  }

  @Get()
  findAll() {
    return this.documents.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documents.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFinancialDocumentDto,
  ) {
    return this.documents.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documents.remove(id);
  }
}
