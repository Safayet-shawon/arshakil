import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminKeyGuard } from "../common/admin-key.guard";
import { ImportInquiriesDto, ListInquiriesQuery, MarkAllReadDto, UpdateInquiryDto } from "./dto/admin-inquiries.dto";
import { InquiriesService } from "./inquiries.service";

/** The owner's inbox / history. Called only by the Next.js server, which holds ADMIN_API_KEY. */
@Controller("admin/inquiries")
@UseGuards(AdminKeyGuard)
export class AdminInquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Get() list(@Query() q: ListInquiriesQuery) { return this.inquiries.list(q); }
  @Get("summary") summary() { return this.inquiries.summary(); }
  @Post("mark-all-read") @HttpCode(200) markAllRead(@Body() dto: MarkAllReadDto) { return this.inquiries.markAllRead(dto); }
  @Post("import") @HttpCode(200) importLegacy(@Body() dto: ImportInquiriesDto) { return this.inquiries.importLegacy(dto); }
  @Patch(":id") update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateInquiryDto) { return this.inquiries.update(id, dto); }
  @Delete(":id") @HttpCode(204) async remove(@Param("id", ParseUUIDPipe) id: string) { await this.inquiries.remove(id); }
}
