import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  phId: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsBoolean()
  isActived?: boolean;
}
