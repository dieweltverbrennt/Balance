import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUsers1789399724689 implements MigrationInterface {
    name = 'AddNameToUsers1789399724689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}
