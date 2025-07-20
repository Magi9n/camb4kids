"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1752971283859 = void 0;
class InitialMigration1752971283859 {
    constructor() {
        this.name = 'InitialMigration1752971283859';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL UNIQUE,
                \`password\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`exchange_rates\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`fromCurrency\` varchar(255) NOT NULL,
                \`toCurrency\` varchar(255) NOT NULL,
                \`rate\` decimal(12,4) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`orders\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`amount\` decimal(12,2) NOT NULL,
                \`fromCurrency\` varchar(255) NOT NULL,
                \`toCurrency\` varchar(255) NOT NULL,
                \`rate\` decimal(12,4) NOT NULL,
                \`total\` decimal(12,2) NOT NULL,
                \`status\` enum('EN_PROCESO','DEPOSITADO','COMPLETADO') NOT NULL DEFAULT 'EN_PROCESO',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`admin_settings\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`variationPercent\` decimal(5,4) NOT NULL DEFAULT '0.0200',
                \`cronStart\` varchar(255) NOT NULL DEFAULT '08:00',
                \`cronEnd\` varchar(255) NOT NULL DEFAULT '20:00',
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_user\` 
            FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            INSERT INTO \`admin_settings\` (\`id\`, \`variationPercent\`, \`cronStart\`, \`cronEnd\`) 
            VALUES (1, 0.0200, '08:00', '20:00')
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_user\``);
        await queryRunner.query(`DROP TABLE \`admin_settings\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`exchange_rates\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.InitialMigration1752971283859 = InitialMigration1752971283859;
//# sourceMappingURL=1752971283859-InitialMigration.js.map