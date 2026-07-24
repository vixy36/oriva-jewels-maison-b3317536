import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAdminUsers, setUserRole } from "@/lib/admin-users.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, User as UserIcon, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

type Role = "admin" | "editor" | "user";
const ALL_ROLES: Role[] = ["admin", "editor", "user"];

function UsersPage() {
  const list = useServerFn(listAdminUsers);
  const setRole = useServerFn(setUserRole);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => list({}),
  });

  const mut = useMutation({
    mutationFn: (v: { userId: string; role: Role; grant: boolean }) => setRole({ data: v }),
    onSuccess: () => {
      toast.success("Roles updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update role"),
  });

  return (
    <div>
      <p className="eyebrow">Team</p>
      <h1 className="mt-2 font-serif text-3xl">Users &amp; Roles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Manage who can access the admin dashboard.
        <span className="ml-1 font-medium text-foreground">Admin</span> = full control.
        <span className="ml-2 font-medium text-foreground">Editor</span> = manage products/SEO/enquiries.
        <span className="ml-2 font-medium text-foreground">User</span> = customer, no admin access.
      </p>

      <div className="mt-6 border border-border/60 bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-600">{(error as Error).message}</div>
        ) : !data || data.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Roles</th>
                  <th className="text-left p-3">Last sign-in</th>
                  <th className="text-right p-3">Manage</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <tr key={u.id} className="border-t border-border/60">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {u.roles.includes("admin") ? (
                          <Shield className="h-4 w-4 text-amber-600" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{u.email}</span>
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
                              className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-widest ${
                                r === "admin"
                                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                  : r === "editor"
                                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {r}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex flex-wrap gap-1 justify-end">
                        {ALL_ROLES.filter((r) => r !== "user").map((r) => {
                          const has = u.roles.includes(r);
                          return (
                            <Button
                              key={r}
                              size="sm"
                              variant={has ? "default" : "outline"}
                              disabled={mut.isPending}
                              onClick={() =>
                                mut.mutate({ userId: u.id, role: r, grant: !has })
                              }
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              {has ? `Remove ${r}` : `Grant ${r}`}
                            </Button>
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
    </div>
  );
}
