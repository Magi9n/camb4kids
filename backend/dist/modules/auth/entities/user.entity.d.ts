import { Order } from '../../orders/entities/order.entity';
import { BankAccount } from './bank-account.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    lastname: string;
    role: string;
    isVerified: boolean;
    verificationCode: string;
    verificationExpires: Date;
    documentType: string;
    document: string;
    sex: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    bankAccounts: BankAccount[];
}
