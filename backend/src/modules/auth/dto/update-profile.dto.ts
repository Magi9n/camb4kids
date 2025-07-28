import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['M', 'F', 'O'])
  sex: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
} 