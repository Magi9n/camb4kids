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
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./modules/auth/auth.module");
const rates_module_1 = require("./modules/rates/rates.module");
const orders_module_1 = require("./modules/orders/orders.module");
const admin_module_1 = require("./modules/admin/admin.module");
const cache_module_1 = require("./common/cache.module");
const user_entity_1 = require("./modules/auth/entities/user.entity");
const order_entity_1 = require("./modules/orders/entities/order.entity");
const exchange_rate_entity_1 = require("./modules/rates/entities/exchange-rate.entity");
const admin_setting_entity_1 = require("./modules/admin/entities/admin-setting.entity");
const alerts_module_1 = require("./modules/alerts/alerts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST'),
                    port: parseInt(config.get('DB_PORT', '3306')),
                    username: config.get('DB_USERNAME'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_DATABASE'),
                    entities: [user_entity_1.User, order_entity_1.Order, exchange_rate_entity_1.ExchangeRate, admin_setting_entity_1.AdminSetting],
                    migrations: [
                        config.get('NODE_ENV') === 'development'
                            ? 'src/migrations/*.ts'
                            : 'dist/migrations/*.js'
                    ],
                    migrationsRun: false,
                    synchronize: false,
                    logging: config.get('NODE_ENV') === 'development',
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
            cache_module_1.CacheModule,
            auth_module_1.AuthModule,
            rates_module_1.RatesModule,
            orders_module_1.OrdersModule,
            admin_module_1.AdminModule,
            alerts_module_1.AlertsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map