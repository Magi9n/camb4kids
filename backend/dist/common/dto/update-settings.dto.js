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
exports.UpdateSettingsDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateSettingsDto {
}
exports.UpdateSettingsDto = UpdateSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "variationPercent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "buyPercent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "sellPercent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Formato de hora inválido (HH:MM)',
    }),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "cronStart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Formato de hora inválido (HH:MM)',
    }),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "cronEnd", void 0);
//# sourceMappingURL=update-settings.dto.js.map