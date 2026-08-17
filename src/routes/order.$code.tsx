import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Truck, CheckCircle2, Clock, XCircle, Hammer } from "lucide-react";

export const Route = createFileRoute("/order/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.code} - Oriva Jewels` },
      { name: "description", content: "Track the status of your Oriva Jewels order." },
      { property: "og:title", content: `Order ${params.code} - Oriva Jewels` },
      { property: "og:description", content: "Track the status of your Oriva Jewels order." },
    ],
  }),
  component: OrderStatusPage,
});

type StatusRow = {
  order_code: string;
  customer_name: string;
  currency: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  status: string;
  payment_status: string;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  shipping_address: Record<string, string> | null;
  items: Array<{ name: string; qty: number; unit_price: number; product_slug?: string | null }>;
  created_at: string;
  updated_at: string;
};

const STEPS = [
  { key: "pending", label: "Received", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "in_production", label: "In Production", icon: Hammer },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

function OrderStatusPage() {
  const { code } = Route.useParams();
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<StatusRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase.rpc("get_order_status" as any, { _email: email.trim(), _order_code: code });
    setLoading(false);
    if (error) return setErr(error.message);
    if (!data || (data as unknown as StatusRow[]).length === 0) {
      return setErr("No order found for that code and email. Please double-check both.");
    }
    setOrder((data as unknown as StatusRow[])[0]);
  }

  const cancelled = order?.status === "cancelled";
  const currentStep = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="bg-ink pt-24 md:pt-32 min-h-screen">
      <div className="mx-auto max-w-3xl px-6 md:px-8 pb-24">
        <p className="eyebrow">Order Tracking</p>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl text-ivory">Order {code}</h1>
        <p className="mt-3 text-ivory/70 text-sm">Enter the email used to place the order to view its status.</p>

        {!order && (
          <form onSubmit={lookup} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto] items-end border border-white/10 bg-charcoal/40 p-6">
            <div>
              <Label className="text-xs tracking-widest uppercase text-ivory/70">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 bg-transparent border-white/20 text-ivory"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-gold text-obsidian hover:bg-ivory">
              {loading ? "Checking…" : "View Order"}
            </Button>
            {err && <p className="sm:col-span-2 text-sm text-red-400">{err}</p>}
          </form>
        )}

        {order && (
          <div className="mt-10 space-y-8">
            <section className="border border-white/10 bg-charcoal/40 p-6 md:p-8">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-ivory/60">Hello, {order.customer_name}</p>
                  <p className="mt-2 font-serif text-2xl text-ivory">
                    {cancelled ? "This order was cancelled." : STEPS[currentStep]?.label ?? "In progress"}
                  </p>
                </div>
                <div className="text-right text-xs text-ivory/60">
                  <div>Placed {new Date(order.created_at).toLocaleDateString()}</div>
                  <div>Updated {new Date(order.updated_at).toLocaleDateString()}</div>
                </div>
              </div>

              {cancelled ? (
                <div className="mt-6 flex items-center gap-2 text-red-400"><XCircle className="h-4 w-4" /> Cancelled</div>
              ) : (
                <ol className="mt-8 grid grid-cols-5 gap-2">
                  {STEPS.map((s, i) => {
                    const done = i <= currentStep;
                    const Icon = s.icon;
                    return (
                      <li key={s.key} className="text-center">
                        <div className={`mx-auto grid h-10 w-10 place-items-center rounded-full border ${done ? "bg-gold text-obsidian border-gold" : "border-white/20 text-ivory/50"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className={`mt-2 text-[10px] uppercase tracking-widest ${done ? "text-gold" : "text-ivory/40"}`}>{s.label}</div>
                      </li>
                    );
                  })}
                </ol>
              )}

              {(order.tracking_number || order.estimated_delivery) && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 text-sm">
                  {order.tracking_number && (
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-ivory/50">Shipment</p>
                      <p className="mt-1 text-ivory">{order.carrier ?? "Carrier"} · {order.tracking_number}</p>
                    </div>
                  )}
                  {order.estimated_delivery && (
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-ivory/50">Estimated Delivery</p>
                      <p className="mt-1 text-ivory">{new Date(order.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section className="border border-white/10 bg-charcoal/40 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-ivory/60">Items</p>
              <ul className="mt-4 divide-y divide-white/10">
                {order.items.map((it, i) => (
                  <li key={i} className="py-3 flex items-center justify-between text-sm">
                    <span className="text-ivory">{it.name} <span className="text-ivory/50">× {it.qty}</span></span>
                    <span className="text-ivory/80">{order.currency} {(it.qty * it.unit_price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 grid grid-cols-2 gap-y-1 text-sm text-ivory/80">
                <dt>Subtotal</dt><dd className="text-right">{order.currency} {Number(order.subtotal).toFixed(2)}</dd>
                <dt>Shipping</dt><dd className="text-right">{order.currency} {Number(order.shipping_cost).toFixed(2)}</dd>
                {Number(order.discount) > 0 && (<><dt>Discount</dt><dd className="text-right">- {order.currency} {Number(order.discount).toFixed(2)}</dd></>)}
                <dt className="mt-2 pt-2 border-t border-white/10 text-ivory">Total</dt>
                <dd className="mt-2 pt-2 border-t border-white/10 text-right text-ivory font-medium">{order.currency} {Number(order.total).toFixed(2)}</dd>
                <dt>Payment</dt><dd className="text-right capitalize">{order.payment_status}</dd>
              </dl>
            </section>

            {order.shipping_address && (
              <section className="border border-white/10 bg-charcoal/40 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-ivory/60">Shipping To</p>
                <address className="mt-3 not-italic text-sm text-ivory/85 leading-relaxed">
                  {[order.shipping_address.line1, order.shipping_address.line2, order.shipping_address.city, order.shipping_address.state, order.shipping_address.postal, order.shipping_address.country]
                    .filter(Boolean).map((l, i) => <div key={i}>{l}</div>)}
                </address>
              </section>
            )}

            <p className="text-xs text-ivory/50 text-center">
              Questions about your order? Reply to your confirmation email or reach us on WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
