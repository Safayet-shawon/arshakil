import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { RateLimitGuard } from "./rate-limit.guard";

@Controller("contact")
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(RateLimitGuard)
  async create(@Body() dto: CreateContactDto) {
    const { id } = await this.contact.create(dto);
    return { id, message: "Thanks — your message has been received." };
  }
}
