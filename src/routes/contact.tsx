import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact the Concierge — Daniel Caesar" },
    { name: "description", content: "Reach the Daniel Caesar concierge for appointments, after-care and enquiries." },
    { property: "og:title", content: "Contact the Concierge — Daniel Caesar" },
    { property: "og:description", content: "Reach the Daniel Caesar concierge for appointments, after-care and enquiries." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ContactPage,
});

const copy = {
  en: { kicker: "Concierge", title: "Speak with us.", body: "Book a private viewing, ask about after-care, or find the right timepiece.", name: "Name", contact: "Email or phone", topic: "Topic", topics: ["Private viewing", "After-care & warranty", "Retail partnership", "Other"], message: "Message", send: "Send message", sent: "Thank you — our concierge will reply shortly.", error: "Something went wrong. Please try again.", address: "Elahieh, Fereshteh St., Tehran", hours: "Sat–Thu · 10:00–20:00" },
  fa: { kicker: "پشتیبانی", title: "با ما در ارتباط باشید.", body: "برای بازدید خصوصی، خدمات پس از فروش یا انتخاب ساعت مناسب با ما تماس بگیرید.", name: "نام", contact: "ایمیل یا تلفن", topic: "موضوع", topics: ["بازدید خصوصی", "خدمات و گارانتی", "همکاری فروش", "سایر"], message: "پیام", send: "ارسال پیام", sent: "سپاسگزاریم — به‌زودی پاسخ می‌دهیم.", error: "خطایی رخ داد. دوباره تلاش کنید.", address: "تهران، الهیه، خیابان فرشته", hours: "شنبه تا پنجشنبه · ۱۰ تا ۲۰" },
};

const field = "min-h-12 w-full rounded-lg border border-input bg-surface-deep px-4 text-sm outline-none focus:border-primary";

function ContactPage() {
  const { locale } = useLanguage(); const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("sending");
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from("contact_messages").insert({ name: String(f.get("name")).trim(), contact: String(f.get("contact")).trim(), topic: String(f.get("topic")), message: String(f.get("message")).trim() });
    if (error) return setStatus("error");
    setStatus("sent"); e.currentTarget.reset();
  }
  return <PageShell>
    <section className="mx-auto grid max-w-screen-2xl gap-14 px-5 py-16 lg:grid-cols-12 lg:px-10 lg:py-24">
      <div className="lg:col-span-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{t.kicker}</p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl">{t.title}</h1>
        <p className="mt-5 max-w-md leading-7 text-muted-foreground">{t.body}</p>
        <ul className="mt-10 space-y-4 text-sm text-muted-foreground">
          <li className="flex gap-3"><MapPin className="size-4 text-primary" />{t.address}</li>
          <li className="flex gap-3"><Clock className="size-4 text-primary" />{t.hours}</li>
          <li className="flex gap-3" dir="ltr"><Phone className="size-4 text-primary" />+98 21 0000 0001</li>
          <li className="flex gap-3"><Mail className="size-4 text-primary" /><a href="mailto:concierge@danielcaesar.com">concierge@danielcaesar.com</a></li>
        </ul>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-surface-soft p-6 sm:p-8 lg:col-span-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-muted-foreground">{t.name}<input name="name" required maxLength={120} className={`${field} mt-2`} /></label>
          <label className="text-xs text-muted-foreground">{t.contact}<input name="contact" required minLength={3} maxLength={160} className={`${field} mt-2`} /></label>
        </div>
        <label className="block text-xs text-muted-foreground">{t.topic}<select name="topic" className={`${field} mt-2`}>{t.topics.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="block text-xs text-muted-foreground">{t.message}<textarea name="message" required maxLength={4000} rows={6} className={`${field} mt-2 py-3`} /></label>
        <Button type="submit" disabled={status === "sending"}>{t.send}</Button>
        <p aria-live="polite" className="text-sm text-primary">{status === "sent" ? t.sent : status === "error" ? t.error : ""}</p>
      </form>
    </section>
  </PageShell>;
}
