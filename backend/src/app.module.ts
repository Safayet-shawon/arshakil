import { Module } from "@nestjs/common";
import { ContactModule } from "./contact/contact.module";
import { ContentModule } from "./content/content.module";
import { HealthController } from "./health/health.controller";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [RedisModule, ContentModule, ContactModule],
  controllers: [HealthController],
})
export class AppModule {}
