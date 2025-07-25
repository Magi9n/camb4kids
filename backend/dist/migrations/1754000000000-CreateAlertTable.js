"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlertTable1754000000000 = void 0;
class CreateAlertTable1754000000000 {
    constructor() {
        this.name = 'CreateAlertTable1754000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`alerts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`type\` enum('buy','sell') NOT NULL,
                \`value\` decimal(12,4) NOT NULL,
                \`triggered\` tinyint NOT NULL DEFAULT 0,
                \`triggeredAt\` datetime NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`alerts\` ADD CONSTRAINT \`FK_alerts_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`alerts\` DROP FOREIGN KEY \`FK_alerts_user\``);
        await queryRunner.query(`DROP TABLE \`alerts\``);
    }
}
exports.CreateAlertTable1754000000000 = CreateAlertTable1754000000000;
//# sourceMappingURL=1754000000000-CreateAlertTable.js.map