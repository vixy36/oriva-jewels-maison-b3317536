import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { sendManualEmail } from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Zap, AlertCircle, Send, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/automations")({
  component: EmailAdmin,
});

type Automation = {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  trigger_status: string;
  template_name: string;
  subject_override: string | null;
  is_active: boolean;
  last_run_at: string | null;
  run_count: number;
};

const ORDER_STATUSES = ["pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"];
const ENQUIRY_STATUSES = ["new", "confirmed", "in_production", "shipped", "delivered", "cancelled"];
const TEMPLATE_HINTS = [
  "order-confirmed", "order-shipped", "order-delivered", "order-cancelled",
  "enquiry-received", "enquiry-followup", "custom",
];

function EmailAdmin() {
  return (
    <div>
      <div>
        <p className="eyebrow">Marketing</p>
        <h1 className="mt-2 font-serif text-3xl">Email</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Send emails manually or set up automations that fire when an order or enquiry status changes.
        </p>
      </div>

      <div className="mt-6 border border-amber-500/30 bg-amber-500/5 rounded p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium">Emails require an email domain</p>
          <p className="text-muted-foreground mt-1">
            You can save automations and draft manual emails now. Actual delivery only starts after the email domain is set up in project settings.
          </p>
        </div>
      </div>

      <Tabs defaultValue="manual" className="mt-6">
        <TabsList>
          <TabsTrigger value="manual"><Mail className="h-4 w-4 mr-2" /> Manual Email</TabsTrigger>
          <TabsTrigger value="automation"><Zap className="h-4 w-4 mr-2" /> Automation</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="mt-6">
          <ManualEmailPanel />
        </TabsContent>
        <TabsContent value="automation" className="mt-6">
          <AutomationsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============ MANUAL EMAIL ============

function ManualEmailPanel() {
  const send = useServerFn(sendManualEmail);
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"custom" | "enquiries" | "orders">("custom");
  const [loadingAudience, setLoadingAudience] = useState(false);

  const mut = useMutation({
    mutationFn: (v: { recipients: string[]; subject: string; body: string }) => send({ data: v }),
    onSuccess: (res: any) => {
      toast.success(`Sent ${res.sent}/${res.total} email${res.total === 1 ? "" : "s"}`);
      if (res.failures?.length) {
        console.warn("Manual email failures", res.failures);
        toast.warning(`${res.failures.length} recipient(s) failed. Check console for details.`);
      }
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to send"),
  });

  async function loadAudience(kind: "enquiries" | "orders") {
    setAudience(kind);
    setLoadingAudience(true);
    const table = kind === "enquiries" ? "enquiries" : "orders";
    const col = kind === "enquiries" ? "email" : "customer_email";
    const { data, error } = await supabase.from(table).select(col).not(col, "is", null);
    setLoadingAudience(false);
    if (error) return toast.error(error.message);
    const emails = Array.from(
      new Set((data ?? []).map((r: any) => (r[col] ?? "").trim()).filter(Boolean)),
    );
    setRecipients(emails.join(", "));
    toast.success(`Loaded ${emails.length} recipient${emails.length === 1 ? "" : "s"}`);
  }

  const parsedRecipients = recipients
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const canSend = parsedRecipients.length > 0 && subject.trim() && body.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 border border-border/60 bg-card p-6 rounded">
        <div>
          <Label className="text-xs">Recipients (comma or newline separated)</Label>
          <Textarea
            rows={3}
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="customer@example.com, another@example.com"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            {parsedRecipients.length} recipient{parsedRecipients.length === 1 ? "" : "s"}
          </p>
        </div>

        <div>
          <Label className="text-xs">Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="A note from Oriva Jewels" />
        </div>

        <div>
          <Label className="text-xs">Message (HTML or plain text)</Label>
          <Textarea
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Dear valued client,&#10;&#10;We wanted to share…"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            HTML tags are supported. Use {"{{name}}"} placeholders if your template supports them.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            disabled={!canSend || mut.isPending}
            onClick={() => mut.mutate({ recipients: parsedRecipients, subject, body })}
          >
            <Send className="h-4 w-4 mr-2" />
            {mut.isPending ? "Sending…" : `Send to ${parsedRecipients.length || 0}`}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border border-border/60 bg-card p-4 rounded">
          <p className="eyebrow">Audience</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Load a pre-built recipient list from your data.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant={audience === "enquiries" ? "default" : "outline"}
              size="sm"
              disabled={loadingAudience}
              onClick={() => loadAudience("enquiries")}
            >
              All enquiry emails
            </Button>
            <Button
              variant={audience === "orders" ? "default" : "outline"}
              size="sm"
              disabled={loadingAudience}
              onClick={() => loadAudience("orders")}
            >
              All order customers
            </Button>
            <Button
              variant={audience === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAudience("custom");
                setRecipients("");
              }}
            >
              Custom list
            </Button>
          </div>
        </div>
        <div className="border border-border/60 bg-card p-4 rounded text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Tip</p>
          Test with a single recipient (your own email) before sending to a large audience.
        </div>
      </div>
    </div>
  );
}

// ============ AUTOMATIONS ============

function AutomationsPanel() {
  const [rows, setRows] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Automation | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marketing_automations")
      .select("*")
      .order("trigger_type")
      .order("trigger_status");
    if (error) toast.error(error.message);
    setRows((data as unknown as Automation[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggle(a: Automation) {
    await supabase.from("marketing_automations").update({ is_active: !a.is_active }).eq("id", a.id);
    load();
  }
  async function remove(a: Automation) {
    if (!confirm(`Delete automation "${a.name}"?`)) return;
    await supabase.from("marketing_automations").delete().eq("id", a.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">
          Trigger customer emails automatically when an order or enquiry reaches a specific status.
        </p>
        <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" /> New Automation</Button>
      </div>

      <div className="mt-4 border border-border/60 bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-3">Automation</th>
              <th className="text-left p-3">Trigger</th>
              <th className="text-left p-3">Template</th>
              <th className="text-left p-3">Runs</th>
              <th className="text-left p-3">Active</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No automations yet.</td></tr>
            ) : rows.map((a) => (
              <tr key={a.id} className="border-t border-border/60">
                <td className="p-3">
                  <div className="font-medium">{a.name}</div>
                  {a.description && <div className="text-xs text-muted-foreground">{a.description}</div>}
                </td>
                <td className="p-3">
                  <div className="text-xs uppercase tracking-widest">{a.trigger_type.replace("_", " ")}</div>
                  <div className="text-xs text-muted-foreground">→ {a.trigger_status.replace("_", " ")}</div>
                </td>
                <td className="p-3 font-mono text-xs">{a.template_name}</td>
                <td className="p-3 text-xs">
                  <div className="flex items-center gap-1"><Zap className="h-3 w-3" /> {a.run_count}</div>
                  {a.last_run_at && <div className="text-muted-foreground mt-0.5">{new Date(a.last_run_at).toLocaleDateString()}</div>}
                </td>
                <td className="p-3"><Switch checked={a.is_active} onCheckedChange={() => toggle(a)} /></td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(a)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(a)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <AutomationEditor row={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {creating && <AutomationEditor row={null} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function AutomationEditor({ row, onClose, onSaved }: { row: Automation | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !row;
  const [form, setForm] = useState<Partial<Automation>>(row ?? {
    name: "", description: "", trigger_type: "order_status", trigger_status: "confirmed",
    template_name: "order-confirmed", subject_override: "", is_active: true,
  });
  const [saving, setSaving] = useState(false);

  function upd<K extends keyof Automation>(k: K, v: Automation[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const statusOptions = form.trigger_type === "enquiry_status" ? ENQUIRY_STATUSES : ORDER_STATUSES;

  async function save() {
    if (!form.name || !form.template_name) return toast.error("Name and template are required.");
    setSaving(true);
    const payload = {
      name: form.name!,
      description: form.description || null,
      trigger_type: form.trigger_type!,
      trigger_status: form.trigger_status!,
      template_name: form.template_name!,
      subject_override: form.subject_override || null,
      is_active: form.is_active ?? true,
    };
    const { error } = isNew
      ? await supabase.from("marketing_automations").insert(payload)
      : await supabase.from("marketing_automations").update(payload).eq("id", row!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Automation created" : "Automation updated");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "New Automation" : `Edit "${row!.name}"`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs">Name</Label>
            <Input value={form.name ?? ""} onChange={(e) => upd("name", e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Description (internal)</Label>
            <Textarea rows={2} value={form.description ?? ""} onChange={(e) => upd("description", e.target.value)} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-xs">Trigger Type</Label>
              <Select value={form.trigger_type} onValueChange={(v) => upd("trigger_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_status">Order status change</SelectItem>
                  <SelectItem value="enquiry_status">Enquiry status change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">When status becomes</Label>
              <Select value={form.trigger_status} onValueChange={(v) => upd("trigger_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Email Template Name</Label>
            <Input value={form.template_name ?? ""} onChange={(e) => upd("template_name", e.target.value)} placeholder="order-confirmed" list="template-hints" />
            <datalist id="template-hints">
              {TEMPLATE_HINTS.map((t) => <option key={t} value={t} />)}
            </datalist>
            <p className="mt-1 text-[11px] text-muted-foreground">Must match a template registered in the email templates registry.</p>
          </div>
          <div>
            <Label className="text-xs">Subject Override (optional)</Label>
            <Input value={form.subject_override ?? ""} onChange={(e) => upd("subject_override", e.target.value)} placeholder="Your Oriva order has shipped" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.is_active ?? true} onCheckedChange={(v) => upd("is_active", v)} /> Active
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : isNew ? "Create" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
