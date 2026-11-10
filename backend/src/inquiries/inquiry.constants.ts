/**
 * The work fields an inquiry can be tagged with. They mirror the "Hire me as ..." services on the site,
 * plus `other` for general messages. The admin filters the feed by these.
 */
export const WORK_FIELDS = ["architecture", "photography", "content-creation", "consulting", "other"] as const;
export type WorkField = (typeof WORK_FIELDS)[number];

export const KINDS = ["hire", "general"] as const;
export type InquiryKind = (typeof KINDS)[number];

/** new -> read -> replied -> archived: the admin's own journal of what happened to each inquiry. */
export const STATUSES = ["new", "read", "replied", "archived"] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export const EMAIL_STATUSES = ["pending", "sent", "failed", "skipped"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

const BY_SLUG: Record<string, WorkField> = {
  architect: "architecture",
  "architectural-photographer": "photography",
  "content-creator": "content-creation",
  consultant: "consulting",
};

/** Maps a service slug (what the form sends) or its "Hire me as ..." label (older messages) to a work field. */
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
