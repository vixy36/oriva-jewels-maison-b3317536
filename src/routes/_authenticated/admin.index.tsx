import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Inbox, Search, Users, ShoppingBag, Truck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0, enquiries: 0, unread: 0, seo: 0, users: 0,
    orders: 0, openOrders: 0, shipped: 0,
  });

  useEffect(() => {
    (async () => {
      const [p, e, u, s, r, o, oo, sh] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("seo_meta").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["pending", "confirmed", "in_production"]),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "shipped"),
      ]);
      setStats({
        products: p.count ?? 0,
        enquiries: e.count ?? 0,
        unread: u.count ?? 0,
        seo: s.count ?? 0,
        users: r.count ?? 0,
        orders: o.count ?? 0,
        openOrders: oo.count ?? 0,
        shipped: sh.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { to: "/admin/orders", label: "Orders", value: `${stats.orders} (${stats.openOrders} open)`, icon: ShoppingBag },
    { to: "/admin/orders", label: "In Transit", value: stats.shipped, icon: Truck },
    { to: "/admin/enquiries", label: "Enquiries", value: `${stats.enquiries} (${stats.unread} unread)`, icon: Inbox },
    { to: "/admin/products", label: "Products", value: stats.products, icon: Package },
    { to: "/admin/seo", label: "SEO Pages", value: stats.seo, icon: Search },
    { to: "/admin/users", label: "Users & Roles", value: stats.users, icon: Users },
  ];

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage products, orders, SEO, enquiries and team access.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
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


