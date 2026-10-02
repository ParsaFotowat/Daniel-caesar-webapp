import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site-shell";
import { WatchCard } from "@/components/watch-card";
import { Button } from "@/components/ui/button";
import { watches } from "@/lib/catalog";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watches/")({ head: () => ({ meta: [
  { title: "Watch Collections — Daniel Caesar" }, { name: "description", content: "Browse Daniel Caesar watches by style, movement, material and performance." }, { property: "og:title", content: "Watch Collections — Daniel Caesar" }, { property: "og:description", content: "Browse Daniel Caesar watches by style, movement, material and performance." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: WatchesPage });

const styles = ["All", "Dress", "Sport", "Chronograph", "Skeleton"] as const;
const copy = { en: { eyebrow: "The showroom", title: "Find your measure of time.", intro: "Explore by silhouette or select the technical quality that matters most.", style: "Style", feature: "Feature", allFeatures: "All features", count: "timepieces" }, fa: { eyebrow: "شوروم", title: "معیار خود از زمان را بیابید.", intro: "بر اساس فرم ساعت جستجو کنید یا ویژگی فنی مهم برای خود را انتخاب کنید.", style: "سبک", feature: "ویژگی", allFeatures: "همه ویژگی‌ها", count: "ساعت" } };

function WatchesPage() {
  const { locale } = useLanguage(); const t = copy[locale];
  const [style, setStyle] = useState<(typeof styles)[number]>("All"); const [feature, setFeature] = useState("All features");
  const features = ["All features", ...Array.from(new Set(watches.flatMap((watch) => watch.features)))];
  const filtered = useMemo(() => watches.filter((watch) => (style === "All" || watch.style === style) && (feature === "All features" || watch.features.includes(feature))), [style, feature]);
  return <PageShell><section className="border-b border-border bg-surface-deep"><div className="mx-auto max-w-screen-2xl px-5 py-16 lg:px-10 lg:py-24"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t.eyebrow}</p><h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight sm:text-7xl">{t.title}</h1><p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">{t.intro}</p></div></section><section className="mx-auto max-w-screen-2xl px-5 py-12 lg:px-10 lg:py-16"><div className="mb-12 grid gap-6 border-b border-border pb-8 lg:grid-cols-2"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t.style}</p><div className="flex flex-wrap gap-2">{styles.map((item) => <Button key={item} variant="ghost" onClick={() => setStyle(item)} className={cn("border border-border px-4 text-xs", style === item && "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}>{item}</Button>)}</div></div><div><label htmlFor="feature" className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t.feature}</label><select id="feature" value={feature} onChange={(event) => setFeature(event.target.value)} className="min-h-11 w-full rounded-md border border-input bg-surface-deep px-4 text-sm text-foreground outline-none focus:border-primary lg:max-w-sm">{features.map((item) => <option key={item}>{item}</option>)}</select></div></div><p className="mb-6 text-sm text-muted-foreground">{filtered.length} {t.count}</p><div className="grid gap-x-6 gap-y-14 md:grid-cols-2">{filtered.map((watch) => <WatchCard key={watch.slug} watch={watch}/>)}</div></section></PageShell>;
}
