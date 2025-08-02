"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./modules/auth/auth.module");
const rates_module_1 = require("./modules/rates/rates.module");
const alerts_module_1 = require("./modules/alerts/alerts.module");
const operations_module_1 = require("./modules/operations/operations.module");
const admin_module_1 = require("./modules/admin/admin.module");
const user_entity_1 = require("./modules/auth/entities/user.entity");
const password_reset_entity_1 = require("./modules/auth/entities/password-reset.entity");
const email_change_entity_1 = require("./modules/auth/entities/email-change.entity");
const bank_account_entity_1 = require("./modules/auth/entities/bank-account.entity");
const mangos_cash_account_entity_1 = require("./modules/auth/mangos-cash-account.entity");
const order_entity_1 = require("./modules/orders/entities/order.entity");
const exchange_rate_entity_1 = require("./modules/rates/entities/exchange-rate.entity");
const alert_entity_1 = require("./modules/alerts/alert.entity");
const admin_setting_entity_1 = require("./modules/admin/entities/admin-setting.entity");
const operation_entity_1 = require("./modules/operations/operation.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [
                    user_entity_1.User,
                    password_reset_entity_1.PasswordReset,
                    email_change_entity_1.EmailChange,
                    bank_account_entity_1.BankAccount,
                    mangos_cash_account_entity_1.MangosCashAccount,
                    order_entity_1.Order,
                    exchange_rate_entity_1.ExchangeRate,
                    alert_entity_1.Alert,
                    admin_setting_entity_1.AdminSetting,
                    operation_entity_1.Operation
                ],
                synchronize: false,
                logging: false,
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            rates_module_1.RatesModule,
            alerts_module_1.AlertsModule,
            operations_module_1.OperationsModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map