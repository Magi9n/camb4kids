"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../modules/auth/entities/user.entity");
const order_entity_1 = require("../modules/orders/entities/order.entity");
const exchange_rate_entity_1 = require("../modules/rates/entities/exchange-rate.entity");
const admin_setting_entity_1 = require("../modules/admin/entities/admin-setting.entity");
const typeOrmConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [user_entity_1.User, order_entity_1.Order, exchange_rate_entity_1.ExchangeRate, admin_setting_entity_1.AdminSetting],
    migrationsRun: false,
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
});
exports.typeOrmConfig = typeOrmConfig;
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource((0, exports.typeOrmConfig)(configService));
//# sourceMappingURL=typeorm.config.js.map