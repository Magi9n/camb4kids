import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}

export class CompleteProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  documentType: string;

  @IsString()
  document: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsIn(['M', 'F', 'O'])
  sex: string;

  @IsString()
  phone: string;
} 