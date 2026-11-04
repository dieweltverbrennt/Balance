import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeAccountsPersonal1793145600000 implements MigrationInterface {
  name = 'MakeAccountsPersonal1793145600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "accounts" ADD "user_id" uuid`);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM "user_accounts"
          GROUP BY "account_id"
          HAVING COUNT(DISTINCT "user_id") > 1
        ) THEN
          RAISE EXCEPTION 'Cannot make accounts personal while shared accounts exist';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM "accounts" account
          LEFT JOIN "user_accounts" membership ON membership."account_id" = account."id"
          WHERE membership."user_id" IS NULL
        ) THEN
          RAISE EXCEPTION 'Cannot make accounts personal while an account has no user';
        END IF;
      END $$
    `);
    await queryRunner.query(`
      UPDATE "accounts" account
      SET "user_id" = membership."user_id"
      FROM "user_accounts" membership
      WHERE membership."account_id" = account."id"
    `);
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "accounts" ADD CONSTRAINT "FK_accounts_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_accounts_user_id" ON "accounts" ("user_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_user_accounts_account_id"`,
    );
    await queryRunner.query(`DROP TABLE "user_accounts"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`
      INSERT INTO "user_accounts" ("user_id", "account_id")
      SELECT "user_id", "id" FROM "accounts"
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_user_accounts_account_id" ON "user_accounts" ("account_id")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_accounts_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_accounts_user_id"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "user_id"`);
  }
}
