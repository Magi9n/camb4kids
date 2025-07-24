"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBuySellPercentToAdminSettings1753233643203 = void 0;
class AddBuySellPercentToAdminSettings1753233643203 {
    constructor() {
        this.name = 'AddBuySellPercentToAdminSettings1753233643203';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`admin_settings\`
            ADD \`buyPercent\` decimal(5, 4) NOT NULL DEFAULT '1.0000'
        `);
        await queryRunner.query(`
            ALTER TABLE \`admin_settings\`
            ADD \`sellPercent\` decimal(5, 4) NOT NULL DEFAULT '1.0000'
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`lastname\` \`lastname\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`verificationCode\` \`verificationCode\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`verificationExpires\` \`verificationExpires\` timestamp NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`documentType\` \`documentType\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`document\` \`document\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`sex\` \`sex\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`sex\` \`sex\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`document\` \`document\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`documentType\` \`documentType\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`verificationExpires\` \`verificationExpires\` timestamp NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`verificationCode\` \`verificationCode\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`lastname\` \`lastname\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`admin_settings\` DROP COLUMN \`sellPercent\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`admin_settings\` DROP COLUMN \`buyPercent\`
        `);
    }
}
exports.AddBuySellPercentToAdminSettings1753233643203 = AddBuySellPercentToAdminSettings1753233643203;
//# sourceMappingURL=1753233643203-AddBuySellPercentToAdminSettings.js.map