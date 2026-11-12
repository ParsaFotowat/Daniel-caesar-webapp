import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useLanguage } from "@/lib/i18n";
import { formatCode, formatDate, normalizeCode } from "@/lib/warranty";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Staff Panel — Daniel Caesar" },
    { name: "description", content: "Daniel Caesar staff panel for warranty records." },
    { property: "og:title", content: "Staff Panel — Daniel Caesar" },
    { property: "og:description", content: "Daniel Caesar staff panel for warranty records." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminPage,
});

const copy = {
  en: {
    title: "Staff panel", email: "Email", password: "Password", signIn: "Sign in", signUp: "Create account", toUp: "Need an account? Sign up", toIn: "Have an account? Sign in", confirm: "Check your email to confirm your account.", signOut: "Sign out",
    noAccess: "Your account does not have staff access yet. Ask the owner to grant the admin role.",
    stats: { total: "Codes generated", pending: "Not activated", active: "Activated", void: "Void" },
    generate: "Generate warranty codes", generateBody: "Each watch gets its own serial and secret 12-character code. Pick a model, then generate the whole order or a single colour.",
    model: "Model", variants: "colours", barcode: "Barcode", finish: "Case & band", dial: "Dial", ordered: "Ordered", generated: "Generated", qty: "Qty", make: "Generate",
    makeAll: (n: number) => `Generate the remaining ${n} for this model`, allDone: "Every ordered watch of this model has a code.", made: (n: number) => `${n} codes created.`,
    batches: "Recent batches", date: "Created", labels: "QR labels", csv: "CSV", modelCsv: "Download CSV for this model", noBatches: "No codes generated yet.",
    print: "Print", close: "Close", loadingLabels: "Preparing labels…", scan: "Scan to activate your warranty",
    search: "Find a warranty", searchHint: "Serial, code, owner name or email", find: "Search", all: "All statuses",
    serial: "Serial", code: "Code", status: "Status", owner: "Owner", until: "Covered until", void: "Void", voidAsk: (s: string) => `Void the warranty for ${s}? The customer will see it as void.`, none: "No matching warranties.",
    st: { pending: "Not activated", active: "Active", void: "Void" } as Record<string, string>,
    messages: "Contact messages",
  },
  fa: {
    title: "پنل کارکنان", email: "ایمیل", password: "رمز عبور", signIn: "ورود", signUp: "ساخت حساب", toUp: "حساب ندارید؟ ثبت‌نام", toIn: "حساب دارید؟ ورود", confirm: "برای تأیید حساب، ایمیل خود را بررسی کنید.", signOut: "خروج",
    noAccess: "حساب شما هنوز دسترسی کارکنان ندارد. از مالک بخواهید نقش مدیر را به شما بدهد.",
    stats: { total: "کدهای تولیدشده", pending: "فعال‌نشده", active: "فعال‌شده", void: "باطل" },
    generate: "تولید کد گارانتی", generateBody: "هر ساعت یک سریال و یک کد محرمانه ۱۲ کاراکتری می‌گیرد. مدل را انتخاب کنید و برای کل سفارش یا یک رنگ کد بسازید.",
    model: "مدل", variants: "رنگ", barcode: "بارکد", finish: "قاب و بند", dial: "صفحه", ordered: "سفارش", generated: "تولیدشده", qty: "تعداد", make: "تولید",
    makeAll: (n: number) => `تولید ${n} کد باقی‌مانده این مدل`, allDone: "همه ساعت‌های سفارش‌شده این مدل کد دارند.", made: (n: number) => `${n} کد ساخته شد.`,
    batches: "آخرین سری‌ها", date: "تاریخ", labels: "برچسب QR", csv: "CSV", modelCsv: "دریافت CSV این مدل", noBatches: "هنوز کدی تولید نشده است.",
    print: "چاپ", close: "بستن", loadingLabels: "در حال آماده‌سازی برچسب‌ها…", scan: "برای فعال‌سازی گارانتی اسکن کنید",
    search: "جستجوی گارانتی", searchHint: "سریال، کد، نام یا ایمیل مالک", find: "جستجو", all: "همه وضعیت‌ها",
    serial: "سریال", code: "کد", status: "وضعیت", owner: "مالک", until: "اعتبار تا", void: "ابطال", voidAsk: (s: string) => `گارانتی ${s} باطل شود؟ مشتری آن را باطل‌شده خواهد دید.`, none: "گارانتی‌ای یافت نشد.",
    st: { pending: "فعال‌نشده", active: "فعال", void: "باطل" } as Record<string, string>,
    messages: "پیام‌های تماس",
  },
};
type Copy = (typeof copy)["en"];
type Variant = Tables<"watch_variants">;
type Warranty = Tables<"warranties">;

