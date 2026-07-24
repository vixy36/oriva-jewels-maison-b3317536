import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Inbox, Search, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, enquiries: 0, unread: 0, seo: 0, users: 0 });

  useEffect(() => {
    (async () => {
      const [p, e, u, s, r] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("seo_meta").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        products: p.count ?? 0,
        enquiries: e.count ?? 0,
        unread: u.count ?? 0,
        seo: s.count ?? 0,
        users: r.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { to: "/admin/products", label: "Products", value: stats.products, icon: Package },
    { to: "/admin/enquiries", label: "Enquiries", value: `${stats.enquiries} (${stats.unread} unread)`, icon: Inbox },
    { to: "/admin/seo", label: "SEO Pages", value: stats.seo, icon: Search },
    { to: "/admin/users", label: "Users & Roles", value: stats.users, icon: Users },
  ];

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage products, SEO, enquiries and team access.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className="border border-border/60 bg-card p-5 hover:border-foreground/40 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
              <div className="mt-4 font-serif text-2xl">{c.value}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

