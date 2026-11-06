import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateDocumentApplicationDto {
  @IsUUID()
  phId: string;

  @IsUUID()
  debtDocumentId: string;

  @IsUUID()
  creditDocumentId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  appliedAmount: number;
}
