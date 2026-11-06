import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsUUID()
  phId: string;

  @IsUUID()
  blockId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  areaM2: number;

  @IsNumber()
  @Min(0)
  coefficient: number;
}
