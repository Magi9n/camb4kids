import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddUserProfileFields1753070745206 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
