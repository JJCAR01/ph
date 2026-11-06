import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  FinancialDocumentStatus,
  FinancialDocumentType,
} from '../entities/financial-document.entity.js';
import { CreateDocumentItemDto } from './create-document-item.dto.js';

export class CreateFinancialDocumentDto {
  @IsUUID()
  phId: string;

  @IsUUID()
  propertyId: string;

  @IsEnum(FinancialDocumentType)
  documentType: FinancialDocumentType;

  @IsString()
  @MaxLength(100)
  documentNumber: string;

  @IsDateString()
  issueDate: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsEnum(FinancialDocumentStatus)
  status?: FinancialDocumentStatus;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentItemDto)
  items?: CreateDocumentItemDto[];
}
