import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './operation.entity';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, User])],
  providers: [OperationsService],
  controllers: [OperationsController],
  exports: [OperationsService]
})
export class OperationsModule {} 