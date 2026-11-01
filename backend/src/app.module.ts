import { Module } from "@nestjs/common";
import { ContactModule } from "./contact/contact.module";
import { ContentModule } from "./content/content.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [ContentModule, ContactModule],
  controllers: [HealthController],
})
export class AppModule {}
