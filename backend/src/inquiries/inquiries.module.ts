import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminKeyGuard } from "../common/admin-key.guard";
import { RateLimitGuard } from "../common/rate-limit.guard";
import { AdminInquiriesController } from "./admin-inquiries.controller";
import { InquiriesController } from "./inquiries.controller";
import { InquiriesService } from "./inquiries.service";
import { Inquiry } from "./inquiry.entity";
import { MailService } from "./mail.service";

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  controllers: [InquiriesController, AdminInquiriesController],
  providers: [InquiriesService, MailService, RateLimitGuard, AdminKeyGuard],
})
export class InquiriesModule {}
