import type { MigrationInterface, QueryRunner } from "typeorm";

/** Creates the inquiries table (the owner's inbox / history). Mirrors inquiry.entity.ts. Needs PostgreSQL 13+ (built-in gen_random_uuid()). */
export class CreateInquiries1730700000000 implements MigrationInterface {
  name = "CreateInquiries1730700000000";

  async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE "inquiries" (
        "id"           uuid         NOT NULL DEFAULT gen_random_uuid(),
        "kind"         varchar(16)  NOT NULL,
        "field"        varchar(32)  NOT NULL DEFAULT 'other',
        "name"         varchar(80)  NOT NULL,
        "email"        varchar(120),
        "phone"        varchar(30),
        "service"      varchar(80),
        "message"      text         NOT NULL,
        "status"       varchar(16)  NOT NULL DEFAULT 'new',
        "notes"        text,
        "email_status" varchar(16)  NOT NULL DEFAULT 'pending',
        "email_error"  text,
        "created_at"   timestamptz  NOT NULL DEFAULT now(),
        "updated_at"   timestamptz  NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inquiries_id" PRIMARY KEY ("id"),
        CONSTRAINT "chk_inquiries_kind" CHECK ("kind" IN ('hire','general')),
        CONSTRAINT "chk_inquiries_field" CHECK ("field" IN ('architecture','photography','content-creation','consulting','other')),
        CONSTRAINT "chk_inquiries_status" CHECK ("status" IN ('new','read','replied','archived')),
        CONSTRAINT "chk_inquiries_email_status" CHECK ("email_status" IN ('pending','sent','failed','skipped')),
        CONSTRAINT "chk_inquiries_contact" CHECK ("email" IS NOT NULL OR "phone" IS NOT NULL)
      )`);
    await q.query(`CREATE INDEX "idx_inquiries_created" ON "inquiries" ("created_at")`);
    await q.query(`CREATE INDEX "idx_inquiries_field_created" ON "inquiries" ("field", "created_at")`);
    await q.query(`CREATE INDEX "idx_inquiries_status" ON "inquiries" ("status")`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE "inquiries"`);
  }
}
