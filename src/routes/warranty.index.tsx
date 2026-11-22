import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { formatCode, isWarrantyCode, normalizeCode } from "@/lib/warranty";

export const Route = createFileRoute("/warranty/")({
  head: () => ({
    meta: [
      { title: "Warranty Activation — Daniel Caesar" },
      { name: "description", content: "Activate the one-year warranty of your Daniel Caesar timepiece and verify its authenticity with the code on your warranty card." },
      { property: "og:title", content: "Warranty Activation — Daniel Caesar" },
      { property: "og:description", content: "Activate and verify the warranty of your Daniel Caesar timepiece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WarrantyPage,
});

const copy = {
  en: { eyebrow: "After-care", title: "Activate your warranty.", intro: "Enter the 12-character code printed on your warranty card to activate your one-year warranty or check its status.", label: "Warranty code", submit: "Continue", hint: "You can also scan the QR code on the card — it opens this page with the code filled in.", invalid: "Check the code", invalidText: "The code has 12 letters and digits, for example ABCD-EFGH-JKLM. It never contains 0, 1, I or O." },
  fa: { eyebrow: "خدمات پس از فروش", title: "گارانتی خود را فعال کنید.", intro: "کد ۱۲ کاراکتری درج‌شده روی کارت گارانتی را وارد کنید تا گارانتی یک‌ساله فعال شود یا وضعیت آن را ببینید.", label: "کد گارانتی", submit: "ادامه", hint: "می‌توانید کد QR روی کارت را هم اسکن کنید؛ همین صفحه با کد واردشده باز می‌شود.", invalid: "کد را بررسی کنید", invalidText: "کد شامل ۱۲ حرف و رقم است، مانند ABCD-EFGH-JKLM و هرگز 0، 1، I یا O ندارد." },
};

function WarrantyPage() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!isWarrantyCode(code)) return setInvalid(true);
    navigate({ to: "/warranty/$code", params: { code: normalizeCode(code) } });
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <ShieldCheck className="size-10 text-primary" />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">{t.title}</h1>
        <p className="mt-5 text-base leading-8 text-muted-foreground">{t.intro}</p>
        <form onSubmit={submit} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="code" className="sr-only">{t.label}</label>
          <input id="code" dir="ltr" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={14} value={code} onChange={(e) => { setCode(formatCode(e.target.value)); setInvalid(false); }} placeholder="ABCD-EFGH-JKLM" className="min-h-12 flex-1 rounded-full border border-input bg-surface-deep px-6 font-mono text-base tracking-widest text-foreground outline-none focus:border-primary" />
          <Button type="submit">{t.submit}</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">{t.hint}</p>
        <div aria-live="polite" className="mt-10">
          {invalid && (
            <div className="rounded-lg border border-border bg-surface-soft p-6">
              <p className="flex items-center gap-2 font-display text-xl text-foreground"><AlertTriangle className="size-5" />{t.invalid}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.invalidText}</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
