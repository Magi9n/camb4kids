import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../../common/dto/create-order.dto';
import { UpdateOrderDto } from '../../common/dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, req: any): Promise<{
        id: number;
        amount: number;
        fromCurrency: string;
        toCurrency: string;
        rate: number;
        total: number;
        status: OrderStatus;
        createdAt: Date;
    }>;
    history(req: any): Promise<unknown>;
    findById(id: number, req: any): Promise<{
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
    updateStatus(id: number, dto: UpdateOrderDto, req: any): Promise<{
        id: number;
        status: OrderStatus;
        updatedAt: Date;
    }>;
}
