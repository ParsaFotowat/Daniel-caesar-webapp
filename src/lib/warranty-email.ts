import type { Locale } from "./catalog";
import { formatCode, formatDate, type WarrantyRecord } from "./warranty";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const copy = {
  en: {
    subject: "Your Daniel Caesar warranty is active",
    hello: (name: string) => `Dear ${name},`,
    body: "Thank you for registering your Daniel Caesar timepiece. Your one-year warranty is now active.",
    model: "Model", finish: "Case & dial", serial: "Serial number", code: "Warranty code", from: "Activated on", until: "Covered until",
    link: "View your digital certificate",
    foot: "Keep this email as proof of your warranty. If you did not register this watch, please contact us.",
  },
  fa: {
    subject: "گارانتی ساعت Daniel Caesar شما فعال شد",
    hello: (name: string) => `${name} گرامی،`,
    body: "از ثبت ساعت Daniel Caesar خود سپاسگزاریم. گارانتی یک‌ساله شما اکنون فعال است.",
    model: "مدل", finish: "قاب و صفحه", serial: "شماره سریال", code: "کد گارانتی", from: "تاریخ فعال‌سازی", until: "اعتبار تا",
    link: "مشاهده گواهی دیجیتال",
    foot: "این ایمیل را به‌عنوان سند گارانتی نگه دارید. اگر شما این ساعت را ثبت نکرده‌اید، لطفاً با ما تماس بگیرید.",
  },
};

export function buildActivationEmail(input: { locale: Locale; name: string; code: string; record: WarrantyRecord; certificateUrl: string }) {
  const { locale, record } = input;
  const t = copy[locale];
  const rtl = locale === "fa";
  const rows: [string, string, boolean][] = [
    [t.model, record.model, true],
    [t.finish, [record.case_band, record.dial].filter(Boolean).join(" · ") || "—", true],
    [t.serial, record.serial, true],
    [t.code, formatCode(input.code), true],
    [t.from, formatDate(record.activated_at, locale), false],
    [t.until, formatDate(record.expires_at, locale), false],
  ];
  const html = `<!doctype html><html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}"><body style="margin:0;background:#f4f1ea;font-family:Tahoma,Arial,sans-serif;color:#1b1b1b">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
<p style="font-size:22px;letter-spacing:3px;text-align:center;margin:0 0 24px" dir="ltr">DANIEL CAESAR</p>
<div style="background:#ffffff;border:1px solid #e2dccf;border-radius:8px;padding:28px">
<p style="margin:0 0 12px;font-size:16px">${escapeHtml(t.hello(input.name))}</p>
<p style="margin:0 0 20px;font-size:14px;line-height:1.8">${t.body}</p>
<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">${rows
    .map(([k, v, ltr]) => `<tr><td style="padding:8px 0;color:#6b6558;border-top:1px solid #eee8dc">${k}</td><td style="padding:8px 0;border-top:1px solid #eee8dc;text-align:${rtl ? "left" : "right"}"${ltr ? ' dir="ltr"' : ""}>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
<p style="margin:24px 0 0;text-align:center"><a href="${escapeHtml(input.certificateUrl)}" style="display:inline-block;background:#1b1b1b;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px">${t.link}</a></p>
</div>
<p style="margin:20px 0 0;font-size:12px;line-height:1.7;color:#6b6558;text-align:center">${t.foot}</p>
</div></body></html>`;
  return { subject: t.subject, html };
}
