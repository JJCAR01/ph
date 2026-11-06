import { IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateComplexSettingsDto {
  @IsUUID()
  phId: string;

  @IsNumber()
  @Min(0)
  lateFeePercentage: number;

  @IsInt()
  @Min(0)
  gracePeriod: number;

  @IsString()
  logo: string;
}
