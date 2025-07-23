import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddBuySellPercentToAdminSettings1753233643203 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
