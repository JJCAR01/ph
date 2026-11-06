import { IsNumber, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateDocumentItemDto {
  @IsUUID()
  conceptId: string;

  @IsString()
  @MaxLength(255)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;
}
