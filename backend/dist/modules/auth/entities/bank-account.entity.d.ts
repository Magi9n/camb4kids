import { User } from './user.entity';
export declare class BankAccount {
    id: number;
    accountType: string;
    bank: string;
    accountNumber: string;
    accountName: string;
    currency: string;
    isActive: boolean;
    user: User;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
