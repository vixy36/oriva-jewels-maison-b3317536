import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, ChevronDown, Plus, Minus } from "lucide-react";
import { SearchDialog } from "@/components/site/SearchDialog";
import { ensureGsap } from "@/lib/gsap";
import orivaLogo from "@/assets/oriva-logo.png.asset.json";

type NavItem = {
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
};

const nav: NavItem[] = [
  {
    label: "Fine Jewelry",
    to: "/collections/rings",
    children: [
      { label: "Rings", to: "/collections/rings" },
      { label: "Earrings", to: "/collections/earrings" },
      { label: "Bracelets", to: "/collections/bracelets" },
      { label: "Necklaces", to: "/collections/necklaces" },
      { label: "Pendants", to: "/collections/pendants" },
      { label: "Men's Jewelry", to: "/collections/mens-jewelry" },
    ],
  },
  { label: "Engagement Rings", to: "/collections/engagement-rings" },
  { label: "Bespoke", to: "/bespoke" },
  {
    label: "Diamonds",
    to: "/collections/lab-grown",
    children: [
      { label: "Lab Grown Diamonds", to: "/collections/lab-grown" },
      { label: "Natural Diamonds", to: "/collections/natural" },
    ],
  },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const header = headerRef.current;
    const logo = logoRef.current;
    const container = navItemsRef.current;
    if (!header || !logo || !container) return;

    gsap.set(logo, { scale: 1.05, transformOrigin: "center center" });

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
        <div ref={navItemsRef} className="relative mx-auto grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5 md:px-10 md:py-5 max-w-[1600px]">
          <button
            className="lg:hidden text-ivory justify-self-start"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-6 justify-self-start">
            {nav.slice(0, 3).map((n) => (
              <div
                key={n.label}
                className="relative"
                onMouseEnter={() => n.children && setOpenSub(n.label)}
                onMouseLeave={() => n.children && setOpenSub(null)}
              >
                <Link
                  to={n.to!}
                  data-nav-item
                  className="flex items-center gap-1 font-serif text-[17px] tracking-[0.12em] uppercase whitespace-nowrap text-ivory hover:text-gold transition-colors py-2"
                  activeProps={{ className: "text-gold" }}
                >
                  {n.label}
                  {n.children && <ChevronDown className="h-3.5 w-3.5 opacity-80" strokeWidth={1.6} />}
                </Link>
                {n.children && openSub === n.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                    <div className="min-w-[240px] border border-white/10 bg-obsidian/98 backdrop-blur-xl py-3 shadow-2xl">
                      {n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          className="block px-5 py-2.5 font-serif text-[14px] tracking-[0.14em] uppercase text-ivory hover:text-gold hover:bg-white/[0.04] transition"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <Link
            ref={logoRef}
            to="/"
            className="group flex items-center justify-self-center"
            aria-label="Oriva Jewels"
          >
            <img
              src={orivaLogo.url}
              alt="Oriva Jewels"
              className="h-11 md:h-12 w-auto brightness-0 invert"
              draggable={false}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 justify-self-end">
            {nav.slice(3).map((n) => (
              <div
                key={n.label}
                className="relative"
                onMouseEnter={() => n.children && setOpenSub(n.label)}
                onMouseLeave={() => n.children && setOpenSub(null)}
              >
                <Link
                  to={n.to!}
                  data-nav-item
                  className="flex items-center gap-1 font-serif text-[17px] tracking-[0.12em] uppercase whitespace-nowrap text-ivory hover:text-gold transition-colors py-2"
                  activeProps={{ className: "text-gold" }}
                >
                  {n.label}
                  {n.children && <ChevronDown className="h-3.5 w-3.5 opacity-80" strokeWidth={1.6} />}
                </Link>
                {n.children && openSub === n.label && (
                  <div className="absolute right-0 top-full pt-2">
                    <div className="min-w-[240px] border border-white/10 bg-obsidian/98 backdrop-blur-xl py-3 shadow-2xl">
                      {n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          className="block px-5 py-2.5 font-serif text-[14px] tracking-[0.14em] uppercase text-ivory hover:text-gold hover:bg-white/[0.04] transition"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-ivory hover:text-gold transition ml-2"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </nav>

          <div className="flex items-center gap-5 justify-self-end lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-ivory hover:text-gold transition"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>

        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] bg-obsidian lg:hidden animate-fade-in overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-obsidian z-10">
            <span className="font-serif text-xl tracking-[0.5em] text-ivory">ORIVA</span>
            <button aria-label="Close" onClick={() => setOpen(false)} className="text-ivory">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-6 pb-24">
            {nav.map((n) => {
              const expanded = mobileSub === n.label;
              return (
                <div key={n.label} className="border-b border-white/5">
                  <div className="flex items-center justify-between py-4">
                    <Link
                      to={n.to!}
                      onClick={() => setOpen(false)}
                      className="font-serif text-2xl text-ivory hover:text-gold transition flex-1"
                    >
                      {n.label}
                    </Link>
                    {n.children && (
                      <button
                        aria-label={expanded ? "Collapse" : "Expand"}
                        onClick={() => setMobileSub(expanded ? null : n.label)}
                        className="text-gold p-2"
                      >
                        {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  {n.children && expanded && (
                    <div className="pb-4 pl-2 flex flex-col gap-3">
                      {n.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setOpen(false)}
                          className="text-[13px] tracking-[0.28em] uppercase text-ivory/75 hover:text-gold transition"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
