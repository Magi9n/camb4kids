import { OperationsService } from './operations.service';
export declare class OperationsController {
    private readonly operationsService;
    private readonly logger;
    constructor(operationsService: OperationsService);
    create(body: any, req: any): Promise<import("./operation.entity").Operation>;
    delete(id: number, req: any): Promise<void>;
    update(id: number, updateData: any, req: any): Promise<import("./operation.entity").Operation>;
}
