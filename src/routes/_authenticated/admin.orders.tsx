import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runStatusAutomations } from "@/lib/automations.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Printer, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

type OrderItem = {
  product_slug?: string | null;
  name: string;
  qty: number;
  unit_price: number;
  currency?: string;
  configuration?: Record<string, unknown>;
};

type Order = {
  id: string;
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  payment_status: string;
  shipping_address: Record<string, string> | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS = ["pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"];
const PAYMENT = ["unpaid", "partial", "paid", "refunded"];

function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as unknown as Order[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function remove(o: Order) {
    if (!confirm(`Delete order ${o.order_code}?`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", o.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Fulfilment</p>
          <h1 className="mt-2 font-serif text-3xl">Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" /> New Order</Button>
        </div>
      </div>

      <div className="mt-6 border border-border/60 bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Tracking</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No orders yet. Create one manually or convert an enquiry.</td></tr>
            ) : rows.map((o) => (
              <tr key={o.id} className="border-t border-border/60">
                <td className="p-3">
                  <div className="font-mono text-xs">{o.order_code}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</div>
                </td>
                <td className="p-3">
                  <div>{o.customer_name}</div>
                  <div className="text-[11px] text-muted-foreground">{o.customer_email}</div>
                </td>
                <td className="p-3">{o.currency} {Number(o.total).toFixed(2)}</td>
                <td className="p-3"><StatusPill s={o.status} /></td>
                <td className="p-3 capitalize text-xs">{o.payment_status}</td>
                <td className="p-3 text-xs">
                  {o.tracking_number ? <div>{o.carrier} · {o.tracking_number}</div> : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => window.open(`/admin/orders/${o.id}/label`, "_blank")} title="Shipping label">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(o)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(o)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <OrderEditor order={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {creating && <OrderEditor order={null} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    pending: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    confirmed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    in_production: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    shipped: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    delivered: "bg-green-600/10 text-green-700 dark:text-green-400",
    cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
  };
  return <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${map[s] ?? "bg-muted"}`}>{s.replace("_", " ")}</span>;
}

function OrderEditor({ order, onClose, onSaved }: { order: Order | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !order;
  const [form, setForm] = useState<Partial<Order>>(order ?? {
    customer_name: "", customer_email: "", customer_phone: "",
    items: [], subtotal: 0, shipping_cost: 0, discount: 0, total: 0,
    currency: "USD", status: "pending", payment_status: "unpaid",
    shipping_address: { line1: "", line2: "", city: "", state: "", postal: "", country: "" },
    tracking_number: "", carrier: "", estimated_delivery: null, admin_notes: "",
  });
  const [saving, setSaving] = useState(false);

  function upd<K extends keyof Order>(k: K, v: Order[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function updAddr(k: string, v: string) {
    setForm((f) => ({ ...f, shipping_address: { ...(f.shipping_address ?? {}), [k]: v } }));
  }
  function updItem(i: number, patch: Partial<OrderItem>) {
    setForm((f) => {
      const items = [...(f.items ?? [])];
      items[i] = { ...items[i], ...patch };
      return { ...f, items };
    });
  }
  function addItem() {
    setForm((f) => ({ ...f, items: [...(f.items ?? []), { name: "", qty: 1, unit_price: 0 }] }));
  }
  function removeItem(i: number) {
    setForm((f) => ({ ...f, items: (f.items ?? []).filter((_, idx) => idx !== i) }));
  }

  const subtotal = (form.items ?? []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.unit_price) || 0), 0);
  const total = subtotal + (Number(form.shipping_cost) || 0) - (Number(form.discount) || 0);

  async function save() {
    if (!form.customer_name || !form.customer_email) return toast.error("Customer name and email are required.");
    if (!form.items || form.items.length === 0) return toast.error("Add at least one item.");
    setSaving(true);
    let code = form.order_code;
    if (isNew && !code) {
      const { data, error } = await supabase.rpc("gen_order_code");
      if (error) { setSaving(false); return toast.error(error.message); }
      code = data as string;
    }
    const payload = {
      order_code: code!,
      customer_name: form.customer_name!,
      customer_email: form.customer_email!,
      customer_phone: form.customer_phone || null,
      items: (form.items ?? []) as never,
      subtotal,
      shipping_cost: Number(form.shipping_cost) || 0,
      discount: Number(form.discount) || 0,
      total,
      currency: form.currency || "USD",
      status: form.status || "pending",
      payment_status: form.payment_status || "unpaid",
      shipping_address: (form.shipping_address ?? null) as never,
      tracking_number: form.tracking_number || null,
      carrier: form.carrier || null,
      estimated_delivery: form.estimated_delivery || null,
      admin_notes: form.admin_notes || null,
    };
    const { error } = isNew
      ? await supabase.from("orders").insert(payload)
      : await supabase.from("orders").update(payload).eq("id", order!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? `Order ${code} created` : "Order updated");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New Order" : `Edit ${order!.order_code}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <Label className="text-xs">Customer Name</Label>
              <Input value={form.customer_name ?? ""} onChange={(e) => upd("customer_name", e.target.value)} />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.customer_email ?? ""} onChange={(e) => upd("customer_email", e.target.value)} />
            </div>
            <div className="md:col-span-1">
              <Label className="text-xs">Phone</Label>
              <Input value={form.customer_phone ?? ""} onChange={(e) => upd("customer_phone", e.target.value)} />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-widest">Items</Label>
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add item</Button>
            </div>
            <div className="mt-2 space-y-2">
              {(form.items ?? []).map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start border border-border/60 p-3 rounded">
                  <Input className="col-span-5" placeholder="Product name" value={it.name}
                    onChange={(e) => updItem(i, { name: e.target.value })} />
                  <Input className="col-span-3" placeholder="Slug (optional)" value={it.product_slug ?? ""}
                    onChange={(e) => updItem(i, { product_slug: e.target.value })} />
                  <Input className="col-span-1" type="number" min={1} value={it.qty}
                    onChange={(e) => updItem(i, { qty: parseInt(e.target.value) || 1 })} />
                  <Input className="col-span-2" type="number" step={0.01} placeholder="Price" value={it.unit_price}
                    onChange={(e) => updItem(i, { unit_price: parseFloat(e.target.value) || 0 })} />
                  <Button className="col-span-1" size="sm" variant="ghost" onClick={() => removeItem(i)}><X className="h-4 w-4" /></Button>
                </div>
              ))}
              {(form.items ?? []).length === 0 && (
                <p className="text-xs text-muted-foreground">No items. Click "Add item" to build the order.</p>
              )}
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-4">
            <div>
              <Label className="text-xs">Currency</Label>
              <Select value={form.currency ?? "USD"} onValueChange={(v) => upd("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["USD", "HKD", "EUR", "GBP", "AED", "INR", "SGD"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Shipping cost</Label>
              <Input type="number" step={0.01} value={form.shipping_cost ?? 0}
                onChange={(e) => upd("shipping_cost", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label className="text-xs">Discount</Label>
              <Input type="number" step={0.01} value={form.discount ?? 0}
                onChange={(e) => upd("discount", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label className="text-xs">Total (auto)</Label>
              <Input readOnly value={total.toFixed(2)} />
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status ?? "pending"} onValueChange={(v) => upd("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Payment</Label>
              <Select value={form.payment_status ?? "unpaid"} onValueChange={(v) => upd("payment_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PAYMENT.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </section>

          <section>
            <Label className="text-xs uppercase tracking-widest">Shipping Address</Label>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <Input placeholder="Address line 1" value={form.shipping_address?.line1 ?? ""} onChange={(e) => updAddr("line1", e.target.value)} />
              <Input placeholder="Address line 2" value={form.shipping_address?.line2 ?? ""} onChange={(e) => updAddr("line2", e.target.value)} />
              <Input placeholder="City" value={form.shipping_address?.city ?? ""} onChange={(e) => updAddr("city", e.target.value)} />
              <Input placeholder="State / Region" value={form.shipping_address?.state ?? ""} onChange={(e) => updAddr("state", e.target.value)} />
              <Input placeholder="Postal / ZIP" value={form.shipping_address?.postal ?? ""} onChange={(e) => updAddr("postal", e.target.value)} />
              <Input placeholder="Country" value={form.shipping_address?.country ?? ""} onChange={(e) => updAddr("country", e.target.value)} />
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <div>
              <Label className="text-xs">Carrier</Label>
              <Input value={form.carrier ?? ""} onChange={(e) => upd("carrier", e.target.value)} placeholder="DHL, FedEx…" />
            </div>
            <div>
              <Label className="text-xs">Tracking number</Label>
              <Input value={form.tracking_number ?? ""} onChange={(e) => upd("tracking_number", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Estimated delivery</Label>
              <Input type="date" value={form.estimated_delivery ?? ""} onChange={(e) => upd("estimated_delivery", e.target.value)} />
            </div>
          </section>

          <div>
            <Label className="text-xs">Internal notes</Label>
            <Textarea rows={3} value={form.admin_notes ?? ""} onChange={(e) => upd("admin_notes", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : isNew ? "Create Order" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
