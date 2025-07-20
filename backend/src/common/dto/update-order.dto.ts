import { IsString, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsIn(['EN_PROCESO', 'DEPOSITADO', 'COMPLETADO'])
  status: string;
} 