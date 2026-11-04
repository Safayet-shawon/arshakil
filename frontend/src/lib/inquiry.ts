/**
 * Inquiries (hire requests + messages): the shared vocabulary, safe for browser and server.
 * Keep WORK_FIELDS and fieldFromService in step with backend/src/inquiries/inquiry.constants.ts.
 */
export const WORK_FIELDS = ["architecture", "photography", "content-creation", "consulting", "other"] as const;
export type WorkField = (typeof WORK_FIELDS)[number];

export const FIELD_LABEL: Record<WorkField, string> = {
  architecture: "Architecture",
  photography: "Photography",
  "content-creation": "Content creation",
  consulting: "Consulting",
  other: "Other",
};

export const STATUSES = ["new", "read", "replied", "archived"] as const;
export type InquiryStatus = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<InquiryStatus, string> = { new: "New", read: "Read", replied: "Replied", archived: "Archived" };

export type InquiryKind = "hire" | "general";

export interface Inquiry {
  id: string;
  kind: InquiryKind;
  field: WorkField;
  name: string;
  email: string | null;
  phone: string | null;
  service: string | null;
  message: string;
  status: InquiryStatus;
  notes: string | null;
  emailStatus: "pending" | "sent" | "failed" | "skipped";
  emailError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryPage { items: Inquiry[]; total: number; page: number; pageSize: number }
export interface Counts { total: number; unread: number }
export interface InquirySummary {
  total: number; unread: number;
  byField: Record<WorkField, Counts>; byKind: Record<InquiryKind, Counts>;
  /** Messages still in the previous (Blob) store that can be imported into the database. */
  legacyPending?: number;
}

export interface InquiryFilters { field?: WorkField; kind?: InquiryKind; status?: InquiryStatus; q?: string; from?: string; to?: string; page?: number; pageSize?: number }

const BY_SLUG: Record<string, WorkField> = {
  architect: "architecture",
  "architectural-photographer": "photography",
  "content-creator": "content-creation",
  consultant: "consulting",
};

/** Maps a service slug (what the form knows) or its "Hire me as ..." label (older messages) to a work field. */
export function fieldFromService(service?: string | null): WorkField {
  const s = (service ?? "").trim().toLowerCase();
  if (!s) return "other";
  if (BY_SLUG[s]) return BY_SLUG[s];
  if (s.includes("architectural photo") || s.includes("photograph")) return "photography";
  if (s.includes("architect")) return "architecture";
  if (s.includes("content") || s.includes("video") || s.includes("film")) return "content-creation";
  if (s.includes("consult")) return "consulting";
  return "other";
}
