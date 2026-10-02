import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, SearchX, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty Verification — Daniel Caesar" },
      { name: "description", content: "Verify the authenticity and warranty status of your Daniel Caesar timepiece by serial number." },
      { property: "og:title", content: "Warranty Verification — Daniel Caesar" },
      { property: "og:description", content: "Verify the authenticity and warranty status of your Daniel Caesar timepiece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WarrantyPage,
});

const demo: Record<string, { model: string; date: string; until: string }> = {
  "DC-2026-0001": { model: "Meridian 41", date: "2026-03-14", until: "2036-03-14" },
  "DC-2026-0042": { model: "Nocturne Skeleton", date: "2026-06-02", until: "2036-06-02" },
};

const copy = {
  en: { eyebrow: "After-care", title: "Verify your timepiece.", intro: "Enter the serial number engraved on the caseback or printed on your warranty card.", label: "Serial number", placeholder: "DC-2026-0001", submit: "Verify", demo: "Demonstration records: try DC-2026-0001 or DC-2026-0042.", ok: "Authentic & under warranty", model: "Model", date: "Purchase date", until: "Covered until", invalid: "Invalid format", invalidText: "Serial numbers look like DC-YYYY-0000.", none: "Not found", noneText: "We couldn't find this serial. Please contact our concierge." },
  fa: { eyebrow: "خدمات پس از فروش", title: "اصالت ساعت خود را بررسی کنید.", intro: "شماره سریال حک‌شده روی پشت قاب یا درج‌شده در کارت گارانتی را وارد کنید.", label: "شماره سریال", placeholder: "DC-2026-0001", submit: "بررسی", demo: "رکوردهای نمایشی: DC-2026-0001 یا DC-2026-0042 را امتحان کنید.", ok: "اصل و دارای گارانتی", model: "مدل", date: "تاریخ خرید", until: "اعتبار تا", invalid: "قالب نامعتبر", invalidText: "شماره سریال به شکل DC-YYYY-0000 است.", none: "یافت نشد", noneText: "این شماره سریال پیدا نشد. لطفاً با پشتیبانی تماس بگیرید." },
};

type State = { kind: "idle" } | { kind: "invalid" } | { kind: "none" } | { kind: "ok"; serial: string };

function WarrantyPage() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [serial, setSerial] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  function submit(e: FormEvent) {
    e.preventDefault();
    const s = serial.trim().toUpperCase();
    if (!/^DC-\d{4}-\d{4}$/.test(s)) return setState({ kind: "invalid" });
    setState(demo[s] ? { kind: "ok", serial: s } : { kind: "none" });
  }

  const rec = state.kind === "ok" ? demo[state.serial] : null;

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <ShieldCheck className="size-10 text-primary" />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">{t.title}</h1>
        <p className="mt-5 text-base leading-8 text-muted-foreground">{t.intro}</p>
        <form onSubmit={submit} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="serial" className="sr-only">{t.label}</label>
          <input id="serial" dir="ltr" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder={t.placeholder} className="min-h-12 flex-1 rounded-full border border-input bg-surface-deep px-6 text-sm tracking-widest text-foreground outline-none focus:border-primary" />
          <Button type="submit">{t.submit}</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">{t.demo}</p>
        <div aria-live="polite" className="mt-10">
          {rec && (
            <div className="rounded-lg border border-primary/50 bg-surface-soft p-6">
              <p className="flex items-center gap-2 font-display text-xl text-primary"><CheckCircle2 className="size-5" />{t.ok}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3 text-sm">
                <div><dt className="text-muted-foreground">{t.model}</dt><dd className="mt-1 text-foreground">{rec.model}</dd></div>
                <div><dt className="text-muted-foreground">{t.date}</dt><dd className="mt-1 text-foreground" dir="ltr">{rec.date}</dd></div>
                <div><dt className="text-muted-foreground">{t.until}</dt><dd className="mt-1 text-foreground" dir="ltr">{rec.until}</dd></div>
              </dl>
            </div>
          )}
          {state.kind === "invalid" && <Notice icon={<AlertTriangle className="size-5" />} title={t.invalid} text={t.invalidText} />}
          {state.kind === "none" && <Notice icon={<SearchX className="size-5" />} title={t.none} text={t.noneText} />}
        </div>
      </section>
    </PageShell>
  );
}

function Notice({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-soft p-6">
      <p className="flex items-center gap-2 font-display text-xl text-foreground">{icon}{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
