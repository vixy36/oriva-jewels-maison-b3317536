import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/orders/$id/label")({
  component: LabelPage,
});

type LabelOrder = {
  order_code: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string;
  shipping_address: Record<string, string> | null;
  carrier: string | null;
  tracking_number: string | null;
  items: Array<{ name: string; qty: number }>;
};

function LabelPage() {
  const { id } = Route.useParams();
  const [o, setO] = useState<LabelOrder | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("orders")
        .select("order_code,customer_name,customer_phone,customer_email,shipping_address,carrier,tracking_number,items")
        .eq("id", id).single();
      if (data) setO(data as unknown as LabelOrder);
    })();
  }, [id]);

  if (!o) return <div className="p-8 text-sm text-muted-foreground">Loading label…</div>;
  const addr = o.shipping_address ?? {};

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 min-h-screen bg-white text-black">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-black transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </button>
        <div className="flex gap-3">
          <Button 
            onClick={() => window.print()}
            className="bg-black text-white hover:bg-slate-800 rounded-none px-8"
          >
            <Printer className="h-4 w-4 mr-2" /> Print Label
          </Button>
        </div>
      </div>

      <div className="border-2 border-black bg-white text-black p-8 print:p-6 print:border" style={{ minHeight: "6in" }}>
        <div className="flex justify-between items-start border-b-2 border-black pb-4">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase">Oriva Jewels</p>
            <p className="text-[10px] mt-1">Hong Kong</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest">Order</p>
            <p className="font-mono text-lg">{o.order_code}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/60">From</p>
            <p className="mt-2 text-sm leading-relaxed">
              Oriva Jewels<br />
              Hong Kong<br />
              +852 5317 6253
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/60">Ship To</p>
            <p className="mt-2 text-sm leading-relaxed">
              <span className="font-semibold">{o.customer_name}</span><br />
              {addr.line1}{addr.line1 && <br />}
              {addr.line2}{addr.line2 && <br />}
              {[addr.city, addr.state, addr.postal].filter(Boolean).join(", ")}<br />
              {addr.country}<br />
              {o.customer_phone}
            </p>
          </div>
        </div>

        {(o.carrier || o.tracking_number) && (
          <div className="mt-6 border-t-2 border-black pt-4">
            <p className="text-[10px] uppercase tracking-widest">Carrier / Tracking</p>
            <p className="mt-1 font-mono text-lg">{o.carrier} · {o.tracking_number}</p>
          </div>
        )}

        <div className="mt-6 border-t-2 border-black pt-4">
          <p className="text-[10px] uppercase tracking-widest">Contents</p>
          <ul className="mt-2 text-sm">
            {o.items.map((it, i) => (
              <li key={i}>{it.qty} × {it.name}</li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-[10px] text-black/60">Handle with care · Fully insured · Fine jewellery</p>
      </div>
    </div>
  );
}
