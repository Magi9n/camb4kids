import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  providers: [OperationsService],
  controllers: [OperationsController],
  exports: [OperationsService]
})
export class OperationsModule {} 