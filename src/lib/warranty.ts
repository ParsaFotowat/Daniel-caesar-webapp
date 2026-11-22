import type { Locale } from "./catalog";

/** Warranty term, counted from the moment of activation. */
export const WARRANTY_YEARS = 1;

/** Activation codes are 12 characters from an alphabet without 0, 1, I or O. */
export const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export const isWarrantyCode = (value: string) => /^[2-9A-HJ-NP-Z]{12}$/.test(normalizeCode(value));

/** ABCD-EFGH-JKLM, as printed on the warranty card. */
export const formatCode = (value: string) => normalizeCode(value).replace(/(.{4})(?=.)/g, "$1-");

export function formatDate(iso: string | null | undefined, locale: Locale) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : "en-GB", { dateStyle: "long" }).format(new Date(iso));
}

export type WarrantyStatus = "pending" | "active" | "expired" | "void";

export type WarrantyRecord = {
  serial: string;
  model: string;
  case_band: string | null;
  dial: string | null;
  status: string;
  activated_at: string | null;
  expires_at: string | null;
};
