import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateConceptDto {
  @IsOptional()
  @IsUUID()
  phId?: string | null;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null;
}
