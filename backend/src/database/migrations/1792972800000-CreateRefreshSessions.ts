import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshSessions1792972800000 implements MigrationInterface {
  name = 'CreateRefreshSessions1792972800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token_hash" character varying(64) NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "revoked_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_sessions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_sessions_token_hash" UNIQUE ("token_hash"),
        CONSTRAINT "FK_refresh_sessions_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_refresh_sessions_user_id" ON "refresh_sessions" ("user_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "refresh_sessions"');
  }
}
