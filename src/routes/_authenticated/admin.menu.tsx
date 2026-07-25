import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SortableList } from "@/components/admin/SortableList";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: AdminMenuPage,
});

type MenuItem = {
  id: string;
  menu_key: "main" | "sub";
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
};

function AdminMenuPage() {
  const [tab, setTab] = useState<"main" | "sub">("main");
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <p className="eyebrow">Navigation</p>
        <h1 className="font-serif text-3xl">Menu Manager</h1>
        <p className="text-sm text-muted-foreground mt-1">Drag to reorder. Toggle visibility. Edit label + link.</p>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="main">Main Menu</TabsTrigger>
          <TabsTrigger value="sub">Top Sub-header</TabsTrigger>
        </TabsList>
        <TabsContent value="main" className="mt-6"><MenuEditor menuKey="main" /></TabsContent>
        <TabsContent value="sub" className="mt-6"><MenuEditor menuKey="sub" /></TabsContent>
      </Tabs>
    </div>
  );
}

function MenuEditor({ menuKey }: { menuKey: "main" | "sub" }) {
  const qc = useQueryClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-menu", menuKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("menu_key", menuKey)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MenuItem[];
    },
  });

  useEffect(() => { if (data) setItems(data); }, [data]);

  const reorderMut = useMutation({
    mutationFn: async (next: MenuItem[]) => {
      for (let i = 0; i < next.length; i++) {
        const { error } = await supabase.from("menu_items").update({ sort_order: (i + 1) * 10 }).eq("id", next[i].id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Order saved");
      qc.invalidateQueries({ queryKey: ["admin-menu", menuKey] });
      qc.invalidateQueries({ queryKey: ["public-menu"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("menu_items").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-menu", menuKey] });
      qc.invalidateQueries({ queryKey: ["public-menu"] });
    },
  });

  const saveMut = useMutation({
    mutationFn: async (m: MenuItem) => {
      if (m.id) {
        const { error } = await supabase.from("menu_items").update({
          label: m.label, href: m.href, is_active: m.is_active,
        }).eq("id", m.id);
        if (error) throw error;
      } else {
        const max = Math.max(0, ...items.map((i) => i.sort_order));
        const { error } = await supabase.from("menu_items").insert({
          menu_key: menuKey, label: m.label, href: m.href, is_active: m.is_active, sort_order: max + 10,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false); setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-menu", menuKey] });
      qc.invalidateQueries({ queryKey: ["public-menu"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-menu", menuKey] });
      qc.invalidateQueries({ queryKey: ["public-menu"] });
    },
  });

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          disabled={reorderMut.isPending || items.length === 0}
          onClick={() => reorderMut.mutate(items)}
        >
          {reorderMut.isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button onClick={() => { setEditing({ id: "", menu_key: menuKey, label: "", href: "/", sort_order: 0, is_active: true }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add item
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(next) => { setItems(next); reorderMut.mutate(next); }}
          renderItem={(m) => (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{m.label}</div>
                <div className="text-xs text-muted-foreground truncate">{m.href}</div>
              </div>
              <Switch checked={m.is_active} onCheckedChange={(v) => toggleMut.mutate({ id: m.id, is_active: v })} />
              <Button size="sm" variant="ghost" onClick={() => { setEditing(m); setOpen(true); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${m.label}"?`)) delMut.mutate(m.id); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit menu item" : "New menu item"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Label</Label>
                <Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
              </div>
              <div>
                <Label>Link (href)</Label>
                <Input value={editing.href} onChange={(e) => setEditing({ ...editing, href: e.target.value })} placeholder="/collections/rings" />
                <p className="text-xs text-muted-foreground mt-1">Examples: /, /about, /collections/rings, /custom-order</p>
              </div>
              <div className="flex items-center justify-between border rounded px-3 py-2">
                <Label className="mb-0">Visible</Label>
                <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={!editing?.label || !editing?.href || saveMut.isPending} onClick={() => editing && saveMut.mutate(editing)}>
              {saveMut.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
