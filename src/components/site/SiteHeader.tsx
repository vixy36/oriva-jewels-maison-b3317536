import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, Search, ChevronDown, Plus, Minus, Heart } from "lucide-react";
import { SearchDialog } from "@/components/site/SearchDialog";
import { ensureGsap } from "@/lib/gsap";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/lib/wishlist";
import orivaLogo from "@/assets/oriva-logo.png.asset.json";

type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
};

const DIAMOND_CHILDREN: { label: string; to: string }[] = [
  { label: "Lab Grown Diamonds", to: "/collections/lab-grown" },
  { label: "Natural Diamonds", to: "/collections/natural" },
];

const FINE_CHILDREN: { label: string; to: string }[] = [
  { label: "Rings", to: "/collections/rings" },
  { label: "Earrings", to: "/collections/earrings" },
  { label: "Bracelets", to: "/collections/bracelets" },
  { label: "Necklaces", to: "/collections/necklaces" },
  { label: "Pendants", to: "/collections/pendants" },
];

const FALLBACK_NAV: NavItem[] = [
  { label: "Fine Jewelry", to: "/collections/rings", children: FINE_CHILDREN },
  { label: "Engagement Rings", to: "/collections/engagement-rings" },
  { label: "Bespoke", to: "/custom-order" },
  { label: "Gifts", to: "/gifts" },
  { label: "Hip Hop Jewelry", to: "/collections/hip-hop-jewelry" },
  { label: "Diamonds", to: "/diamonds", children: DIAMOND_CHILDREN },
];

const FALLBACK_SUB: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function useMenu() {
  return useQuery({
    queryKey: ["public-menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("menu_key,label,href,sort_order,is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60_000,
  });
}


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const { count: wishlistCount } = useWishlist();

  const { data: menuRows } = useMenu();

  const nav = useMemo<NavItem[]>(() => {
    const mainRows = (menuRows ?? []).filter((r) => r.menu_key === "main");
    if (mainRows.length === 0) return FALLBACK_NAV;
    return mainRows.map((r) => {
      const label = r.label;
      const to = r.href;
      // Attach known children menus by heuristic so dropdowns still work.
      if (/fine|jewel/i.test(label)) return { label, to, children: FINE_CHILDREN };
      if (/diamond/i.test(label)) return { label, to, children: DIAMOND_CHILDREN };
      return { label, to };
    });
  }, [menuRows]);

  const sub = useMemo(() => {
    const rows = (menuRows ?? []).filter((r) => r.menu_key === "sub");
    const baseSub = rows.length > 0 ? rows.map((r) => ({ label: r.label, to: r.href })) : FALLBACK_SUB;
    // Explicitly filter out Offers and Wishlist as requested
    return baseSub.filter(s => !/offer|wishlist/i.test(s.label));
  }, [menuRows]);

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
        <div className="border-b border-white/5 bg-obsidian/60">
          <div className="mx-auto max-w-[1600px] px-3 md:px-10">
            <div className="flex items-center justify-start md:justify-center gap-3 md:gap-8 py-1.5 overflow-x-auto whitespace-nowrap no-scrollbar">
              {sub.map((s, idx) => (
                <span key={s.to + s.label} className="flex items-center gap-3 md:gap-8 shrink-0">
                  {idx > 0 && <span className="h-3 w-px bg-white/15 shrink-0" aria-hidden />}
                  <Link
                    to={s.to as string}
                    className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.28em] uppercase text-ivory/80 hover:text-gold transition"
                    activeProps={{ className: "text-gold" }}
                    activeOptions={s.to === "/" ? { exact: true } : undefined}
                  >
                    {s.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div ref={navItemsRef} className="relative mx-auto grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-2 md:px-10 md:py-3 max-w-[1600px]">
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
                  className="flex items-center gap-1 font-serif font-bold text-[17px] tracking-[0.12em] uppercase whitespace-nowrap text-white hover:text-gold transition-colors py-2"
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
              className="h-7 md:h-9 w-auto brightness-0 invert"
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
                  className="flex items-center gap-1 font-serif font-bold text-[17px] tracking-[0.12em] uppercase whitespace-nowrap text-white hover:text-gold transition-colors py-2"
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
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-ivory hover:text-gold transition ml-2"
            >
              <Heart className="h-5 w-5" strokeWidth={1.6} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 grid place-items-center bg-gold text-obsidian text-[9px] font-semibold rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-ivory hover:text-gold transition ml-1"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </nav>

          <div className="flex items-center gap-4 justify-self-end lg:hidden">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-ivory hover:text-gold transition"
            >
              <Heart className="h-5 w-5" strokeWidth={1.6} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 grid place-items-center bg-gold text-obsidian text-[9px] font-semibold rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
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
