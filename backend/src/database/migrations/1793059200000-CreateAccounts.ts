import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccounts1793059200000 implements MigrationInterface {
  name = 'CreateAccounts1793059200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_type_enum" AS ENUM('cash', 'debit', 'credit', 'savings')`,
    );
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "bank_name" character varying,
        "type" "public"."accounts_type_enum" NOT NULL,
        "currency_code" character(3) NOT NULL,
        "initial_balance" numeric(19,4) NOT NULL DEFAULT 0,
        "is_archived" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_accounts_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_accounts" (
        "user_id" uuid NOT NULL,
        "account_id" uuid NOT NULL,
        CONSTRAINT "PK_user_accounts" PRIMARY KEY ("user_id", "account_id"),
        CONSTRAINT "FK_user_accounts_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_user_accounts_account_id" FOREIGN KEY ("account_id")
          REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_user_accounts_account_id" ON "user_accounts" ("account_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "default_account_id" uuid`,
    );
    await queryRunner.query(`
      ALTER TABLE "users" ADD CONSTRAINT "FK_users_default_account_id"
      FOREIGN KEY ("default_account_id") REFERENCES "accounts"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_default_account_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "default_account_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_user_accounts_account_id"`,
    );
    await queryRunner.query(`DROP TABLE "user_accounts"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TYPE "public"."accounts_type_enum"`);
  }
}
