import { Check, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { EmailStatus, InquiryKind, InquiryStatus, WorkField } from "./inquiry.constants";

/**
 * One message from the website's contact form: a hire request (the visitor picked "Hire me as ...") or a
 * general message. Rows are never trimmed, so the table doubles as the owner's history / journal.
 *
 * Plain varchar columns with CHECK constraints (instead of Postgres enums) keep later changes to the
 * allowed values a simple migration.
 */
@Entity("inquiries")
@Index("idx_inquiries_created", ["createdAt"])
@Index("idx_inquiries_field_created", ["field", "createdAt"])
@Index("idx_inquiries_status", ["status"])
@Check("chk_inquiries_kind", `"kind" IN ('hire','general')`)
@Check("chk_inquiries_field", `"field" IN ('architecture','photography','content-creation','consulting','other')`)
@Check("chk_inquiries_status", `"status" IN ('new','read','replied','archived')`)
@Check("chk_inquiries_email_status", `"email_status" IN ('pending','sent','failed','skipped')`)
@Check("chk_inquiries_contact", `"email" IS NOT NULL OR "phone" IS NOT NULL`)
export class Inquiry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 16 })
  kind: InquiryKind;

  /** The work-field tag the admin filters by. */
  @Column({ type: "varchar", length: 32, default: "other" })
  field: WorkField;

  @Column({ type: "varchar", length: 80 })
  name: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  email: string | null;

  @Column({ type: "varchar", length: 30, nullable: true })
  phone: string | null;

  /** The "Hire me as ..." label the visitor picked, kept as written. */
  @Column({ type: "varchar", length: 80, nullable: true })
  service: string | null;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "varchar", length: 16, default: "new" })
  status: InquiryStatus;

  /** Private notes the owner writes against an inquiry (never shown to the visitor). */
  @Column({ type: "text", nullable: true })
  notes: string | null;

  /** Whether the copy emailed to the owner's inbox went out. The row is the record either way. */
  @Column({ name: "email_status", type: "varchar", length: 16, default: "pending" })
  emailStatus: EmailStatus;

  @Column({ name: "email_error", type: "text", nullable: true })
  emailError: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt: Date;
}
