import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { WatchCard } from "@/components/watch-card";
import { WatchShowcase } from "@/components/watch-showcase";
import { buttonStyles } from "@/components/ui/button";
import { assets, showroomCategories, watches } from "@/lib/catalog";
import { pick, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Daniel Caesar — Independent Horology" },
    { name: "description", content: "Discover Daniel Caesar watches, crafted with modern precision and quiet restraint." },
    { property: "og:title", content: "Daniel Caesar — Independent Horology" },
    { property: "og:description", content: "Discover Daniel Caesar watches, crafted with modern precision and quiet restraint." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: HomePage,
});

const copy = {
  en: { eyebrow: "Meridian Collection", title: "Time, composed in quiet light.", intro: "A study of restraint—hand-finished movements set inside cool, weightless forms. Precision you can feel before you can see.", explore: "Explore the collection", story: "Read our story", case: "Titanium case", reserve: "Power reserve", warranty: "Global warranty", categories: "Explore by character", categoriesBody: "From restrained dress watches to exposed mechanics, find the expression that belongs on your wrist.", selectedKicker: "Modern horology, precisely considered", selected: "The Daniel Caesar portfolio", selectedBody: "Five expressions of modern watchmaking, curated by purpose and character.", all: "View all watches", after: "After-care services", verifyTitle: "A lifetime of precision begins with verification.", verifyBody: "Use your serial number to access your digital certificate and warranty status.", verify: "Verify timepiece", atelier: "The craft within", atelierBody: "Discover the balance, bridges and patience behind every Daniel Caesar calibre.", read: "Read the journal" },
  fa: { eyebrow: "مجموعه مریدین", title: "زمان، ساخته‌شده در نوری آرام.", intro: "مطالعه‌ای در خویشتن‌داری؛ موتورهای پرداخت‌شده با دست در فرم‌هایی سبک و آرام. دقتی که پیش از دیدن، احساس می‌شود.", explore: "مشاهده مجموعه", story: "داستان ما", case: "قاب تیتانیوم", reserve: "ذخیره نیرو", warranty: "گارانتی جهانی", categories: "کشف بر اساس شخصیت", categoriesBody: "از ساعت‌های رسمی و آرام تا مکانیک آشکار، بیانی را پیدا کنید که به مچ شما تعلق دارد.", selectedKicker: "ساعت‌سازی مدرن، با نگاهی دقیق", selected: "مجموعه دانیل سیزار", selectedBody: "پنج بیان از ساعت‌سازی مدرن، انتخاب‌شده بر اساس کاربرد و شخصیت.", all: "همه ساعت‌ها", after: "خدمات پس از فروش", verifyTitle: "یک عمر دقت، با اصالت‌سنجی آغاز می‌شود.", verifyBody: "با شماره سریال، گواهی دیجیتال و وضعیت گارانتی ساعت خود را ببینید.", verify: "بررسی ساعت", atelier: "هنر درون ساعت", atelierBody: "تعادل، پل‌ها و صبری را کشف کنید که در قلب هر کالیبر دانیل سیزار قرار دارد.", read: "مطالعه مجله" },
};

