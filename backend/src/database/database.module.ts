import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inquiry } from "../inquiries/inquiry.entity";
import { CreateInquiries1730700000000 } from "./migrations/1730700000000-CreateInquiries";

const isProd = process.env.NODE_ENV === "production";

/**
 * PostgreSQL via TypeORM. Set DATABASE_URL (e.g. postgres://user:pass@localhost:5432/arshakil).
 *
 * - Production: the schema is changed only by migrations, which run on start. `synchronize` is off.
 * - Development: `synchronize` builds the table from the entity for convenience (override with DB_SYNCHRONIZE=false).
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [Inquiry],
      migrations: [CreateInquiries1730700000000],
      migrationsRun: isProd,
      synchronize: !isProd && process.env.DB_SYNCHRONIZE !== "false",
      // PostgreSQL 13+ has gen_random_uuid() built in: no extension to install, so a restricted database user works.
      uuidExtension: "pgcrypto",
      installExtensions: false,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    }),
  ],
})
export class DatabaseModule {}
