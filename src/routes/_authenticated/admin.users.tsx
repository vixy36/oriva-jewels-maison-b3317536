import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAdminUsers, setUserRole, createAdminUser } from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Shield, User as UserIcon, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

type Role = "admin" | "editor" | "user";
const ALL_ROLES: Role[] = ["admin", "editor", "user"];

const roleBadge = (r: string) =>
  r === "admin"
    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
    : r === "editor"
      ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
      : "bg-muted text-muted-foreground";

function UsersPage() {
  const list = useServerFn(listAdminUsers);
  const setRole = useServerFn(setUserRole);
  const createUser = useServerFn(createAdminUser);
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => list({}),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const mut = useMutation({
    mutationFn: (v: { userId: string; role: Role; grant: boolean }) => setRole({ data: v }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ["admin-users"] });
      const prev = qc.getQueryData<any[]>(["admin-users"]);
      qc.setQueryData<any[]>(["admin-users"], (rows) =>
        (rows ?? []).map((u) =>
          u.id === v.userId
            ? {
                ...u,
                roles: v.grant
                  ? Array.from(new Set([...(u.roles ?? []), v.role]))
                  : (u.roles ?? []).filter((r: string) => r !== v.role),
              }
            : u,
        ),
      );
      return { prev };
    },
    onError: (e: any, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin-users"], ctx.prev);
      toast.error(e?.message ?? "Failed to update role");
    },
    onSuccess: () => toast.success("Roles updated"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const createMut = useMutation({
    mutationFn: (v: { email: string; password: string; roles: Role[] }) => createUser({ data: v }),
    onSuccess: () => {
      toast.success("User created");
      setCreating(false);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to create user"),
  });

  const filtered = (data ?? [])
    .filter((u) => u.email !== "vivekchoudharyjpr@gmail.com")
    .filter((u) =>
      query ? u.email.toLowerCase().includes(query.toLowerCase()) : true,
    );

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Team</p>
          <h1 className="mt-2 font-serif text-3xl">Users &amp; Roles</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Manage who can access the admin dashboard.
            <span className="ml-1 font-medium text-foreground">Admin</span> = full control.
            <span className="ml-2 font-medium text-foreground">Editor</span> = manage products/SEO/enquiries.
            <span className="ml-2 font-medium text-foreground">User</span> = customer, no admin access.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email…"
            className="pl-9"
          />
        </div>
        {isFetching && !isLoading && <span className="text-xs text-muted-foreground">refreshing…</span>}
      </div>

      <div className="mt-4 border border-border/60 bg-card overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="ml-auto h-8 w-40 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-600">{(error as Error).message}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Current Roles</th>
                  <th className="text-left p-3">Last sign-in</th>
                  <th className="text-right p-3 min-w-[280px]">Assign Roles</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-border/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {u.roles.includes("admin") ? (
                          <Shield className="h-4 w-4 text-amber-600" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="truncate">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">customer</span>
                        ) : (
                          u.roles.map((r) => (
                            <span
                              key={r}
                              className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-widest ${roleBadge(r)}`}
                            >
                              {r}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-3 justify-end">
                        {ALL_ROLES.map((r) => {
                          const has = u.roles.includes(r);
                          return (
                            <label
                              key={r}
                              className="flex items-center gap-1.5 text-xs cursor-pointer select-none"
                            >
                              <Checkbox
                                checked={has}
                                disabled={mut.isPending}
                                onCheckedChange={(v) =>
                                  mut.mutate({ userId: u.id, role: r, grant: Boolean(v) })
                                }
                              />
                              <span className="uppercase tracking-widest">{r}</span>
                            </label>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && (
        <CreateUserDialog
          onClose={() => setCreating(false)}
          onSubmit={(v) => createMut.mutate(v)}
          saving={createMut.isPending}
        />
      )}
    </div>
  );
}

function CreateUserDialog({
  onClose,
  onSubmit,
  saving,
}: {
  onClose: () => void;
  onSubmit: (v: { email: string; password: string; roles: Role[] }) => void;
  saving: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>(["user"]);

  const toggle = (r: Role) =>
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <Label className="text-xs">Temporary password</Label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Share this with the user — they can change it after signing in.
            </p>
          </div>
          <div>
            <Label className="text-xs">Roles</Label>
            <div className="mt-2 flex flex-wrap gap-4">
              {ALL_ROLES.map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={roles.includes(r)} onCheckedChange={() => toggle(r)} />
                  <span className="uppercase tracking-widest text-xs">{r}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={saving || !email || password.length < 8}
            onClick={() => onSubmit({ email, password, roles })}
          >
            {saving ? "Creating…" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