const field = "min-h-11 rounded-lg border border-input bg-surface-deep px-4 text-sm outline-none focus:border-primary";
const small = "min-h-8 px-3 py-1 text-xs";
const th = "p-2 text-start font-medium";
const certificateUrl = (code: string) => `${window.location.origin}/warranty/${code}`;

function AdminPage() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return <PageShell><section className="mx-auto max-w-screen-xl px-5 py-16 lg:px-10">
    <h1 className="font-display text-4xl">{t.title}</h1>
    {!ready ? null : session ? <Panel userId={session.user.id} t={t} /> : <SignIn t={t} />}
  </section></PageShell>;
}

function SignIn({ t }: { t: Copy }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const email = String(f.get("email")); const password = String(f.get("password"));
    const { error } = mode === "in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setMsg(error ? error.message : mode === "up" ? t.confirm : "");
  }
  return <form onSubmit={submit} className="mt-8 grid max-w-sm gap-3">
    <input name="email" type="email" required dir="ltr" placeholder={t.email} className={field} />
    <input name="password" type="password" required minLength={8} dir="ltr" placeholder={t.password} className={field} />
    <Button type="submit">{mode === "in" ? t.signIn : t.signUp}</Button>
    <button type="button" className="text-start text-sm text-muted-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? t.toUp : t.toIn}</button>
    {msg && <p className="text-sm text-primary">{msg}</p>}
  </form>;
}

