import { User } from '../../auth/entities/user.entity';
export type OrderStatus = 'EN_PROCESO' | 'DEPOSITADO' | 'COMPLETADO';
export declare class Order {
    id: number;
    user: User;
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}
