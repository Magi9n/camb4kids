import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { User } from '../auth/entities/user.entity';
import { RatesService } from '../rates/rates.service';
import { CreateOrderDto } from '../../common/dto/create-order.dto';
import { CacheService } from '../../common/services/cache.service';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly ratesService;
    private readonly cacheService;
    constructor(orderRepo: Repository<Order>, ratesService: RatesService, cacheService: CacheService);
    create(dto: CreateOrderDto, user: User): Promise<{
        id: number;
        amount: number;
        fromCurrency: string;
        toCurrency: string;
        rate: number;
        total: number;
        status: OrderStatus;
        createdAt: Date;
    }>;
    history(user: User): Promise<unknown>;
    findById(id: number, user: User): Promise<{
        id: number;
        amount: number;
        fromCurrency: string;
        toCurrency: string;
        rate: number;
        total: number;
        status: OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: number, status: OrderStatus, user: User): Promise<{
        id: number;
        status: OrderStatus;
        updatedAt: Date;
    }>;
}
