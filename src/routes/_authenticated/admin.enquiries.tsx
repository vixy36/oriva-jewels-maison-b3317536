import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Archive, MessageSquare } from "lucide-react";

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
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
};

function EnquiriesPage() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("unread");
  const [open, setOpen] = useState<Enquiry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter === "unread") q = q.eq("is_read", false).eq("is_archived", false);
    else if (filter === "archived") q = q.eq("is_archived", true);
    else q = q.eq("is_archived", false);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as unknown as Enquiry[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

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

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="mt-2 font-serif text-3xl">Enquiries</h1>
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

      <div className="mt-6 grid lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="border border-border/60 bg-card overflow-hidden max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No enquiries here.</div>
          ) : (
            <ul>
              {rows.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => { setOpen(r); if (!r.is_read) toggleRead(r, true); }}
                    className={`w-full text-left p-4 border-b border-border/60 hover:bg-muted/40 transition ${open?.id === r.id ? "bg-muted/40" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!r.is_read && <span className="w-2 h-2 rounded-full bg-foreground" />}
                          <span className={`font-medium truncate ${!r.is_read ? "text-foreground" : "text-muted-foreground"}`}>{r.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate mt-1">{r.subject || r.message.slice(0, 80)}</div>
                        <div className="text-xs text-muted-foreground mt-1">{r.source} · {new Date(r.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-border/60 bg-card p-6">
          {!open ? (
            <div className="text-sm text-muted-foreground text-center py-20">Select an enquiry to view details.</div>
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
                    {open.product_slug && <span className="px-2 py-1 rounded bg-muted">Product: {open.product_slug}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => toggleRead(open, !open.is_read)} title={open.is_read ? "Mark unread" : "Mark read"}>
                    {open.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  {open.phone && (
                    <Button size="sm" variant="ghost" asChild title="WhatsApp">
                      <a href={`https://wa.me/${open.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => archive(open)} title="Archive"><Archive className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(open)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>

              {open.subject && <div className="mt-6 text-sm font-medium">{open.subject}</div>}
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{open.message}</div>

              {open.metadata && Object.keys(open.metadata).length > 0 && (
                <div className="mt-6 border-t border-border/60 pt-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Additional details</p>
                  <pre className="text-xs bg-muted/40 p-3 rounded overflow-x-auto">{JSON.stringify(open.metadata, null, 2)}</pre>
                </div>
              )}

              {open.email && (
                <div className="mt-6">
                  <Button asChild>
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
