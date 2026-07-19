import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Gem, BookOpen } from "lucide-react";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.29.63 4.437 1.727 6.28L4 29l7.9-1.686A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.627 28 15S22.633 3 16.003 3Zm0 21.6a9.56 9.56 0 0 1-4.87-1.33l-.35-.207-4.687 1 1.02-4.567-.227-.373A9.55 9.55 0 0 1 6.4 15c0-5.293 4.31-9.6 9.603-9.6 5.29 0 9.597 4.307 9.597 9.6s-4.307 9.6-9.597 9.6Zm5.487-7.187c-.3-.15-1.777-.877-2.053-.977-.276-.1-.477-.15-.677.15-.2.3-.777.977-.953 1.177-.176.2-.35.223-.65.073-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.135.3-.35.45-.525.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.238-.244-.587-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.03-1.053 2.512s1.078 2.913 1.228 3.113c.15.2 2.12 3.238 5.138 4.542.718.31 1.278.495 1.715.634.72.229 1.376.196 1.894.119.578-.087 1.777-.727 2.028-1.428.25-.7.25-1.3.175-1.428-.075-.128-.275-.203-.575-.353Z"/>
    </svg>
  );
}
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
                    className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 text-gold transition"
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-8 bg-gold shadow-[0_0_10px_var(--gold)]"
                      />
                    )}
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} />
                    <span className="text-[10px] tracking-[0.22em] uppercase font-medium leading-none whitespace-nowrap">
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
                <span className="text-[10px] tracking-[0.22em] uppercase font-medium leading-none whitespace-nowrap">
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