/** Reads every row of a filtered warranties query, past the 1000-row page limit. */
async function fetchWarranties(column: "batch_id" | "model", value: string) {
  const rows: Warranty[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("warranties").select("*").eq(column, value).order("serial").range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

function downloadCsv(name: string, rows: Warranty[], variants: Map<string, Variant>) {
  const head = ["serial", "code", "model", "case_band", "dial", "status", "url"];
  const lines = rows.map((w) => {
    const v = w.variant_barcode ? variants.get(w.variant_barcode) : undefined;
    return [w.serial, formatCode(w.code), w.model, v?.case_band ?? "", v?.dial ?? "", w.status, certificateUrl(w.code)].map((x) => `"${x.replace(/"/g, '""')}"`).join(",");
  });
  const blob = new Blob(["﻿" + [head.join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `${name}.csv`; a.click();
  URL.revokeObjectURL(a.href);
}

function Panel({ userId, t }: { userId: string; t: Copy }) {
  const { locale } = useLanguage();
  const qc = useQueryClient();
  const role = useQuery({ queryKey: ["is-admin", userId], queryFn: async () => (await supabase.rpc("has_role", { _user_id: userId, _role: "admin" })).data === true });
  const admin = role.data === true;
  const variantsQ = useQuery({ enabled: admin, queryKey: ["admin-variants"], queryFn: async () => (await supabase.from("watch_variants").select("*").order("barcode")).data ?? [] });
  const batches = useQuery({ enabled: admin, queryKey: ["admin-batches"], queryFn: async () => (await supabase.from("warranty_batches").select("*").order("created_at", { ascending: false }).limit(30)).data ?? [] });
  const stats = useQuery({ enabled: admin, queryKey: ["admin-stats"], queryFn: async () => {
    const count = async (status?: string) => {
      const q = supabase.from("warranties").select("id", { count: "exact", head: true });
      return (await (status ? q.eq("status", status) : q)).count ?? 0;
    };
    const [total, pending, active, voided] = await Promise.all([count(), count("pending"), count("active"), count("void")]);
    return { total, pending, active, void: voided };
  } });
  const msgs = useQuery({ enabled: admin, queryKey: ["admin-messages"], queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(50)).data ?? [] });

  const variants = useMemo(() => new Map((variantsQ.data ?? []).map((v) => [v.barcode, v])), [variantsQ.data]);
  const models = useMemo(() => [...new Set((variantsQ.data ?? []).map((v) => v.model_no))].sort(), [variantsQ.data]);
  const [model, setModel] = useState("");
  const current = model || models[0] || "";
  const rows = (variantsQ.data ?? []).filter((v) => v.model_no === current);
  const missing = rows.reduce((n, v) => n + Math.max(0, v.qty_ordered - v.serial_seq), 0);

  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [labels, setLabels] = useState<Warranty[] | "loading" | null>(null);
  const [search, setSearch] = useState({ term: "", status: "" });
  const found = useQuery({ enabled: admin, queryKey: ["admin-search", search], queryFn: async () => {
    let q = supabase.from("warranties").select("*").order("created_at", { ascending: false }).limit(50);
    if (search.status) q = q.eq("status", search.status);
    const term = search.term.replace(/[%,()*\\"]/g, "").trim();
    if (term) {
      const code = normalizeCode(term);
      q = q.or(`serial.ilike.%${term}%,owner_name.ilike.%${term}%,owner_email.ilike.%${term}%${code ? `,code.eq.${code}` : ""}`);
    }
    return (await q).data ?? [];
  } });

  const signOut = <Button variant="outline" className="mt-4" onClick={() => supabase.auth.signOut()}>{t.signOut}</Button>;
  if (role.isLoading) return null;
  if (!admin) return <div className="mt-6"><p className="text-muted-foreground">{t.noAccess}</p>{signOut}</div>;

  const refresh = () => Promise.all(["admin-variants", "admin-batches", "admin-stats", "admin-search"].map((k) => qc.invalidateQueries({ queryKey: [k] })));
  async function run(call: () => PromiseLike<{ error: { message: string } | null; count: number }>) {
    setBusy(true); setNote(null);
    const { error, count } = await call();
    setNote(error ? { ok: false, text: error.message } : { ok: true, text: t.made(count) });
    await refresh(); setBusy(false);
  }
  const makeAll = () => run(async () => { const r = await supabase.rpc("create_model_batches", { _model_no: current }); return { error: r.error, count: r.data ?? 0 }; });
  const makeOne = (barcode: string, qty: number) => run(async () => { const r = await supabase.rpc("create_warranty_batch", { _barcode: barcode, _qty: qty }); return { error: r.error, count: qty }; });
  async function showLabels(load: () => Promise<Warranty[]>) {
    setLabels("loading");
    try { setLabels(await load()); } catch { setLabels(null); }
  }
  async function voidIt(w: Warranty) {
    if (!window.confirm(t.voidAsk(w.serial))) return;
    await supabase.from("warranties").update({ status: "void" }).eq("id", w.id);
    await refresh();
  }
  const describe = (barcode: string | null) => { const v = barcode ? variants.get(barcode) : undefined; return v ? `${v.case_band} · ${v.dial}` : ""; };

  return <div className="mt-8 space-y-14">
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {(["total", "pending", "active", "void"] as const).map((k) => <div key={k} className="rounded-lg border border-border bg-surface-soft p-4"><dt className="text-xs text-muted-foreground">{t.stats[k]}</dt><dd className="mt-1 font-display text-3xl">{(stats.data?.[k] ?? 0).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}</dd></div>)}
    </dl>

    <section>
      <h2 className="font-display text-2xl">{t.generate}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{t.generateBody}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">{t.model}
          <select value={current} onChange={(e) => { setModel(e.target.value); setNote(null); }} className={field} dir="ltr">{models.map((m) => <option key={m}>{m}</option>)}</select>
        </label>
        <span className="text-sm text-muted-foreground">{rows.length} {t.variants}</span>
        {missing > 0 ? <Button disabled={busy} onClick={makeAll}>{t.makeAll(missing)}</Button> : <span className="text-sm text-primary">{rows.length > 0 && t.allDone}</span>}
        {rows.some((v) => v.serial_seq > 0) && <Button variant="outline" onClick={async () => downloadCsv(`warranty-${current}`, await fetchWarranties("model", current), variants)}>{t.modelCsv}</Button>}
      </div>
      {note && <p className={`mt-3 text-sm ${note.ok ? "text-primary" : "text-destructive"}`}>{note.text}</p>}
      <div className="mt-4 overflow-x-auto"><table className="w-full text-sm">
        <thead className="text-muted-foreground"><tr><th className={th}>{t.barcode}</th><th className={th}>{t.finish}</th><th className={th}>{t.dial}</th><th className={th}>{t.ordered}</th><th className={th}>{t.generated}</th><th className={th} /></tr></thead>
        <tbody>{rows.map((v) => <tr key={v.barcode} className="border-t border-border">
          <td className="p-2 font-mono" dir="ltr">{v.barcode}</td><td className="p-2" dir="ltr">{v.case_band}</td><td className="p-2" dir="ltr">{v.dial}</td><td className="p-2">{v.qty_ordered}</td><td className="p-2">{v.serial_seq}</td>
          <td className="p-2"><form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); const n = Number(new FormData(e.currentTarget).get("qty")); if (n >= 1) makeOne(v.barcode, n); }}>
            <input key={v.serial_seq} name="qty" type="number" min={1} max={5000} defaultValue={Math.max(1, v.qty_ordered - v.serial_seq)} aria-label={t.qty} className={`${field} min-h-8 w-24 px-2`} dir="ltr" />
            <Button type="submit" variant="outline" className={small} disabled={busy}>{t.make}</Button>
          </form></td>
        </tr>)}</tbody>
      </table></div>
    </section>

    <section>
      <h2 className="font-display text-2xl">{t.batches}</h2>
      {batches.data?.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{t.noBatches}</p>}
      <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><tbody>{batches.data?.map((b) => <tr key={b.id} className="border-t border-border">
        <td className="p-2">{formatDate(b.created_at, locale)}</td><td className="p-2 font-mono" dir="ltr">{variants.get(b.variant_barcode)?.model_no}</td><td className="p-2" dir="ltr">{describe(b.variant_barcode)}</td><td className="p-2">{b.qty}</td>
        <td className="flex gap-2 p-2"><Button variant="outline" className={small} onClick={() => showLabels(() => fetchWarranties("batch_id", b.id))}>{t.labels}</Button><Button variant="ghost" className={small} onClick={async () => downloadCsv(`warranty-${b.variant_barcode}-${b.id.slice(0, 8)}`, await fetchWarranties("batch_id", b.id), variants)}>{t.csv}</Button></td>
      </tr>)}</tbody></table></div>
    </section>

    {labels && <section className="rounded-lg border border-border bg-surface-soft p-6">
      <div className="flex gap-2 print:hidden">{labels !== "loading" && <Button onClick={() => window.print()}>{t.print} ({labels.length})</Button>}<Button variant="ghost" onClick={() => setLabels(null)}>{t.close}</Button></div>
      {labels === "loading" ? <p className="mt-4 text-sm text-muted-foreground">{t.loadingLabels}</p> : <div className="print-area mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {labels.map((w) => <div key={w.id} className="break-inside-avoid rounded-md border border-neutral-300 bg-white p-3 text-center text-neutral-900" dir="ltr">
          <QRCodeSVG value={certificateUrl(w.code)} size={120} className="mx-auto" />
          <p className="mt-2 font-mono text-sm font-semibold tracking-wider">{formatCode(w.code)}</p>
          <p className="mt-1 text-[10px]">{w.serial}</p>
          <p className="text-[10px]">{w.model} · {describe(w.variant_barcode)}</p>
          <p className="mt-1 text-[9px] text-neutral-600">{t.scan}</p>
        </div>)}
      </div>}
    </section>}

    <section>
      <h2 className="font-display text-2xl">{t.search}</h2>
      <form className="mt-4 flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); setSearch({ term: String(f.get("term")), status: String(f.get("status")) }); }}>
        <input name="term" placeholder={t.searchHint} className={`${field} min-w-64 flex-1`} />
        <select name="status" className={field}><option value="">{t.all}</option>{["pending", "active", "void"].map((s) => <option key={s} value={s}>{t.st[s]}</option>)}</select>
        <Button type="submit">{t.find}</Button>
      </form>
      {found.data?.length === 0 && <p className="mt-4 text-sm text-muted-foreground">{t.none}</p>}
      <div className="mt-4 overflow-x-auto"><table className="w-full text-sm">
        <thead className="text-muted-foreground"><tr><th className={th}>{t.serial}</th><th className={th}>{t.code}</th><th className={th}>{t.model}</th><th className={th}>{t.status}</th><th className={th}>{t.owner}</th><th className={th}>{t.until}</th><th className={th} /></tr></thead>
        <tbody>{found.data?.map((w) => <tr key={w.id} className="border-t border-border">
          <td className="p-2 font-mono" dir="ltr">{w.serial}</td><td className="p-2 font-mono" dir="ltr">{formatCode(w.code)}</td><td className="p-2" dir="ltr">{w.model} {describe(w.variant_barcode)}</td><td className="p-2">{t.st[w.status] ?? w.status}</td>
          <td className="p-2">{w.owner_name ? <span dir="auto">{w.owner_name}<br /><span className="text-xs text-muted-foreground" dir="ltr">{[w.owner_email, w.owner_phone].filter(Boolean).join(" · ")}</span></span> : "—"}</td>
          <td className="p-2">{formatDate(w.expires_at, locale)}</td>
          <td className="flex gap-2 p-2"><Button variant="outline" className={small} onClick={() => setLabels([w])}>QR</Button>{w.status !== "void" && <Button variant="ghost" className={small} onClick={() => voidIt(w)}>{t.void}</Button>}</td>
        </tr>)}</tbody>
      </table></div>
    </section>

    <section><h2 className="font-display text-2xl">{t.messages}</h2><ul className="mt-4 space-y-3">{msgs.data?.map((m) => <li key={m.id} className="rounded-lg border border-border p-4 text-sm"><p className="font-semibold">{m.name} · {m.contact} · {m.topic}</p><p className="mt-1 text-muted-foreground">{m.message}</p></li>)}</ul></section>
    {signOut}
  </div>;
}
