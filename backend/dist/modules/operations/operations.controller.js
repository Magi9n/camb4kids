"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OperationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsController = void 0;
const common_1 = require("@nestjs/common");
const operations_service_1 = require("./operations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OperationsController = OperationsController_1 = class OperationsController {
    constructor(operationsService) {
        this.operationsService = operationsService;
        this.logger = new common_1.Logger(OperationsController_1.name);
    }
    async create(body, req) {
        try {
            this.logger.log('Iniciando creación de operación');
            this.logger.log(`Datos recibidos: ${JSON.stringify(body)}`);
            this.logger.log(`Usuario autenticado: ${JSON.stringify(req.user)}`);
            const user = req.user;
            const operationData = {
                userId: user.id,
                userName: body.nombre || body.userName,
                userDni: body.dni || body.userDni,
                userPhone: body.telefono || body.userPhone,
                amountToSend: body.importe_envia || body.amountToSend,
                exchangeRate: body.tipo_cambio || body.exchangeRate,
                amountToReceive: body.importe_recibe || body.amountToReceive,
                fromCurrency: body.moneda_envia || body.fromCurrency,
                toCurrency: body.moneda_recibe || body.toCurrency,
                fromBank: body.fromBank || '',
                toBank: body.toBank || '',
                fromAccountNumber: body.fromAccountNumber || '',
                toAccountNumber: body.toAccountNumber || '',
                manguitos: body.manguitos || 0,
                status: 'PENDING_TRANSFER',
                transferReference: body.transferReference || null,
                notes: body.notes || null
            };
            this.logger.log(`Datos de operación mapeados: ${JSON.stringify(operationData)}`);
            const result = await this.operationsService.create(operationData);
            this.logger.log(`Operación creada exitosamente: ${JSON.stringify(result)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error al crear operación: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async delete(id, req) {
        try {
            this.logger.log(`Eliminando operación ${id} para usuario ${req.user.id}`);
            const result = await this.operationsService.delete(id, req.user.id);
            this.logger.log(`Operación ${id} eliminada exitosamente`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error al eliminar operación ${id}: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async update(id, updateData, req) {
        try {
            this.logger.log(`Actualizando operación ${id} para usuario ${req.user.id}`);
            this.logger.log(`Datos de actualización: ${JSON.stringify(updateData)}`);
            const result = await this.operationsService.update(id, req.user.id, updateData);
            this.logger.log(`Operación ${id} actualizada exitosamente`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error al actualizar operación ${id}: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
};
exports.OperationsController = OperationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "update", null);
exports.OperationsController = OperationsController = OperationsController_1 = __decorate([
    (0, common_1.Controller)('operations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [operations_service_1.OperationsService])
], OperationsController);
//# sourceMappingURL=operations.controller.js.map