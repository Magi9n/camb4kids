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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSetting = void 0;
const typeorm_1 = require("typeorm");
let AdminSetting = class AdminSetting {
};
exports.AdminSetting = AdminSetting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AdminSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], AdminSetting.prototype, "variationPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '08:00' }),
    __metadata("design:type", String)
], AdminSetting.prototype, "cronStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '20:00' }),
    __metadata("design:type", String)
], AdminSetting.prototype, "cronEnd", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 4, default: 1 }),
    __metadata("design:type", Number)
], AdminSetting.prototype, "buyPercent", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 4, default: 1 }),
    __metadata("design:type", Number)
], AdminSetting.prototype, "sellPercent", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AdminSetting.prototype, "updatedAt", void 0);
exports.AdminSetting = AdminSetting = __decorate([
    (0, typeorm_1.Entity)('admin_settings')
], AdminSetting);
//# sourceMappingURL=admin-setting.entity.js.map