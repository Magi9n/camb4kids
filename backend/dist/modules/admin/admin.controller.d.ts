import { AdminService } from './admin.service';
import { UpdateSettingsDto } from '../../common/dto/update-settings.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getOrders(page: number, limit: number, status?: string): Promise<unknown>;
    updateOrder(id: number, dto: UpdateOrderDto): Promise<{
        id: number;
        status: import("../orders/entities/order.entity").OrderStatus;
        updatedAt: Date;
    }>;
    getStats(): Promise<unknown>;
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
    getPublicMargins(): Promise<{
        buyPercent: any;
        sellPercent: any;
    }>;
}
