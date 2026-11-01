import { Module } from "@nestjs/common";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { RateLimitGuard } from "./rate-limit.guard";

@Module({
  controllers: [ContactController],
  providers: [ContactService, RateLimitGuard],
})
export class ContactModule {}
