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

        <div className="grid grid-cols-2 gap-12 mt-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-3">From</p>
            <div className="text-sm leading-relaxed space-y-1">
              <p className="font-bold text-base">Oriva Jewels</p>
              <p>Unit 1203, 12/F, Tower 1</p>
              <p>Lippo Centre, 89 Queensway</p>
              <p>Admiralty, Hong Kong</p>
              <p className="pt-2">T: +852 5317 6253</p>
              <p>E: hello@orivajewels.com</p>
            </div>
          </div>
          <div className="border-l border-black/10 pl-12">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-3">Ship To</p>
            <div className="text-sm leading-relaxed space-y-1">
              <p className="font-bold text-base uppercase">{o.customer_name}</p>
              {addr.line1 && <p>{addr.line1}</p>}
              {addr.line2 && <p>{addr.line2}</p>}
              <p>{[addr.city, addr.state, addr.postal].filter(Boolean).join(", ")}</p>
              <p className="font-bold">{addr.country}</p>
              {o.customer_phone && <p className="pt-2">T: {o.customer_phone}</p>}
              <p>E: {o.customer_email}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-12 border-t-2 border-black pt-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-3">Shipment Details</p>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] uppercase text-black/60">Carrier</p>
                <p className="font-mono text-base">{o.carrier || "Standard Shipping"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-black/60">Tracking ID</p>
                <p className="font-mono text-base">{o.tracking_number || "Pending Assignment"}</p>
              </div>
            </div>
          </div>
          <div className="pl-12">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-3">Order Items</p>
            <ul className="text-sm space-y-2">
              {o.items.map((it, i) => (
                <li key={i} className="flex justify-between border-b border-black/5 pb-1">
                  <span>{it.name}</span>
                  <span className="font-mono font-bold">×{it.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40 font-bold">Authentication</p>
            <div className="h-16 w-16 bg-slate-100 flex items-center justify-center border border-black/5">
              <span className="text-[8px] text-center text-black/30">QR CODE<br/>PLACEHOLDER</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] italic text-black/60">Thank you for choosing Oriva Jewels Maison.</p>
            <p className="text-[8px] uppercase tracking-widest mt-2 font-bold">Fully Insured · Hand Crafted · Ethical Brilliance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
