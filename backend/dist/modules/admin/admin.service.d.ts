import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AdminSetting } from './entities/admin-setting.entity';
import { Order } from '../orders/entities/order.entity';
import { UpdateSettingsDto } from '../../common/dto/update-settings.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { CacheService } from '../../common/services/cache.service';
import { User } from '../auth/entities/user.entity';
export declare class AdminService {
    private readonly settingsRepo;
    private readonly orderRepo;
    private readonly userRepo;
    private readonly configService;
    private readonly cacheService;
    constructor(settingsRepo: Repository<AdminSetting>, orderRepo: Repository<Order>, userRepo: Repository<User>, configService: ConfigService, cacheService: CacheService);
    getSettings(): Promise<unknown>;
    updateSettings(dto: UpdateSettingsDto): Promise<{
        id: number;
        variationPercent: number;
        buyPercent: number;
        sellPercent: number;
        cronStart: string;
        cronEnd: string;
        updatedAt: Date;
    }>;
    getOrders(page?: number, limit?: number, status?: string): Promise<{
        orders: {
            id: number;
            amount: number;
            fromCurrency: string;
            toCurrency: string;
            rate: number;
            total: number;
            status: import("../orders/entities/order.entity").OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            user: {
                id: number;
                email: string;
                name: string;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateOrder(id: number, dto: UpdateOrderDto): Promise<{
        id: number;
        status: import("../orders/entities/order.entity").OrderStatus;
        updatedAt: Date;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    getStats(): Promise<unknown>;
    getAllOrders(page?: number, limit?: number): Promise<unknown>;
    updateOrderStatus(orderId: number, status: string): Promise<{
        id: number;
        status: import("../orders/entities/order.entity").OrderStatus;
        updatedAt: Date;
    }>;
    clearCache(): Promise<{
        message: string;
        previousStats: {
            total: number;
            valid: number;
            expired: number;
        };
    }>;
    getCacheStats(): Promise<{
        total: number;
        valid: number;
        expired: number;
    }>;
}
