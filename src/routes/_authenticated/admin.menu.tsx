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
  parent_id?: string | null;
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
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);

  const { data: allItems, isLoading } = useQuery({
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
      const payload = {
        label: m.label,
        href: m.href,
        is_active: m.is_active,
        parent_id: m.parent_id || null,
      };
      if (m.id) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", m.id);
        if (error) throw error;
      } else {
        const max = Math.max(0, ...(allItems?.map((i) => i.sort_order) || []));
        const { error } = await supabase.from("menu_items").insert({
          ...payload,
          menu_key: menuKey,
          sort_order: max + 10,
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

  const topLevelItems = (allItems ?? []).filter(i => !i.parent_id);

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={() => { setEditing({ id: "", menu_key: menuKey, label: "", href: "/", sort_order: 0, is_active: true, parent_id: null }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add item
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          <SortableList
            items={topLevelItems}
            onReorder={(next) => reorderMut.mutate(next)}
            renderItem={(m) => (
              <div className="w-full">
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
                
                {/* Children / Submenu items */}
                <div className="mt-3 ml-8 space-y-2 border-l border-border/40 pl-4">
                  {(allItems ?? []).filter(child => child.parent_id === m.id).map(child => (
                    <div key={child.id} className="flex items-center gap-3 bg-muted/30 p-2 rounded-sm border border-border/20">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{child.label}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{child.href}</div>
                      </div>
                      <Switch size="sm" checked={child.is_active} onCheckedChange={(v) => toggleMut.mutate({ id: child.id, is_active: v })} />
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(child); setOpen(true); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { if (confirm(`Delete "${child.label}"?`)) delMut.mutate(child.id); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => { setEditing({ id: "", menu_key: menuKey, label: "", href: "/", sort_order: 0, is_active: true, parent_id: m.id }); setOpen(true); }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add sub-item
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
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
              <div>
                <Label>Parent Item (for dropdowns)</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editing.parent_id || ""}
                  onChange={(e) => setEditing({ ...editing, parent_id: e.target.value || null })}
                >
                  <option value="">None (Top Level)</option>
                  {topLevelItems.filter(i => i.id !== editing.id).map(i => (
                    <option key={i.id} value={i.id}>{i.label}</option>
                  ))}
                </select>
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
