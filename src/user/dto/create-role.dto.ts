import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  @IsUUID()
  phId?: string | null;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
