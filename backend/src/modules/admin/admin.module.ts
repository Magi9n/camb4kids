import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminSetting } from './entities/admin-setting.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { CacheModule } from '../../common/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminSetting, Order, User]),
    CacheModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {} 