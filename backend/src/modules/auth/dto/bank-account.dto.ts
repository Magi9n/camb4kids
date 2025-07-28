import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  accountType: string;

  @IsString()
  @IsNotEmpty()
  bank: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsEnum(['soles', 'dollars'])
  currency: string;
}

export class UpdateBankAccountDto {
  @IsOptional()
  @IsString()
  accountType?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsEnum(['soles', 'dollars'])
  currency?: string;
} 