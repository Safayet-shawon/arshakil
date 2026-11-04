import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import type { ImportInquiriesDto, ListInquiriesQuery, MarkAllReadDto, UpdateInquiryDto } from "./dto/admin-inquiries.dto";
import type { CreateInquiryDto } from "./dto/create-inquiry.dto";
import { fieldFromService, WORK_FIELDS, KINDS, type InquiryKind, type WorkField } from "./inquiry.constants";
import { Inquiry } from "./inquiry.entity";
import { MailService } from "./mail.service";

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);
const DAY = 24 * 60 * 60 * 1000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface Counts { total: number; unread: number }
export interface InquirySummary { total: number; unread: number; byField: Record<WorkField, Counts>; byKind: Record<InquiryKind, Counts> }

@Injectable()
export class InquiriesService {
  private readonly log = new Logger(InquiriesService.name);

  constructor(@InjectRepository(Inquiry) private readonly repo: Repository<Inquiry>, private readonly mail: MailService) {}

  /** Saves the inquiry first (that is the record), then emails the owner without making the visitor wait. */
  async create(dto: CreateInquiryDto): Promise<Inquiry> {
    if (!dto.email && !dto.phone) throw new BadRequestException("Please give an email address or a phone number so I can reply.");
    const kind: InquiryKind = dto.service ? "hire" : "general";
    const row = await this.repo.save(
      this.repo.create({
        kind,
        field: dto.field ?? fieldFromService(dto.service),
        name: dto.name,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        service: dto.service ?? null,
        message: dto.message,
      }),
    );
    void this.deliver(row);
    return row;
  }

  private async deliver(row: Inquiry) {
    try {
      const r = await this.mail.notifyOwner(row);
      await this.repo.update(row.id, { emailStatus: r.status, emailError: r.status === "failed" ? r.error.slice(0, 500) : null });
    } catch (e) {
      this.log.error(`Could not record email status for ${row.id}: ${(e as Error).message}`);
    }
  }

  async list(q: ListInquiriesQuery) {
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 20;
    const qb = this.repo.createQueryBuilder("i");
    if (q.field) qb.andWhere("i.field = :field", { field: q.field });
    if (q.kind) qb.andWhere("i.kind = :kind", { kind: q.kind });
    if (q.status) qb.andWhere("i.status = :status", { status: q.status });
    if (q.q) {
      const like = `%${escapeLike(q.q.trim())}%`;
      qb.andWhere(new Brackets((b) => {
        for (const col of ["name", "email", "phone", "message", "service", "notes"]) b.orWhere(`i.${col} ILIKE :like`, { like });
      }));
    }
    if (q.from) qb.andWhere("i.createdAt >= :from", { from: new Date(q.from) });
    if (q.to) {
      // a bare date means "through the end of that day"
      const end = /^\d{4}-\d{2}-\d{2}$/.test(q.to) ? new Date(new Date(q.to).getTime() + DAY) : new Date(q.to);
      qb.andWhere("i.createdAt < :to", { to: end });
    }
    const [items, total] = await qb.orderBy("i.createdAt", "DESC").addOrderBy("i.id", "DESC").skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    return { items, total, page, pageSize };
  }

  /** Counts for the filter chips and the red "unread" badge. Not affected by the feed's filters. */
  async summary(): Promise<InquirySummary> {
    const rows = await this.repo
      .createQueryBuilder("i")
      .select("i.field", "field").addSelect("i.kind", "kind")
      .addSelect("COUNT(*)", "total").addSelect("COUNT(*) FILTER (WHERE i.status = 'new')", "unread")
      .groupBy("i.field").addGroupBy("i.kind")
      .getRawMany<{ field: WorkField; kind: InquiryKind; total: string; unread: string }>();

    const zero = (): Counts => ({ total: 0, unread: 0 });
    const out: InquirySummary = {
      total: 0, unread: 0,
      byField: Object.fromEntries(WORK_FIELDS.map((f) => [f, zero()])) as Record<WorkField, Counts>,
      byKind: Object.fromEntries(KINDS.map((k) => [k, zero()])) as Record<InquiryKind, Counts>,
    };
    for (const r of rows) {
      const total = Number(r.total), unread = Number(r.unread);
      out.total += total; out.unread += unread;
      out.byField[r.field].total += total; out.byField[r.field].unread += unread;
      out.byKind[r.kind].total += total; out.byKind[r.kind].unread += unread;
    }
    return out;
  }

  async update(id: string, dto: UpdateInquiryDto): Promise<Inquiry> {
    const row = await this.repo.findOneBy({ id });
    if (!row) throw new NotFoundException("Inquiry not found");
    if (dto.status !== undefined) row.status = dto.status;
    if (dto.notes !== undefined) row.notes = dto.notes.trim() === "" ? null : dto.notes;
    return this.repo.save(row);
  }

  async markAllRead(dto: MarkAllReadDto): Promise<{ updated: number }> {
    const r = await this.repo.update({ status: "new", ...(dto.field && { field: dto.field }), ...(dto.kind && { kind: dto.kind }) }, { status: "read" });
    return { updated: r.affected ?? 0 };
  }

  async remove(id: string): Promise<void> {
    const r = await this.repo.delete({ id });
    if (!r.affected) throw new NotFoundException("Inquiry not found");
  }

  /** One-time import of messages saved by the old store. Safe to run again: rows with the same id are skipped. */
  async importLegacy(dto: ImportInquiriesDto): Promise<{ imported: number; skipped: number }> {
    const rows = dto.messages
      .filter((m) => m.email || m.phone)
      .map((m) => ({
        ...(UUID.test(m.id) && { id: m.id }),
        kind: m.kind,
        field: fieldFromService(m.service),
        name: m.name.slice(0, 80),
        email: m.email || null,
        phone: m.phone || null,
        service: m.service || null,
        message: m.message,
        status: (m.status ?? (m.read ? "read" : "new")) as Inquiry["status"],
        notes: m.notes?.trim() || null,
        emailStatus: "skipped" as const,
        createdAt: new Date(m.createdAt),
      }));
    let imported = 0;
    for (let i = 0; i < rows.length; i += 500) {
      const r = await this.repo.createQueryBuilder().insert().into(Inquiry).values(rows.slice(i, i + 500)).orIgnore().returning("id").execute();
      imported += (r.raw as unknown[]).length;
    }
    return { imported, skipped: dto.messages.length - imported };
  }
}
