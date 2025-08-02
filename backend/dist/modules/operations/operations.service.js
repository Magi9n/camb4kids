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
var OperationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const operation_entity_1 = require("./operation.entity");
let OperationsService = OperationsService_1 = class OperationsService {
    constructor(operationsRepository) {
        this.operationsRepository = operationsRepository;
        this.logger = new common_1.Logger(OperationsService_1.name);
    }
    async create(operationData) {
        try {
            this.logger.log('Iniciando creación de operación en servicio');
            this.logger.log(`Datos de operación: ${JSON.stringify(operationData)}`);
            const operation = this.operationsRepository.create(operationData);
            this.logger.log(`Operación creada con TypeORM: ${JSON.stringify(operation)}`);
            const savedOperation = await this.operationsRepository.save(operation);
            this.logger.log(`Operación guardada exitosamente: ${JSON.stringify(savedOperation)}`);
            return savedOperation;
        }
        catch (error) {
            this.logger.error(`Error en servicio al crear operación: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async delete(id, userId) {
        try {
            this.logger.log(`Buscando operación ${id} para eliminar`);
            const operation = await this.operationsRepository.findOne({
                where: { id, userId }
            });
            if (!operation) {
                this.logger.warn(`Operación ${id} no encontrada para usuario ${userId}`);
                throw new common_1.NotFoundException('Operación no encontrada');
            }
            if (operation.userId !== userId) {
                this.logger.warn(`Usuario ${userId} intentó eliminar operación ${id} que no le pertenece`);
                throw new common_1.ForbiddenException('No tienes permisos para eliminar esta operación');
            }
            await this.operationsRepository.remove(operation);
            this.logger.log(`Operación ${id} eliminada exitosamente`);
        }
        catch (error) {
            this.logger.error(`Error en servicio al eliminar operación ${id}: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
    async update(id, userId, updateData) {
        try {
            this.logger.log(`Buscando operación ${id} para actualizar`);
            const operation = await this.operationsRepository.findOne({
                where: { id, userId }
            });
            if (!operation) {
                this.logger.warn(`Operación ${id} no encontrada para usuario ${userId}`);
                throw new common_1.NotFoundException('Operación no encontrada');
            }
            if (operation.userId !== userId) {
                this.logger.warn(`Usuario ${userId} intentó actualizar operación ${id} que no le pertenece`);
                throw new common_1.ForbiddenException('No tienes permisos para actualizar esta operación');
            }
            if (updateData.exchangeRate !== undefined) {
                operation.exchangeRate = updateData.exchangeRate;
            }
            if (updateData.amountToReceive !== undefined) {
                operation.amountToReceive = updateData.amountToReceive;
            }
            const updatedOperation = await this.operationsRepository.save(operation);
            this.logger.log(`Operación ${id} actualizada exitosamente`);
            return updatedOperation;
        }
        catch (error) {
            this.logger.error(`Error en servicio al actualizar operación ${id}: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw error;
        }
    }
};
exports.OperationsService = OperationsService;
exports.OperationsService = OperationsService = OperationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(operation_entity_1.Operation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OperationsService);
//# sourceMappingURL=operations.service.js.map