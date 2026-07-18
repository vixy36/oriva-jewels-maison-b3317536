import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";
import { ensureGsap } from "@/lib/gsap";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.29.63 4.437 1.727 6.28L4 29l7.9-1.686A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.627 28 15S22.633 3 16.003 3Zm0 21.6a9.56 9.56 0 0 1-4.87-1.33l-.35-.207-4.687 1 1.02-4.567-.227-.373A9.55 9.55 0 0 1 6.4 15c0-5.293 4.31-9.6 9.603-9.6 5.29 0 9.597 4.307 9.597 9.6s-4.307 9.6-9.597 9.6Zm5.487-7.187c-.3-.15-1.777-.877-2.053-.977-.276-.1-.477-.15-.677.15-.2.3-.777.977-.953 1.177-.176.2-.35.223-.65.073-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.135.3-.35.45-.525.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.238-.244-.587-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.03-1.053 2.512s1.078 2.913 1.228 3.113c.15.2 2.12 3.238 5.138 4.542.718.31 1.278.495 1.715.634.72.229 1.376.196 1.894.119.578-.087 1.777-.727 2.028-1.428.25-.7.25-1.3.175-1.428-.075-.128-.275-.203-.575-.353Z"/>
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
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const header = headerRef.current;
    const logo = logoRef.current;
    const container = navItemsRef.current;
    if (!header || !logo || !container) return;

    const menuItems = container.querySelectorAll<HTMLElement>("[data-nav-item]");
    gsap.set(logo, { scale: 1.05, transformOrigin: "center center" });
    gsap.set(menuItems, { y: 0 });

    let lastY = window.scrollY;
    let hidden = false;
    let scrolled = false;
    let ticking = false;

    const applyScrolled = (next: boolean) => {
      if (next === scrolled) return;
      scrolled = next;
      gsap.to(header, {
        backgroundColor: next ? "rgba(10,10,10,0.72)" : "rgba(3,3,3,0.4)",
        backdropFilter: next ? "blur(20px)" : "blur(6px)",
        borderBottomColor: next ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(logo, {
        scale: next ? 1 : 1.05,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(menuItems, {
        y: next ? 15 : 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.03,
        overwrite: "auto",
      });
    };

    const applyHidden = (next: boolean) => {
      if (next === hidden) return;
      hidden = next;
      gsap.to(header, {
        yPercent: next ? -100 : 0,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        applyScrolled(y > 30);
        // hide on scroll down past threshold, show on scroll up
        if (y > 120 && y > lastY + 4) applyHidden(true);
        else if (y < lastY - 4) applyHidden(false);
        lastY = y;
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent will-change-transform"
        style={{ backgroundColor: "rgba(3,3,3,0.4)", backdropFilter: "blur(6px)" }}
      >
        <div ref={navItemsRef} className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5 md:px-10 md:py-6">
          <div className="flex items-center gap-6">
            <button
              className="md:hidden text-ivory"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden md:flex items-center gap-7">
              {nav.slice(0, 3).map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  data-nav-item
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
              - JEWELS -
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
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Enquire
            </a>
            <a
              href={buildWhatsAppLink("Hello Oriva Jewels")}
              target="_blank"
              rel="noreferrer"
              className="md:hidden text-ivory"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" />
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
              <X className="h-5 w-5" />
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
