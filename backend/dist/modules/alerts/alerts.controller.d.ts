import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './alert.dto';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    create(dto: CreateAlertDto, req: any): Promise<{
        message: string;
    }>;
}
