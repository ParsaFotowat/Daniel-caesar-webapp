import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, SearchX, ShieldOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/warranty/$serial")({
  head: ({ params }) => ({ meta: [
    { title: `Certificate ${params.serial} — Daniel Caesar` },
    { name: "description", content: "Digital warranty certificate for a Daniel Caesar timepiece." },
    { property: "og:title", content: `Certificate ${params.serial} — Daniel Caesar` },
    { property: "og:description", content: "Digital warranty certificate for a Daniel Caesar timepiece." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: CertificatePage,
});

const copy = {
  en: { kicker: "Digital certificate", loading: "Checking…", active: "Authentic & under warranty", pending: "Authentic — awaiting activation", void: "This warranty is void", none: "Serial not found", noneText: "Please check the number or contact our concierge.", model: "Model", retailer: "Retailer", sale: "Sale date", until: "Covered until", activate: "Activate your warranty", activateBody: "Register as the owner to start your 10-year warranty.", name: "Full name", phone: "Phone number", submit: "Activate", done: "Your warranty is now active.", invalid: "Please enter a valid name and phone.", back: "Check another serial", contact: "Contact concierge" },
  fa: { kicker: "گواهی دیجیتال", loading: "در حال بررسی…", active: "اصل و دارای گارانتی", pending: "اصل — در انتظار فعال‌سازی", void: "این گارانتی باطل شده است", none: "شماره سریال یافت نشد", noneText: "لطفاً شماره را بررسی کنید یا با پشتیبانی تماس بگیرید.", model: "مدل", retailer: "فروشنده", sale: "تاریخ فروش", until: "اعتبار تا", activate: "فعال‌سازی گارانتی", activateBody: "برای آغاز گارانتی ده‌ساله، به‌عنوان مالک ثبت‌نام کنید.", name: "نام کامل", phone: "شماره تماس", submit: "فعال‌سازی", done: "گارانتی شما فعال شد.", invalid: "لطفاً نام و شماره معتبر وارد کنید.", back: "بررسی سریال دیگر", contact: "تماس با پشتیبانی" },
};

function CertificatePage() {
  const { serial } = Route.useParams();
  const { locale } = useLanguage(); const t = copy[locale];
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["warranty", serial], queryFn: async () => {
    const { data, error } = await supabase.rpc("lookup_warranty", { _serial: serial });
    if (error) throw error; return data?.[0] ?? null;
  } });
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [msg, setMsg] = useState<string | null>(null);

  async function activate(e: FormEvent) {
    e.preventDefault();
    const { data } = await supabase.rpc("activate_warranty", { _serial: serial, _name: name, _phone: phone });
    if (data === "activated") { setMsg(t.done); qc.invalidateQueries({ queryKey: ["warranty", serial] }); } else setMsg(t.invalid);
  }

  const r = q.data;
  const until = r?.activated_at ? new Date(new Date(r.activated_at).setFullYear(new Date(r.activated_at).getFullYear() + 10)).toISOString().slice(0, 10) : "—";
  return <PageShell>
    <section className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t.kicker}</p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl" dir="ltr">{serial}</h1>
      <div aria-live="polite" className="mt-10">
        {q.isLoading && <p className="text-muted-foreground">{t.loading}</p>}
        {!q.isLoading && !r && <Box icon={<SearchX className="size-5" />} title={t.none}><p className="mt-2 text-sm text-muted-foreground">{t.noneText}</p></Box>}
        {r && <Box icon={r.status === "active" ? <CheckCircle2 className="size-5 text-primary" /> : r.status === "pending" ? <Clock className="size-5" /> : <ShieldOff className="size-5" />} title={t[r.status as "active" | "pending" | "void"]}>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <Item k={t.model} v={r.model} /><Item k={t.retailer} v={r.retailer ?? "—"} /><Item k={t.sale} v={r.sale_date ?? "—"} /><Item k={t.until} v={until} />
          </dl>
        </Box>}
        {r?.status === "pending" && <form onSubmit={activate} className="mt-6 rounded-lg border border-border bg-surface-deep p-6">
          <h2 className="font-display text-2xl">{t.activate}</h2><p className="mt-2 text-sm text-muted-foreground">{t.activateBody}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input required minLength={2} maxLength={120} aria-label={t.name} placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} className="min-h-12 rounded-full border border-input bg-background px-5 text-sm outline-none focus:border-primary" />
            <input required minLength={6} maxLength={30} type="tel" dir="ltr" aria-label={t.phone} placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} className="min-h-12 rounded-full border border-input bg-background px-5 text-sm outline-none focus:border-primary" />
          </div>
          <Button type="submit" className="mt-4">{t.submit}</Button>
        </form>}
        {msg && <p className="mt-4 text-sm text-primary">{msg}</p>}
      </div>
      <div className="mt-10 flex gap-6 text-sm"><Link to="/warranty" className="text-primary">{t.back}</Link><Link to="/contact" className="text-muted-foreground">{t.contact}</Link></div>
    </section>
  </PageShell>;
}

function Box({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-surface-soft p-6"><p className="flex items-center gap-2 font-display text-xl">{icon}{title}</p>{children}</div>;
}
function Item({ k, v }: { k: string; v: string }) {
  return <div><dt className="text-muted-foreground">{k}</dt><dd className="mt-1" dir="auto">{v}</dd></div>;
}
