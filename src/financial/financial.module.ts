import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../property/entities/property.entity.js';
import { ConceptController } from './controllers/concept.controller.js';
import { DocumentApplicationController } from './controllers/document-application.controller.js';
import { FinancialDocumentController } from './controllers/financial-document.controller.js';
import { Concept } from './entities/concept.entity.js';
import { DocumentApplication } from './entities/document-application.entity.js';
import { DocumentItem } from './entities/document-item.entity.js';
import { FinancialDocument } from './entities/financial-document.entity.js';
import { ConceptService } from './services/concept.service.js';
import { DocumentApplicationService } from './services/document-application.service.js';
import { FinancialDocumentService } from './services/financial-document.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Concept,
      DocumentItem,
      FinancialDocument,
      DocumentApplication,
      Property,
    ]),
  ],
  controllers: [
    ConceptController,
    FinancialDocumentController,
    DocumentApplicationController,
  ],
  providers: [
    ConceptService,
    FinancialDocumentService,
    DocumentApplicationService,
  ],
  exports: [TypeOrmModule],
})
export class FinancialModule {}
