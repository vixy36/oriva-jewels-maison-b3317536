import { createFileRoute, Outlet, Link, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Search, Inbox, FileEdit, LogOut, Menu, X, Tag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    return { user: userData.user, isAdmin: Boolean(isAdmin) };
  },
  pendingMs: 0,
  pendingMinMs: 0,
  pendingComponent: AdminSkeleton,
  component: AdminLayout,
});

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex pt-20 lg:pt-24">
      <aside className="hidden lg:block sticky top-24 w-64 h-[calc(100vh-6rem)] border-r border-border/60 bg-card">
        <div className="p-5 border-b border-border/60">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="p-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 bg-muted/60 animate-pulse rounded" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 max-w-full bg-muted/60 animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/50 animate-pulse rounded" />
          ))}
        </div>
      </main>
    </div>
  );
}

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/offers", label: "Offers", icon: Tag },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/content", label: "Content", icon: FileEdit },
];

function AdminLayout() {
  const { user, isAdmin } = Route.useRouteContext();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="max-w-md text-center border border-border/60 p-10 bg-card">
          <p className="eyebrow">Restricted</p>
          <h1 className="mt-3 font-serif text-3xl">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in as <span className="text-foreground">{user.email}</span>, but this account has no admin role.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Ask the maison to grant you the <code>admin</code> role in the <code>user_roles</code> table.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button variant="outline" onClick={signOut}>Sign out</Button>
            <Button asChild><Link to="/">Return to site</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex pt-20 lg:pt-24">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-24 inset-y-0 lg:inset-y-auto left-0 z-40 w-64 lg:h-[calc(100vh-6rem)] border-r border-border/60 bg-card transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <Link to="/" className="text-sm tracking-[0.28em] uppercase font-serif">Oriva Admin</Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${
                  active ? "bg-foreground text-background" : "hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-border/60">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden border-b border-border/60 bg-card p-4 flex items-center justify-between">
          <button onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <span className="text-sm tracking-[0.28em] uppercase font-serif">Admin</span>
          <span className="w-5" />
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>

  );
}
