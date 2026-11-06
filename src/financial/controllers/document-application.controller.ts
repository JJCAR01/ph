import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateDocumentApplicationDto } from '../dto/create-document-application.dto.js';
import { DocumentApplicationService } from '../services/document-application.service.js';

@Controller('document-applications')
export class DocumentApplicationController {
  constructor(private readonly applications: DocumentApplicationService) {}

  @Post()
  create(@Body() dto: CreateDocumentApplicationDto) {
    return this.applications.create(dto);
  }

  @Get()
  findAll() {
    return this.applications.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applications.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applications.remove(id);
  }
}
