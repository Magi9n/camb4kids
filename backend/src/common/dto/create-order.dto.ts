import { IsNumber, IsString, IsIn, Min, Max } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(10)
  @Max(10000)
  amount: number;

  @IsString()
  @IsIn(['USD'])
  fromCurrency: string;

  @IsString()
  @IsIn(['PEN'])
  toCurrency: string;
} 