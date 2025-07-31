import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOperationsTable1754000000001 implements MigrationInterface {
    name = 'CreateOperationsTable1754000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla operations
        await queryRunner.query(`
            CREATE TABLE \`operations\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`nombre\` varchar(100) NOT NULL,
                \`dni\` varchar(20) NOT NULL,
                \`telefono\` varchar(20) NOT NULL,
                \`importe_envia\` decimal(12,2) NOT NULL,
                \`importe_recibe\` decimal(12,2) NOT NULL,
                \`tipo_cambio\` decimal(12,4) NOT NULL,
                \`moneda_envia\` varchar(10) NOT NULL,
                \`moneda_recibe\` varchar(10) NOT NULL,
                \`estado\` varchar(30) NOT NULL DEFAULT 'Falta Transferir',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // Agregar foreign key para operations
        await queryRunner.query(`
            ALTER TABLE \`operations\` ADD CONSTRAINT \`FK_operations_user\` 
            FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`operations\` DROP FOREIGN KEY \`FK_operations_user\``);
        await queryRunner.query(`DROP TABLE \`operations\``);
    }
} 