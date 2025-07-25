import { User } from '../auth/entities/user.entity';
export declare class Alert {
    id: number;
    user: User;
    email: string;
    type: 'buy' | 'sell';
    value: number;
    triggered: boolean;
    triggeredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
