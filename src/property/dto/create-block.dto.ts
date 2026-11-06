import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBlockDto {
  @IsUUID()
  phId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalFloor?: number;

  @IsBoolean()
  hasElevator: boolean;
}
