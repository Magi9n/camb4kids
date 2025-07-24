import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAlertTable1754000000000 implements MigrationInterface {
    name = 'CreateAlertTable1754000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`alerts\` DROP FOREIGN KEY \`FK_alerts_user\``);
        await queryRunner.query(`DROP TABLE \`alerts\``);
    }
} 