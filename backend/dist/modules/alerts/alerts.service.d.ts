import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { User } from '../auth/entities/user.entity';
import { CreateAlertDto } from './alert.dto';
import { RatesService } from '../rates/rates.service';
export declare class AlertsService {
    private readonly alertRepo;
    private readonly ratesService;
    constructor(alertRepo: Repository<Alert>, ratesService: RatesService);
    createAlert(dto: CreateAlertDto, user: User): Promise<{
        message: string;
    }>;
    updateAlert(id: number, dto: CreateAlertDto, user: User): Promise<{
        message: string;
    }>;
    deleteAlert(id: number, user: User): Promise<{
        message: string;
    }>;
    checkAlertsAndNotify(): Promise<void>;
    sendAlertEmail(email: string, type: string, alertValue: number, currentRate: number): Promise<void>;
    getAlertsForUser(user: User): Promise<Alert[]>;
}
