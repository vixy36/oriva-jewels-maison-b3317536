import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

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
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.4} />
              Enquire
            </a>
            <a
              href={buildWhatsAppLink("Hello Oriva Jewels")}
              target="_blank"
              rel="noreferrer"
              className="md:hidden text-ivory"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.2} />
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
