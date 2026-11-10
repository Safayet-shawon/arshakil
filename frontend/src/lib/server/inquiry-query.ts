import { STATUSES, WORK_FIELDS, type InquiryFilters, type InquiryStatus, type WorkField } from "../inquiry";

export const KINDS_LIST = ["hire", "general"] as const;

const oneOf = <T extends string>(list: readonly T[], v: string | null): T | undefined => (v && (list as readonly string[]).includes(v) ? (v as T) : undefined);
const int = (v: string | null, min: number, max: number) => {
  const n = Number(v);
  return v && Number.isInteger(n) && n >= min && n <= max ? n : undefined;
};
const date = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) && !Number.isNaN(Date.parse(v)) ? v : undefined);

/** Reads the feed's filters from a query string, dropping anything that is not valid. */
export function parseFilters(p: URLSearchParams): InquiryFilters {
  const q = p.get("q")?.trim().slice(0, 100);
  return {
    field: oneOf<WorkField>(WORK_FIELDS, p.get("field")),
    kind: oneOf(KINDS_LIST, p.get("kind")),
    status: oneOf<InquiryStatus>(STATUSES, p.get("status")),
    q: q || undefined,
    from: date(p.get("from")),
    to: date(p.get("to")),
    page: int(p.get("page"), 1, 10_000),
    pageSize: int(p.get("pageSize"), 1, 100),
  };
}
