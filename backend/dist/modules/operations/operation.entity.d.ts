import { User } from '../auth/entities/user.entity';
export declare class Operation {
    id: number;
    user: User;
    userId: number;
    userName: string;
    userDni: string;
    userPhone: string;
    amountToSend: number;
    exchangeRate: number;
    amountToReceive: number;
    fromCurrency: string;
    toCurrency: string;
    fromBank: string;
    toBank: string;
    fromAccountNumber: string;
    toAccountNumber: string;
    manguitos: number;
    status: string;
    transferReference: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
