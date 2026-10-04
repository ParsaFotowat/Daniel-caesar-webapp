import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { retailers } from "@/lib/catalog";
import { pick, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/retailers")({
  head: () => ({ meta: [
    { title: "Authorised Retailers — Daniel Caesar" },
    { name: "description", content: "Find authorised Daniel Caesar boutiques and retail partners." },
    { property: "og:title", content: "Authorised Retailers — Daniel Caesar" },
    { property: "og:description", content: "Find authorised Daniel Caesar boutiques and retail partners." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: RetailersPage,
});

const copy = {
  en: { kicker: "Retail network", title: "Authorised retailers", body: "Every Daniel Caesar timepiece is sold with a verified warranty only through our authorised network.", badge: "Authorised dealer", map: "Open in maps" },
  fa: { kicker: "شبکه فروش", title: "نمایندگی‌های رسمی", body: "هر ساعت دانیل سیزار تنها از طریق شبکه رسمی و همراه با گارانتی معتبر عرضه می‌شود.", badge: "نماینده رسمی", map: "مشاهده روی نقشه" },
};

function RetailersPage() {
  const { locale } = useLanguage(); const t = copy[locale];
  const cities = Array.from(new Set(retailers.map((r) => pick(r.city, locale))));
  return <PageShell>
    <section className="mx-auto max-w-screen-2xl px-5 py-16 lg:px-10 lg:py-24">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t.kicker}</p>
      <h1 className="mt-4 font-display text-4xl sm:text-6xl">{t.title}</h1>
      <p className="mt-5 max-w-xl leading-7 text-muted-foreground">{t.body}</p>
      <div className="mt-14 space-y-14">
        {cities.map((city) => <div key={city}>
          <h2 className="border-b border-border pb-3 font-display text-2xl">{city}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {retailers.filter((r) => pick(r.city, locale) === city).map((r) => <article key={r.name} className="rounded-lg border border-border bg-surface-soft p-6">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary"><BadgeCheck className="size-4" />{t.badge}</p>
              <h3 className="mt-3 font-display text-xl">{r.name}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{pick(r.address, locale)}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground" dir="ltr"><Phone className="size-4" />{r.phone}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(r.mapQuery)}`} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-semibold text-primary">{t.map}</a>
            </article>)}
          </div>
        </div>)}
      </div>
    </section>
  </PageShell>;
}
