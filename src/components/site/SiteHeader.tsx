import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

const nav = [
  { label: "Engagement", to: "/collections/engagement-rings" },
  { label: "Earrings", to: "/collections/earrings" },
  { label: "Bracelets", to: "/collections/bracelets" },
  { label: "Bridal", to: "/collections/bridal" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <button
          className="md:hidden text-ivory"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="group flex-1 md:flex-none text-center md:text-left">
          <span className="font-serif text-xl md:text-2xl tracking-[0.35em] text-ivory">
            ORIVA
          </span>
          <span className="ml-2 hidden md:inline-block font-serif text-xs tracking-[0.5em] text-champagne">
            JEWELS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[11px] tracking-[0.28em] uppercase text-ivory/80 hover:text-champagne transition-colors"
              activeProps={{ className: "text-champagne" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href={buildWhatsAppLink("Hello Oriva Jewels, I'd like a consultation.")}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 border border-champagne/60 px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-ivory hover:bg-champagne hover:text-ink transition"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>

        <a
          href={buildWhatsAppLink("Hello Oriva Jewels, I'd like a consultation.")}
          target="_blank"
          rel="noreferrer"
          className="md:hidden text-ivory"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-ink md:hidden animate-rise">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-serif text-xl tracking-[0.35em] text-ivory">ORIVA</span>
            <button aria-label="Close" onClick={() => setOpen(false)} className="text-ivory">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-10">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-5 font-serif text-3xl text-ivory"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
