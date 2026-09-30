import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Watch } from "@/lib/catalog";
import { pick, useLanguage } from "@/lib/i18n";

export function WatchCard({ watch }: { watch: Watch }) {
  const { locale } = useLanguage();
  return <article className="group min-w-0">
    <Link to="/watches/$slug" params={{ slug: watch.slug }} className="block overflow-hidden rounded-lg border border-border bg-surface-deep">
      <div className="aspect-[4/3] overflow-hidden"><img src={watch.image} alt={watch.name} width={900} height={675} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" /></div>
    </Link>
    <div className="mt-4 flex items-start justify-between gap-4">
      <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{watch.style} · {pick(watch.collection, locale)}</p><h3 className="mt-2 font-display text-2xl text-foreground">{watch.name}</h3><p className="mt-1 text-sm text-muted-foreground">{watch.features.slice(0, 3).join(" · ")}</p></div>
      <Link to="/watches/$slug" params={{ slug: watch.slug }} className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label={`View ${watch.name}`}><ArrowUpRight className="size-4" /></Link>
    </div>
  </article>;
}
