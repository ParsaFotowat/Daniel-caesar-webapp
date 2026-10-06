import { Link } from "@tanstack/react-router";
import { ArrowRight, CircleGauge, Gem, ScanSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonStyles } from "@/components/ui/button";
import { assets, watches, type Watch } from "@/lib/catalog";
import { pick, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    signature: "Signature timepieces",
    signatureBody: "Move through the portfolio and study each expression of Daniel Caesar watchmaking.",
    discover: "Discover the timepiece",
    reference: "Reference",
    closer: "A closer look",
    closerTitle: "Details, resolved at every scale.",
    closerBody: "Select a point of craftsmanship to see how material, proportion and engineering meet on the wrist.",
    precision: "Precision within",
    precisionTitle: "Mechanical clarity, shaped by hand.",
    precisionBody: "Every calibre is conceived as part of the watch—not hidden machinery, but an architecture of energy, balance and finish.",
    reserve: "Power reserve",
    finishing: "Hand-finished surfaces",
    coverage: "International coverage",
  },
  fa: {
    signature: "ساعت‌های شاخص",
    signatureBody: "در مجموعه حرکت کنید و هر بیان از ساعت‌سازی دانیل سیزار را با دقت ببینید.",
    discover: "مشاهده ساعت",
    reference: "مرجع",
    closer: "نگاهی نزدیک‌تر",
    closerTitle: "جزئیات، دقیق در هر مقیاس.",
    closerBody: "بخشی از هنر ساخت را انتخاب کنید تا پیوند متریال، تناسب و مهندسی روی مچ را ببینید.",
    precision: "دقت درون ساعت",
    precisionTitle: "شفافیت مکانیکی، شکل‌گرفته با دست.",
    precisionBody: "هر کالیبر بخشی از هویت ساعت است؛ نه مکانیکی پنهان، بلکه معماری انرژی، تعادل و پرداخت.",
    reserve: "ذخیره نیرو",
    finishing: "سطوح پرداخت‌شده با دست",
    coverage: "پوشش بین‌المللی",
  },
};

export function WatchShowcase() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [selectedSlug, setSelectedSlug] = useState(watches[0].slug);
  const selected = watches.find((watch) => watch.slug === selectedSlug) ?? watches[0];
  const [detailKey, setDetailKey] = useState<Watch["details"][number]["key"]>("dial");
  const detail = selected.details.find((item) => item.key === detailKey) ?? selected.details[0];

  useEffect(() => setDetailKey("dial"), [selectedSlug]);

  return (
    <>
      <section className="border-y border-border bg-surface-deep py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-5 lg:px-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Daniel Caesar · Portfolio</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">{t.signature}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">{t.signatureBody}</p>
          </div>

          <div className="mt-10 flex snap-x gap-2 overflow-x-auto pb-3" role="tablist" aria-label={t.signature}>
            {watches.map((watch, index) => (
              <Button
                key={watch.slug}
                type="button"
                role="tab"
                aria-selected={selected.slug === watch.slug}
                variant={selected.slug === watch.slug ? "primary" : "outline"}
                onClick={() => setSelectedSlug(watch.slug)}
                className="shrink-0 snap-start"
              >
                <span className="text-xs text-current/60">0{index + 1}</span>{watch.name}
              </Button>
            ))}
          </div>

          <div className="mt-8 grid overflow-hidden border border-border bg-background lg:grid-cols-12">
            <div className="relative min-h-[28rem] overflow-hidden lg:col-span-7 lg:min-h-[42rem]">
              <img src={selected.image} alt={selected.name} width={1536} height={1280} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <p className="absolute bottom-6 start-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{t.reference} · DC-0{watches.indexOf(selected) + 1}</p>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-5 lg:p-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{pick(selected.collection, locale)} · {selected.style}</p>
              <h3 className="mt-5 font-display text-4xl sm:text-5xl">{selected.name}</h3>
              <p className="mt-3 text-lg text-foreground">{selected.price}</p>
              <p className="mt-7 text-base leading-8 text-muted-foreground">{pick(selected.story, locale)}</p>
              <dl className="mt-9 grid grid-cols-2 gap-px border border-border bg-border">
                {selected.specs.slice(0, 4).map((spec) => <div key={spec.label.en} className="bg-background p-4"><dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{pick(spec.label, locale)}</dt><dd className="mt-2 text-sm">{pick(spec.value, locale)}</dd></div>)}
              </dl>
              <Link to="/watches/$slug" params={{ slug: selected.slug }} className={cn(buttonStyles.primary, "mt-9 self-start")}>{t.discover}<ArrowRight className="size-4 rtl:rotate-180" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t.closer}</p>
              <h2 className="mt-4 max-w-lg font-display text-4xl leading-tight sm:text-5xl">{t.closerTitle}</h2>
            </div>
            <p className="max-w-xl leading-8 text-muted-foreground lg:col-span-7 lg:justify-self-end">{t.closerBody}</p>
          </div>
          <div className="mt-12 grid overflow-hidden border border-border bg-surface-deep lg:grid-cols-12">
            <div className="relative min-h-[25rem] lg:col-span-8 lg:min-h-[39rem]">
              <img src={detailKey === "movement" ? assets.calibreDetailImage : assets.dialDetailImage} alt={detailKey === "movement" ? "Daniel Caesar mechanical calibre detail" : "Daniel Caesar dial detail"} width={1600} height={1008} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent rtl:bg-gradient-to-l" />
              <div className="absolute bottom-6 start-6 max-w-sm border-s-2 border-primary ps-4">
                <p className="font-display text-2xl">{pick(detail.label, locale)}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{pick(detail.description, locale)}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-5 lg:col-span-4 lg:p-8">
              {selected.details.map((item, index) => (
                <Button key={item.key} type="button" variant="ghost" onClick={() => setDetailKey(item.key)} className={cn("h-auto min-h-0 justify-between rounded-none border-b border-border px-2 py-5 text-start", detailKey === item.key && "text-primary")}>
                  <span className="flex items-center gap-3"><span className="text-xs text-muted-foreground">0{index + 1}</span><span className="font-display text-lg">{pick(item.label, locale)}</span></span>
                  <ScanSearch className="size-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[42rem] overflow-hidden border-y border-border">
        <img src={assets.calibreDetailImage} alt="Daniel Caesar calibre architecture" width={1600} height={1008} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10 rtl:bg-gradient-to-l" />
        <div className="relative mx-auto flex min-h-[42rem] max-w-screen-2xl items-center px-5 py-20 lg:px-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t.precision}</p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">{t.precisionTitle}</h2>
            <p className="mt-6 leading-8 text-muted-foreground">{t.precisionBody}</p>
            <div className="mt-9 grid grid-cols-3 gap-3 border-y border-border py-6">
              <div><CircleGauge className="size-5 text-primary"/><p className="mt-3 font-display text-lg">72h</p><p className="mt-1 text-xs text-muted-foreground">{t.reserve}</p></div>
              <div><Gem className="size-5 text-primary"/><p className="mt-3 font-display text-lg">21</p><p className="mt-1 text-xs text-muted-foreground">{t.finishing}</p></div>
              <div><ScanSearch className="size-5 text-primary"/><p className="mt-3 font-display text-lg">10yr</p><p className="mt-1 text-xs text-muted-foreground">{t.coverage}</p></div>
            </div>
            <Link to="/watches/$slug" params={{ slug: "nocturne-skeleton" }} className={cn(buttonStyles.outline, "mt-8")}>{t.discover}<ArrowRight className="size-4 rtl:rotate-180" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}