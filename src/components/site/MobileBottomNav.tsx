import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Gem, BookOpen, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { buildWhatsAppLink } from "@/lib/products";

const items = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    to: "/collections/engagement-rings",
    label: "Shop",
    icon: Gem,
    match: (p: string) => p.startsWith("/collections") || p.startsWith("/product"),
  },
  { to: "/about", label: "Maison", icon: BookOpen, match: (p: string) => p === "/about" },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 md:hidden">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-px bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"
        />
        <div className="relative bg-obsidian/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] px-2 py-2">
          <ul className="flex items-center justify-around gap-1">
            {items.map((item) => {
              const active = item.match(pathname);
              const Icon = item.icon;
              return (
                <li key={item.to} className="flex-1">
                  <Link
                    to={item.to}
                    className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition ${
                      active ? "text-gold" : "text-ivory/55"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-8 bg-gold shadow-[0_0_10px_var(--gold)]"
                      />
                    )}
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} />
                    <span className="text-[8.5px] tracking-[0.28em] uppercase font-medium">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="flex-1">
              <a
                href={buildWhatsAppLink("Hello Oriva Jewels")}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-gold"
              >
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.4} />
                <span className="text-[8.5px] tracking-[0.28em] uppercase font-medium">
                  Enquire
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
