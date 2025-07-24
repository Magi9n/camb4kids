"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../modules/auth/entities/user.entity");
const order_entity_1 = require("../modules/orders/entities/order.entity");
const exchange_rate_entity_1 = require("../modules/rates/entities/exchange-rate.entity");
const admin_setting_entity_1 = require("../modules/admin/entities/admin-setting.entity");
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.User, order_entity_1.Order, exchange_rate_entity_1.ExchangeRate, admin_setting_entity_1.AdminSetting],
    migrations: ['src/migrations/*.ts'],
    migrationsRun: false,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
});
//# sourceMappingURL=typeorm.config.js.map