import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { watches, retailers } from "@/lib/catalog";

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

const field = "min-h-11 rounded-lg border border-input bg-surface-deep px-4 text-sm outline-none focus:border-primary";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return <PageShell><section className="mx-auto max-w-screen-xl px-5 py-16 lg:px-10">
    <h1 className="font-display text-4xl">Staff panel</h1>
    {!ready ? null : session ? <Panel userId={session.user.id} /> : <SignIn />}
  </section></PageShell>;
}

function SignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const email = String(f.get("email")); const password = String(f.get("password"));
    const { error } = mode === "in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setMsg(error ? error.message : mode === "up" ? "Check your email to confirm your account." : "");
  }
  return <form onSubmit={submit} className="mt-8 grid max-w-sm gap-3">
    <input name="email" type="email" required placeholder="Email" className={field} />
    <input name="password" type="password" required minLength={8} placeholder="Password" className={field} />
    <Button type="submit">{mode === "in" ? "Sign in" : "Create account"}</Button>
    <button type="button" className="text-start text-sm text-muted-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}</button>
    {msg && <p className="text-sm text-primary">{msg}</p>}
  </form>;
}

function Panel({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const role = useQuery({ queryKey: ["is-admin", userId], queryFn: async () => (await supabase.rpc("has_role", { _user_id: userId, _role: "admin" })).data === true });
  const list = useQuery({ enabled: role.data === true, queryKey: ["admin-warranties"], queryFn: async () => (await supabase.from("warranties").select("*").order("created_at", { ascending: false })).data ?? [] });
  const msgs = useQuery({ enabled: role.data === true, queryKey: ["admin-messages"], queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(50)).data ?? [] });
  const [qr, setQr] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const signOut = <Button variant="outline" className="mt-4" onClick={() => supabase.auth.signOut()}>Sign out</Button>;
  if (role.isLoading) return null;
  if (!role.data) return <div className="mt-6"><p className="text-muted-foreground">Your account does not have staff access yet. Ask the owner to grant the admin role.</p>{signOut}</div>;

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = new FormData(form);
    const serial = String(f.get("serial")).trim().toUpperCase();
    if (!/^DC-\d{4}-\d{4}$/.test(serial)) return setErr("Serial must look like DC-2026-0001");
    const { error } = await supabase.from("warranties").insert({ serial, model: String(f.get("model")), retailer: String(f.get("retailer")) || null, sale_date: String(f.get("sale_date")) || null });
    setErr(error ? error.message : ""); if (!error) { form.reset(); qc.invalidateQueries({ queryKey: ["admin-warranties"] }); }
  }
  async function voidIt(id: string) {
    await supabase.from("warranties").update({ status: "void" }).eq("id", id); qc.invalidateQueries({ queryKey: ["admin-warranties"] });
  }
  const url = (s: string) => `${window.location.origin}/warranty/${s}`;

  return <div className="mt-8 space-y-12">
    <form onSubmit={create} className="grid gap-3 rounded-lg border border-border bg-surface-soft p-6 sm:grid-cols-5">
      <input name="serial" required placeholder="DC-2026-0101" dir="ltr" className={field} />
      <select name="model" className={field}>{watches.map((w) => <option key={w.slug}>{w.name}</option>)}</select>
      <select name="retailer" className={field}><option value="">— Retailer —</option>{retailers.map((r) => <option key={r.name}>{r.name}</option>)}</select>
      <input name="sale_date" type="date" className={field} />
      <Button type="submit">Add watch</Button>
      {err && <p className="text-sm text-destructive sm:col-span-5">{err}</p>}
    </form>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-start text-muted-foreground"><tr><th className="p-2 text-start">Serial</th><th className="p-2 text-start">Model</th><th className="p-2 text-start">Status</th><th className="p-2 text-start">Owner</th><th className="p-2" /></tr></thead>
      <tbody>{list.data?.map((w) => <tr key={w.id} className="border-t border-border"><td className="p-2" dir="ltr">{w.serial}</td><td className="p-2">{w.model}</td><td className="p-2">{w.status}</td><td className="p-2">{w.owner_name ? `${w.owner_name} · ${w.owner_phone}` : "—"}</td>
        <td className="flex gap-2 p-2"><Button variant="outline" className="min-h-8 px-3 py-1 text-xs" onClick={() => setQr(w.serial)}>QR</Button>{w.status !== "void" && <Button variant="ghost" className="min-h-8 px-3 py-1 text-xs" onClick={() => voidIt(w.id)}>Void</Button>}</td></tr>)}</tbody></table></div>
    {qr && <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-surface-soft p-6 print:border-0">
      <div className="rounded-md bg-foreground p-4"><QRCodeSVG value={url(qr)} size={180} /></div>
      <p className="text-sm" dir="ltr">{qr} · {url(qr)}</p>
      <div className="flex gap-2"><Button onClick={() => window.print()}>Print</Button><Button variant="ghost" onClick={() => setQr(null)}>Close</Button></div>
    </div>}
    <div><h2 className="font-display text-2xl">Contact messages</h2><ul className="mt-4 space-y-3">{msgs.data?.map((m) => <li key={m.id} className="rounded-lg border border-border p-4 text-sm"><p className="font-semibold">{m.name} · {m.contact} · {m.topic}</p><p className="mt-1 text-muted-foreground">{m.message}</p></li>)}</ul></div>
    {signOut}
  </div>;
}
