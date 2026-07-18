import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Gem, Sparkles, Mail } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    to: "/collections/engagement-rings",
    label: "Collections",
    icon: Gem,
    match: (p: string) => p.startsWith("/collections"),
  },
  { to: "/about", label: "About", icon: Sparkles, match: (p: string) => p === "/about" },
  { to: "/contact", label: "Contact", icon: Mail, match: (p: string) => p === "/contact" },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <div className="rounded-t-[28px] rounded-b-[28px] bg-ink/95 backdrop-blur-xl border border-white/8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] px-3 py-2">
        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl px-5 py-2.5 transition ${
                    active ? "text-champagne" : "text-ivory/60"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-2xl bg-champagne/10 shadow-[0_0_24px_-4px_var(--champagne)]" />
                  )}
                  <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.5} />
                  <span className="relative text-[9px] tracking-[0.2em] uppercase">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
