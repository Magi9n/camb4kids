"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JwtAuthGuard = class JwtAuthGuard {
    canActivate(context) {
        var _a, _b;
        const req = context.switchToHttp().getRequest();
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) || ((_b = req.headers['authorization']) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', ''));
        if (!token)
            throw new common_1.UnauthorizedException('No autenticado');
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req['user'] = Object.assign(Object.assign({}, payload), { id: payload.sub });
            return true;
        }
        catch (_c) {
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map