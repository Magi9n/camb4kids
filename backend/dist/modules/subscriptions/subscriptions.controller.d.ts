import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(dto: CreateSubscriptionDto): Promise<{
        message: string;
        subscription: {
            id: number;
            email: string;
            createdAt: Date;
        };
    }>;
    findAll(): Promise<{
        subscriptions: {
            id: number;
            email: string;
            createdAt: Date;
        }[];
    }>;
}