function HomePage() {
  const { locale } = useLanguage(); const t = copy[locale];
  return <PageShell>
    <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_78%_5%,var(--surface-strong),transparent_34%)]">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-5 pb-16 pt-10 lg:grid-cols-12 lg:items-center lg:px-10 lg:pb-24 lg:pt-16">
        <div className="reveal-up lg:col-span-5 lg:pe-10"><div className="flex items-center gap-4"><span className="h-px w-9 bg-primary"/><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{t.eyebrow}</p></div><h1 className="mt-7 max-w-xl font-display text-5xl font-medium leading-[1.08] text-foreground sm:text-6xl lg:text-7xl">{t.title}</h1><p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">{t.intro}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/watches" className={buttonStyles.primary}>{t.explore}<ArrowRight className="size-4 rtl:rotate-180"/></Link><Link to="/brand" className={buttonStyles.outline}>{t.story}</Link></div><dl className="mt-12 grid grid-cols-3 gap-5 border-t border-border pt-7"><div><dt className="font-display text-2xl">41mm</dt><dd className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t.case}</dd></div><div><dt className="font-display text-2xl">72h</dt><dd className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t.reserve}</dd></div><div><dt className="font-display text-2xl">10yr</dt><dd className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t.warranty}</dd></div></dl></div>
        <div className="reveal-up lg:col-span-7"><Link to="/watches/$slug" params={{ slug: "meridian-41" }} className="group relative block overflow-hidden rounded-lg border border-border bg-surface-deep p-3"><div className="relative aspect-[4/5] overflow-hidden rounded-md sm:aspect-[6/5]"><img src={assets.heroImage} alt="Daniel Caesar Meridian 41 watch" width={1536} height={1280} fetchPriority="high" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.025]"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-6 pt-24 sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Reference DC-001</p><div className="mt-2 flex items-end justify-between gap-4"><h2 className="font-display text-2xl sm:text-3xl">Meridian 41 Automatic</h2><p className="hidden text-lg sm:block">€4,280</p></div></div></div></Link></div>
      </div>
    </section>
    <section className="border-b border-border bg-surface-deep py-16 lg:py-20">
      <div className="mx-auto mb-9 max-w-screen-2xl px-5 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Daniel Caesar · Showroom</p>
        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-display text-4xl sm:text-5xl">{t.categories}</h2>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">{t.categoriesBody}</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-screen-2xl snap-x snap-mandatory gap-1 overflow-x-auto px-5 pb-3 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-10">
        {showroomCategories.map((category) => (
          <Link key={category.label.en} to="/watches" className="group relative aspect-[3/5] min-w-[56vw] snap-start overflow-hidden bg-background sm:min-w-[34vw] lg:min-w-0">
            <img src={category.image} alt="" width={600} height={1000} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] group-hover:brightness-110" style={{ objectPosition: category.imagePosition }} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-xl text-foreground">{pick(category.label, locale)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{pick(category.detail, locale)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
    <WatchShowcase />
    <section className="mx-auto max-w-screen-2xl px-5 py-20 lg:px-10 lg:py-28"><div className="mb-12 text-center"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t.selectedKicker}</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl sm:text-5xl">{t.selected}</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">{t.selectedBody}</p><Link to="/watches" className="mt-6 inline-flex items-center gap-2 text-sm text-primary">{t.all}<ArrowRight className="size-4 rtl:rotate-180"/></Link></div><div className="grid gap-x-6 gap-y-12 md:grid-cols-2">{watches.slice(1,5).map((watch) => <WatchCard key={watch.slug} watch={watch}/>)}</div></section>
    <section className="border-y border-border bg-surface-deep"><div className="mx-auto grid max-w-screen-2xl gap-6 px-5 py-16 lg:grid-cols-12 lg:px-10 lg:py-24"><div className="rounded-lg border border-border bg-surface-soft p-7 sm:p-10 lg:col-span-7"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t.after}</p><h2 className="mt-5 max-w-2xl font-display text-3xl leading-tight sm:text-5xl">{t.verifyTitle}</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">{t.verifyBody}</p><Link to="/warranty" className={cn(buttonStyles.primary,"mt-8")}><ShieldCheck className="size-4"/>{t.verify}</Link></div><div className="overflow-hidden rounded-lg border border-border bg-background lg:col-span-5"><img src={assets.movementImage} alt="Daniel Caesar mechanical movement" width={1024} height={768} loading="lazy" className="aspect-video w-full object-cover"/><div className="p-7"><h3 className="font-display text-2xl">{t.atelier}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{t.atelierBody}</p><Link to="/journal" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{t.read}<ArrowRight className="size-4 rtl:rotate-180"/></Link></div></div></div></section>
  </PageShell>;
}