import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyNewEmailDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  code: string;
} 