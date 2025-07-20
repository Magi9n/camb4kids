import { Order } from '../../orders/entities/order.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
}
