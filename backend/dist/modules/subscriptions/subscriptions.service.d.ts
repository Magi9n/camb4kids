import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
export declare class SubscriptionsService {
    private subscriptionRepo;
    constructor(subscriptionRepo: Repository<Subscription>);
    createSubscription(dto: CreateSubscriptionDto): Promise<Subscription>;
    getAllSubscriptions(): Promise<Subscription[]>;
    unsubscribe(email: string): Promise<void>;
}
