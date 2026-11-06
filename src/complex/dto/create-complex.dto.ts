import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateComplexDto {

    @IsString()
    name: string;

    @IsString()
    nit: string;

    @IsOptional()
    @IsString() 
    address: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    whatsapp: string;

    @IsOptional()
    @IsString()
    phone: string;
    
    @IsOptional()
    @IsEmail()
    email: string;
    
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

}
