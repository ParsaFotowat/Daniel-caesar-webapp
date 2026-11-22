import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, SearchX, ShieldOff, TimerOff } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";
import { formatCode, formatDate, type WarrantyStatus } from "@/lib/warranty";
import { activateWarranty } from "@/lib/warranty.functions";

export const Route = createFileRoute("/warranty/$code")({
  head: () => ({ meta: [
    { title: "Warranty Certificate — Daniel Caesar" },
    { name: "description", content: "Digital warranty certificate for a Daniel Caesar timepiece." },
    { property: "og:title", content: "Warranty Certificate — Daniel Caesar" },
    { property: "og:description", content: "Digital warranty certificate for a Daniel Caesar timepiece." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: CertificatePage,
});

const copy = {
  en: {
    kicker: "Digital certificate", loading: "Checking…", failed: "We could not check this code right now. Please try again.",
    status: { active: "Authentic & under warranty", pending: "Authentic — ready to activate", expired: "Authentic — warranty period ended", void: "This warranty is void" },
    none: "Code not found", noneText: "Please check the code on your warranty card or contact our concierge.",
    model: "Model", finish: "Case & dial", serial: "Serial number", from: "Activated on", until: "Covered until",
    activate: "Activate your warranty", activateBody: "Register as the owner to start your one-year warranty. The year begins today, and we will email you the confirmation.",
    name: "Full name", email: "Email address", phone: "Mobile number (optional)", submit: "Activate warranty", sending: "Activating…",
    done: "Your warranty is now active.", emailed: (email: string) => `A confirmation was sent to ${email}.`,
    invalid: "Please enter your name and a valid email address.", taken: "This warranty has already been activated.", error: "Something went wrong. Please try again.",
    back: "Enter another code", contact: "Contact concierge",
  },
  fa: {
    kicker: "گواهی دیجیتال", loading: "در حال بررسی…", failed: "در حال حاضر امکان بررسی این کد نیست. لطفاً دوباره تلاش کنید.",
    status: { active: "اصل و دارای گارانتی", pending: "اصل — آماده فعال‌سازی", expired: "اصل — دوره گارانتی پایان یافته", void: "این گارانتی باطل شده است" },
    none: "کد یافت نشد", noneText: "لطفاً کد روی کارت گارانتی را بررسی کنید یا با پشتیبانی تماس بگیرید.",
    model: "مدل", finish: "قاب و صفحه", serial: "شماره سریال", from: "تاریخ فعال‌سازی", until: "اعتبار تا",
    activate: "فعال‌سازی گارانتی", activateBody: "برای آغاز گارانتی یک‌ساله، مشخصات مالک را ثبت کنید. این یک سال از امروز شروع می‌شود و تأییدیه برای شما ایمیل خواهد شد.",
    name: "نام و نام خانوادگی", email: "نشانی ایمیل", phone: "شماره موبایل (اختیاری)", submit: "فعال‌سازی گارانتی", sending: "در حال فعال‌سازی…",
    done: "گارانتی شما فعال شد.", emailed: (email: string) => `تأییدیه به ${email} ارسال شد.`,
    invalid: "لطفاً نام و یک ایمیل معتبر وارد کنید.", taken: "این گارانتی پیش‌تر فعال شده است.", error: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    back: "وارد کردن کد دیگر", contact: "تماس با پشتیبانی",
  },
};

const icons: Record<WarrantyStatus, ReactNode> = {
  active: <CheckCircle2 className="size-5 text-primary" />,
  pending: <Clock className="size-5" />,
  expired: <TimerOff className="size-5" />,
  void: <ShieldOff className="size-5" />,
};

const field = "min-h-12 rounded-full border border-input bg-background px-5 text-sm outline-none focus:border-primary";

function CertificatePage() {
  const { code } = Route.useParams();
  const { locale } = useLanguage();
  const t = copy[locale];
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["warranty", code], queryFn: async () => {
    const { data, error } = await supabase.rpc("lookup_warranty", { _code: code });
    if (error) throw error;
    return data?.[0] ?? null;
  } });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "done" | "invalid" | "taken" | "error"; email?: string | undefined } | null>(null);

  async function activate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMsg({ kind: "invalid" });
    setBusy(true); setMsg(null);
    try {
      const res = await activateWarranty({ data: { code, name: String(f.get("name")), email, phone: String(f.get("phone") ?? ""), locale } });
      if (res.result === "activated") setMsg({ kind: "done", email: res.emailed ? email : undefined });
      else setMsg({ kind: res.result === "invalid" ? "invalid" : res.result === "active" ? "taken" : "error" });
      await qc.invalidateQueries({ queryKey: ["warranty", code] });
    } catch {
      setMsg({ kind: "error" });
    } finally {
      setBusy(false);
    }
  }

  const r = q.data;
  const status = r?.status as WarrantyStatus | undefined;
  return <PageShell>
    <section className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t.kicker}</p>
      <h1 className="mt-4 font-mono text-3xl tracking-widest sm:text-4xl" dir="ltr">{formatCode(code)}</h1>
      <div aria-live="polite" className="mt-10">
        {q.isLoading && <p className="text-muted-foreground">{t.loading}</p>}
        {q.isError && <Box icon={<SearchX className="size-5" />} title={t.failed} />}
        {q.isSuccess && !r && <Box icon={<SearchX className="size-5" />} title={t.none}><p className="mt-2 text-sm text-muted-foreground">{t.noneText}</p></Box>}
        {r && status && <Box icon={icons[status]} title={t.status[status]}>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Item k={t.model} v={r.model} ltr />
            <Item k={t.finish} v={[r.case_band, r.dial].filter(Boolean).join(" · ") || "—"} ltr />
            <Item k={t.serial} v={r.serial} ltr />
            {r.activated_at && <Item k={t.from} v={formatDate(r.activated_at, locale)} />}
            {r.expires_at && status !== "void" && <Item k={t.until} v={formatDate(r.expires_at, locale)} />}
          </dl>
        </Box>}
        {status === "pending" && <form onSubmit={activate} className="mt-6 rounded-lg border border-border bg-surface-deep p-6">
          <h2 className="font-display text-2xl">{t.activate}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{t.activateBody}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input name="name" required minLength={2} maxLength={120} autoComplete="name" aria-label={t.name} placeholder={t.name} className={`${field} sm:col-span-2`} />
            <input name="email" required type="email" maxLength={254} dir="ltr" autoComplete="email" aria-label={t.email} placeholder={t.email} className={field} />
            <input name="phone" type="tel" maxLength={30} dir="ltr" autoComplete="tel" aria-label={t.phone} placeholder={t.phone} className={field} />
          </div>
          <Button type="submit" className="mt-4" disabled={busy}>{busy ? t.sending : t.submit}</Button>
        </form>}
        {msg && <p className={`mt-4 text-sm ${msg.kind === "done" ? "text-primary" : "text-destructive"}`}>{t[msg.kind]}{msg.email && ` ${t.emailed(msg.email)}`}</p>}
      </div>
      <div className="mt-10 flex gap-6 text-sm"><Link to="/warranty" className="text-primary">{t.back}</Link><Link to="/contact" className="text-muted-foreground">{t.contact}</Link></div>
    </section>
  </PageShell>;
}

function Box({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return <div className="rounded-lg border border-border bg-surface-soft p-6"><p className="flex items-center gap-2 font-display text-xl">{icon}{title}</p>{children}</div>;
}
function Item({ k, v, ltr }: { k: string; v: string; ltr?: boolean }) {
  return <div><dt className="text-muted-foreground">{k}</dt><dd className="mt-1" dir={ltr ? "ltr" : undefined} style={ltr ? { unicodeBidi: "plaintext" } : undefined}>{v}</dd></div>;
}
