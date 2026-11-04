import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { RateLimitGuard } from "../common/rate-limit.guard";
import { CreateInquiryDto } from "./dto/create-inquiry.dto";
import { InquiriesService } from "./inquiries.service";

const THANKS = "Thanks, your message was received. I'll reply soon.";

/** The website's contact form. `POST /api/contact` is kept as an alias of `POST /api/inquiries`. */
@Controller(["inquiries", "contact"])
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(RateLimitGuard)
  async create(@Body() dto: CreateInquiryDto) {
    // a filled-in honeypot means a bot: answer as if it worked, store nothing
    if (dto.website) return { id: null, message: THANKS };
    const { id } = await this.inquiries.create(dto);
    return { id, message: THANKS };
  }
}
