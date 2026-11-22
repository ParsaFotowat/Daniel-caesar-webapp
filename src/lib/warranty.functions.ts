import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { buildActivationEmail } from "./warranty-email";
import { isWarrantyCode, normalizeCode } from "./warranty";

const input = z.object({
  code: z.string().refine(isWarrantyCode),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  locale: z.enum(["en", "fa"]),
});

/**
 * Sends through Resend when RESEND_API_KEY and WARRANTY_EMAIL_FROM are configured.
 * Returns false (and never throws) when email is not configured or the provider rejects it,
 * so a mail problem can never undo or block an activation.
 */
async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env['RESEND_API_KEY'];
  const from = process.env['WARRANTY_EMAIL_FROM'];
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.error("warranty email rejected", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("warranty email failed", error);
    return false;
  }
}

/** Activates a warranty by its code and emails the confirmation to the new owner. */
export const activateWarranty = createServerFn({ method: "POST" })
  .inputValidator(input)
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    const supabase = createClient<Database>(process.env['SUPABASE_URL']!, process.env['SUPABASE_PUBLISHABLE_KEY']!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: result, error } = await supabase.rpc("activate_warranty", {
      _code: code, _name: data.name, _email: data.email, _phone: data.phone ?? "",
    });
    if (error) throw new Error("Warranty activation failed");
    if (result !== "activated") return { result, emailed: false };

    const { data: rows } = await supabase.rpc("lookup_warranty", { _code: code });
    const record = rows?.[0];
    if (!record) return { result, emailed: false };
    const origin = process.env['SITE_URL'] ?? new URL(getRequest().url).origin;
    const mail = buildActivationEmail({ locale: data.locale, name: data.name, code, record, certificateUrl: `${origin}/warranty/${code}` });
    return { result, emailed: await sendEmail(data.email, mail.subject, mail.html) };
  });
