import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { SearchDialog } from "@/components/site/SearchDialog";
import { ensureGsap } from "@/lib/gsap";
import orivaLogo from "@/assets/oriva-logo.png.asset.json";


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
  const [searchOpen, setSearchOpen] = useState(false);
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

    let scrolled = false;
    let ticking = false;

    const applyScrolled = (next: boolean) => {
      if (next === scrolled) return;
      scrolled = next;
      gsap.to(header, {
        backgroundColor: next ? "rgba(7,28,55,0.96)" : "rgba(7,28,55,0.92)",
        backdropFilter: next ? "blur(20px)" : "blur(14px)",
        borderBottomColor: next ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
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

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyScrolled(window.scrollY > 30);
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
        style={{ backgroundColor: "rgba(7,28,55,0.92)", backdropFilter: "blur(14px)" }}
      data-surface="dark"
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

          <Link ref={logoRef} to="/" className="group flex items-center justify-center" aria-label="Oriva Jewels">
            <img
              src={orivaLogo.url}
              alt="Oriva Jewels"
              className="h-12 md:h-14 w-auto brightness-0 invert"
              draggable={false}
            />
          </Link>

          <div className="flex items-center justify-end gap-6">
            <nav className="hidden md:flex items-center gap-7">
              {nav.slice(3).map((n) => (
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
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden lg:inline-flex items-center gap-2 text-[14px] tracking-[0.32em] uppercase text-gold hover:text-ivory transition"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={1.6} />
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden text-ivory"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.6} />
            </button>
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
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
