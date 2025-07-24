import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfileFields1753070745206 implements MigrationInterface {
    name = 'AddUserProfileFields1753070745206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_user\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`exchange_rates\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastname\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isVerified\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`verificationCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`verificationExpires\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`documentType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`document\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`sex\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'EN_PROCESO'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`admin_settings\` CHANGE \`variationPercent\` \`variationPercent\` decimal(5,4) NOT NULL DEFAULT '0.0000'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`admin_settings\` CHANGE \`variationPercent\` \`variationPercent\` decimal(5,4) NOT NULL DEFAULT '0.0200'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`status\` enum ('EN_PROCESO', 'DEPOSITADO', 'COMPLETADO') NOT NULL DEFAULT ''EN_PROCESO''`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`sex\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`document\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`documentType\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`verificationExpires\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`verificationCode\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isVerified\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastname\``);
        await queryRunner.query(`ALTER TABLE \`exchange_rates\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
