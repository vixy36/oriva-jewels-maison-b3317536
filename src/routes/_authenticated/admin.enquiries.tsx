import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Archive, MessageSquare, PackagePlus, CheckSquare, Square } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { runStatusAutomations } from "@/lib/automations.functions";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: EnquiriesPage,
});

type Enquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  product_slug: string | null;
  metadata: Record<string, unknown>;
  configuration: Record<string, unknown> | null;
  is_read: boolean;
  is_archived: boolean;
  status: string;
  tracking_number: string | null;
  carrier: string | null;
  total_amount: number | null;
  currency: string | null;
  admin_notes: string | null;
  created_at: string;
};

const STATUS_OPTS = ["new", "confirmed", "in_production", "shipped", "delivered", "cancelled"] as const;

function EnquiriesPage() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("unread");
  const [open, setOpen] = useState<Enquiry | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const triggerAutomations = useServerFn(runStatusAutomations);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(300);
    if (filter === "unread") q = q.eq("is_read", false).eq("is_archived", false);
    else if (filter === "archived") q = q.eq("is_archived", true);
    else q = q.eq("is_archived", false);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as unknown as Enquiry[]) ?? []);
    setSelected(new Set());
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    setSelected((prev) => (prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))));
  }

  async function bulkUpdate(patch: Partial<Enquiry>, successMsg: string) {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const { error } = await supabase.from("enquiries").update(patch as never).in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`${successMsg} (${ids.length})`);
    if (open && ids.includes(open.id)) setOpen(null);
    load();
  }
  async function bulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} enquir${ids.length === 1 ? "y" : "ies"}? This cannot be undone.`)) return;
    const { error } = await supabase.from("enquiries").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${ids.length}`);
    if (open && ids.includes(open.id)) setOpen(null);
    load();
  }

  async function toggleRead(r: Enquiry, val: boolean) {
    await supabase.from("enquiries").update({ is_read: val }).eq("id", r.id);
    load();
  }
  async function archive(r: Enquiry) {
    await supabase.from("enquiries").update({ is_archived: true, is_read: true }).eq("id", r.id);
    load();
  }
  async function remove(r: Enquiry) {
    if (!confirm("Delete this enquiry?")) return;
    await supabase.from("enquiries").delete().eq("id", r.id);
    if (open?.id === r.id) setOpen(null);
    load();
  }
  async function updateField(r: Enquiry, patch: Partial<Enquiry>) {
    const { error } = await supabase.from("enquiries").update(patch as never).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    setOpen({ ...r, ...patch } as Enquiry);
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, ...patch } as Enquiry : x)));
    if (patch.status && patch.status !== r.status && r.email) {
      try {
        const res = await triggerAutomations({
          data: {
            triggerType: "enquiry_status",
            status: patch.status,
            recipient: { email: r.email, name: r.name },
            data: {
              subject: r.subject,
              productSlug: r.product_slug,
              configuration: r.configuration ?? {},
              trackingNumber: patch.tracking_number ?? r.tracking_number,
              carrier: patch.carrier ?? r.carrier,
            },
          },
        });
        if (res.triggered > 0) toast.success(`${res.triggered} automation${res.triggered > 1 ? "s" : ""} triggered · ${res.sent} email${res.sent === 1 ? "" : "s"} sent`);
      } catch (e) {
        console.warn("Automation trigger failed", e);
      }
    }
  }

  async function convertToOrder(r: Enquiry) {
    if (!r.email) return toast.error("Enquiry has no email — add one first.");
    const { data: code, error: codeErr } = await supabase.rpc("gen_order_code");
    if (codeErr) return toast.error(codeErr.message);
    const items = [{
      product_slug: r.product_slug,
      name: r.subject || r.metadata?.productName || "Custom piece",
      configuration: r.configuration ?? r.metadata ?? {},
      qty: 1,
      unit_price: r.total_amount ?? 0,
      currency: r.currency ?? "USD",
    }];
    const { error } = await supabase.from("orders").insert({
      order_code: code as string,
      customer_name: r.name,
      customer_email: r.email,
      customer_phone: r.phone,
      items: items as never,
      subtotal: r.total_amount ?? 0,
      total: r.total_amount ?? 0,
      currency: r.currency ?? "USD",
      status: r.status === "new" ? "pending" : r.status,
      tracking_number: r.tracking_number,
      carrier: r.carrier,
      enquiry_id: r.id,
    });
    if (error) return toast.error(error.message);
    toast.success(`Order ${code} created`);
    await archive(r);
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="mt-2 font-serif text-3xl">Enquiries & Product Requests</h1>
        </div>
        <div className="flex gap-1 border border-border/60 rounded p-1">
          {(["unread", "all", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded ${filter === f ? "bg-foreground text-background" : "hover:bg-muted"}`}
            >{f}</button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-2 flex-wrap border border-border/60 bg-muted/40 rounded p-3">
          <span className="text-xs uppercase tracking-widest mr-2">{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => bulkUpdate({ is_read: true }, "Marked read")}>
            <MailOpen className="h-4 w-4 mr-1.5" /> Mark Read
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkUpdate({ is_read: false }, "Marked unread")}>
            <Mail className="h-4 w-4 mr-1.5" /> Mark Unread
          </Button>
          {filter !== "archived" ? (
            <Button size="sm" variant="outline" onClick={() => bulkUpdate({ is_archived: true, is_read: true }, "Archived")}>
              <Archive className="h-4 w-4 mr-1.5" /> Archive
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => bulkUpdate({ is_archived: false }, "Restored")}>
              <Archive className="h-4 w-4 mr-1.5" /> Restore
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={bulkDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
            <Trash2 className="h-4 w-4 mr-1.5" /> Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="ml-auto">Clear</Button>
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-[1fr_1.4fr] gap-4">
        <div className="border border-border/60 bg-card overflow-hidden max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No enquiries here.</div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 border-b border-border/60 bg-muted/20 sticky top-0 z-10">
                <button onClick={toggleSelectAll} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-foreground text-muted-foreground">
                  {selected.size === rows.length && rows.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  {selected.size === rows.length && rows.length > 0 ? "Deselect all" : "Select all"}
                </button>
              </div>
              <ul>
                {rows.map((r) => (
                  <li key={r.id} className={`flex items-start gap-2 border-b border-border/60 hover:bg-muted/40 transition ${open?.id === r.id ? "bg-muted/40" : ""} ${selected.has(r.id) ? "bg-muted/30" : ""}`}>
                    <div className="pl-3 pt-4">
                      <Checkbox
                        checked={selected.has(r.id)}
                        onCheckedChange={() => toggleSelect(r.id)}
                        aria-label="Select enquiry"
                      />
                    </div>
                    <button
                      onClick={() => { setOpen(r); if (!r.is_read) toggleRead(r, true); }}
                      className="flex-1 text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {!r.is_read && <span className="w-2 h-2 rounded-full bg-foreground" />}
                            <span className={`font-medium truncate ${!r.is_read ? "text-foreground" : "text-muted-foreground"}`}>{r.name}</span>
                            <StatusPill status={r.status} />
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-1">{r.subject || r.message.slice(0, 80)}</div>
                          <div className="text-xs text-muted-foreground mt-1">{r.source} · {new Date(r.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>


        <div className="border border-border/60 bg-card p-6 overflow-y-auto max-h-[75vh]">
          {!open ? (
            <div className="text-sm text-muted-foreground text-center py-20">Select an enquiry to view and manage.</div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-serif text-2xl">{open.name}</h2>
                  <div className="text-sm text-muted-foreground mt-1">
                    {open.email && <span>{open.email} · </span>}
                    {open.phone && <span>{open.phone} · </span>}
                    <span>{new Date(open.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap text-xs">
                    <span className="px-2 py-1 rounded bg-muted uppercase tracking-widest">{open.source}</span>
                    {open.product_slug && (
                      <Link to="/product/$slug" params={{ slug: open.product_slug }} className="px-2 py-1 rounded bg-muted underline">
                        {open.product_slug}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => toggleRead(open, !open.is_read)}>
                    {open.is_read ? <Mail className="h-4 w-4 mr-1.5" /> : <MailOpen className="h-4 w-4 mr-1.5" />}
                    {open.is_read ? "Mark Unread" : "Mark Read"}
                  </Button>
                  {open.phone && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`https://wa.me/${open.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                        <MessageSquare className="h-4 w-4 mr-1.5" /> WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="default" onClick={() => convertToOrder(open)}>
                    <PackagePlus className="h-4 w-4 mr-1.5" /> Convert to Order
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => archive(open)}>
                    <Archive className="h-4 w-4 mr-1.5" /> Archive
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(open)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                    <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                  </Button>
                </div>
              </div>

              {open.subject && <div className="mt-6 text-sm font-medium">{open.subject}</div>}
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{open.message}</div>

              {open.configuration && Object.keys(open.configuration).length > 0 && (
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Product Configuration</p>
                  <pre className="text-xs bg-muted/40 p-3 rounded overflow-x-auto">{JSON.stringify(open.configuration, null, 2)}</pre>
                </div>
              )}

              <div className="mt-6 border-t border-border/60 pt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={open.status} onValueChange={(v) => updateField(open, { status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Amount ({open.currency ?? "USD"})</Label>
                  <Input
                    type="number"
                    defaultValue={open.total_amount ?? ""}
                    onBlur={(e) => updateField(open, { total_amount: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Carrier</Label>
                  <Input defaultValue={open.carrier ?? ""} onBlur={(e) => updateField(open, { carrier: e.target.value || null })} />
                </div>
                <div>
                  <Label className="text-xs">Tracking Number</Label>
                  <Input defaultValue={open.tracking_number ?? ""} onBlur={(e) => updateField(open, { tracking_number: e.target.value || null })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs">Internal Notes</Label>
                  <Textarea rows={3} defaultValue={open.admin_notes ?? ""} onBlur={(e) => updateField(open, { admin_notes: e.target.value || null })} />
                </div>
              </div>

              {open.email && (
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <a href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || "Your enquiry")}`}>Reply by Email</a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    confirmed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    in_production: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    shipped: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    delivered: "bg-green-600/10 text-green-700 dark:text-green-400",
    cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${map[status] ?? "bg-muted"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
