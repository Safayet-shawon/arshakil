import { Module } from "@nestjs/common";
import { ContentModule } from "./content/content.module";
import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health/health.controller";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [RedisModule, DatabaseModule, ContentModule, InquiriesModule],
  controllers: [HealthController],
})
export class AppModule {}
