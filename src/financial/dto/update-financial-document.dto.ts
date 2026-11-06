import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialDocumentDto } from './create-financial-document.dto.js';

export class UpdateFinancialDocumentDto extends PartialType(
  CreateFinancialDocumentDto,
) {}
