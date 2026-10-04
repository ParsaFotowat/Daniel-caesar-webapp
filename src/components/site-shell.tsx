import { Link } from "@tanstack/react-router";
import { Menu, Search, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, buttonStyles } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const copy = {
  en: { watches: "Watches", brand: "The Maison", journal: "Journal", warranty: "Warranty", retailers: "Retailers", contact: "Contact", menu: "Open menu", close: "Close menu", search: "Search", tagline: "Horology · Est. MMXIV", privacy: "Privacy", terms: "Terms", care: "Care guide", note: "Independent timepieces, composed in quiet light." },
  fa: { watches: "ساعت‌ها", brand: "درباره برند", journal: "مجله", warranty: "گارانتی", retailers: "نمایندگی‌ها", contact: "تماس", menu: "باز کردن منو", close: "بستن منو", search: "جستجو", tagline: "ساعت‌سازی · از ۲۰۱۴", privacy: "حریم خصوصی", terms: "قوانین", care: "راهنمای نگهداری", note: "ساعت‌های مستقل، ساخته‌شده در نوری آرام." },
};

export function SiteHeader() {
  const { locale, setLocale } = useLanguage();
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/watches" as const, label: t.watches },
    { to: "/brand" as const, label: t.brand },
    { to: "/journal" as const, label: t.journal },
    { to: "/retailers" as const, label: t.retailers },
    { to: "/contact" as const, label: t.contact },
  ];
  return (
    <header className="relative z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-5 lg:px-10">
        <Link to="/" className="group flex items-center gap-3" aria-label="Daniel Caesar home">
          <span className="grid size-10 place-items-center rounded-full border border-primary/60 font-display text-xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">D</span>
          <span className="leading-none">
            <span className="block font-display text-xl text-foreground">DANIEL CAESAR</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">{t.tagline}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: "text-primary" }} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-surface-soft p-1" aria-label="Language">
            {(["en", "fa"] as const).map((language) => <Button key={language} variant="ghost" onClick={() => setLocale(language)} className={cn("min-h-0 px-3 py-1 text-[10px] uppercase", locale === language && "bg-primary/15 text-primary")}>{language}</Button>)}
          </div>
          <Link to="/warranty" className={cn(buttonStyles.outline, "hidden min-h-9 px-4 py-2 text-xs sm:inline-flex")}><ShieldCheck className="size-4" />{t.warranty}</Link>
          <Link to="/watches" className="hidden size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-soft hover:text-foreground md:flex" aria-label={t.search}><Search className="size-4" /></Link>
          <Button variant="ghost" className="size-10 p-0 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? t.close : t.menu}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
        </div>
      </div>
      {open && <nav className="border-t border-border bg-background px-5 py-6 lg:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-1">{links.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="border-b border-border/70 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-foreground">{item.label}</Link>)}<Link to="/warranty" onClick={() => setOpen(false)} className="py-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">{t.warranty}</Link></div></nav>}
    </header>
  );
}

export function SiteFooter() {
  const { locale } = useLanguage();
  const t = copy[locale];
  return <footer className="border-t border-border bg-surface-deep"><div className="mx-auto grid max-w-screen-2xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-10"><div><p className="font-display text-2xl text-foreground">DANIEL CAESAR</p><p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{t.note}</p></div><div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.14em] text-muted-foreground lg:justify-center"><Link to="/brand">{t.terms}</Link><Link to="/brand">{t.privacy}</Link><Link to="/journal">{t.care}</Link><Link to="/retailers">{t.retailers}</Link><Link to="/contact">{t.contact}</Link></div><p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-1 lg:text-end">© 2026 Daniel Caesar Horology</p></div></footer>;
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}
