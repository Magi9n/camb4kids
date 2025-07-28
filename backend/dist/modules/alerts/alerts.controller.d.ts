import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './alert.dto';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    create(dto: CreateAlertDto, req: any): Promise<{
        message: string;
    }>;
    findAll(req: any): Promise<import("./alert.entity").Alert[]>;
    update(id: number, dto: CreateAlertDto, req: any): Promise<{
        message: string;
    }>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
