import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

function WhatsAppIcon({ className = "", strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2.5 21.5l4.3-1.1A11 11 0 1 0 20.5 3.5Z" />
      <path d="M8.5 8.5c.2-.5.5-.6.8-.6h.6c.2 0 .5 0 .7.5s.8 1.9.9 2 .1.3 0 .5-.2.3-.4.5-.3.3-.5.5-.3.3-.1.6a7 7 0 0 0 1.3 1.6 6 6 0 0 0 1.9 1.2c.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3v.3a2.4 2.4 0 0 1-1.6 1.7 2.6 2.6 0 0 1-1.4.1 8.9 8.9 0 0 1-4-2.1 9 9 0 0 1-2.5-3.6 2.9 2.9 0 0 1 .3-2.4Z" />
    </svg>
  );
}

const nav = [
  { label: "Engagement", to: "/collections/engagement-rings" },
  { label: "Earrings", to: "/collections/earrings" },
  { label: "Bracelets", to: "/collections/bracelets" },
  { label: "Bridal", to: "/collections/bridal" },
  { label: "The Maison", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-ink/90 backdrop-blur-2xl border-b border-white/5"
            : "bg-obsidian/60 backdrop-blur"
        }`}
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5 md:px-10 md:py-6">
          <div className="flex items-center gap-6">
            <button
              className="md:hidden text-ivory"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.2} />
            </button>
            <nav className="hidden md:flex items-center gap-7">
              {nav.slice(0, 3).map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="text-[10.5px] tracking-[0.32em] uppercase text-ivory/80 hover:text-gold transition-colors"
                  activeProps={{ className: "text-gold" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link to="/" className="group flex flex-col items-center">
            <span className="font-serif text-2xl md:text-[26px] tracking-[0.5em] text-ivory leading-none">
              ORIVA
            </span>
            <span className="mt-1 font-sans text-[8.5px] tracking-[0.55em] text-gold">
              — JEWELS —
            </span>
          </Link>

          <div className="flex items-center justify-end gap-6">
            <nav className="hidden md:flex items-center gap-7">
              {nav.slice(3).map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="text-[10.5px] tracking-[0.32em] uppercase text-ivory/80 hover:text-gold transition-colors"
                  activeProps={{ className: "text-gold" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <a
              href={buildWhatsAppLink("Hello Oriva Jewels, I'd like a private consultation.")}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-2 text-[14px] tracking-[0.32em] uppercase text-gold hover:text-ivory transition"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" strokeWidth={1.4} />
              Enquire
            </a>
            <a
              href={buildWhatsAppLink("Hello Oriva Jewels")}
              target="_blank"
              rel="noreferrer"
              className="md:hidden text-ivory"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" strokeWidth={1.2} />
            </a>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] bg-obsidian md:hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <span className="font-serif text-xl tracking-[0.5em] text-ivory">ORIVA</span>
            <button aria-label="Close" onClick={() => setOpen(false)} className="text-ivory">
              <X className="h-5 w-5" strokeWidth={1.2} />
            </button>
          </div>
          <nav className="flex flex-col px-8 pt-16">
            {nav.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="group border-b border-white/5 py-6 flex items-baseline gap-4"
              >
                <span className="text-[14px] tracking-[0.3em] text-gold font-sans">
                  0{i + 1}
                </span>
                <span className="font-serif text-3xl text-ivory group-hover:text-gold transition">
                  {n.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-10 left-8 right-8">
            <p className="eyebrow">Hong Kong · By Appointment</p>
            <p className="mt-3 font-serif text-lg text-ivory">hello@orivajewels.com</p>
          </div>
        </div>
      )}
    </>
  );
}
