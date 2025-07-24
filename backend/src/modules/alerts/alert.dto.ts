import { IsNumber, IsEnum, Min, Max } from 'class-validator';

export class CreateAlertDto {
  @IsEnum(['buy', 'sell'])
  type: 'buy' | 'sell';

  @IsNumber()
  @Min(0.5)
  @Max(20)
  value: number;
} 