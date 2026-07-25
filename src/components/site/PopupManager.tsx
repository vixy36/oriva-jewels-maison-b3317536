import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

type Popup = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  cta_label: string | null;
  size: string;
  pages: string[];
  active: boolean;
  delay_seconds: number;
  frequency: string;
  start_at: string | null;
  end_at: string | null;
  priority: number;
};

function pageMatches(pages: string[], pathname: string) {
  if (!pages || pages.length === 0) return false;
  return pages.some((p) => {
    const rule = p.trim();
    if (!rule) return false;
    if (rule === "*" || rule === "/*" || rule === "all") return true;
    if (rule.endsWith("/*")) return pathname.startsWith(rule.slice(0, -2));
    return pathname === rule;
  });
}

function shouldShow(popup: Popup) {
  const key = `oriva_popup_${popup.id}`;
  if (popup.frequency === "always") return true;
  if (popup.frequency === "session") return !sessionStorage.getItem(key);
  return !localStorage.getItem(key); // once
}

function markShown(popup: Popup) {
  const key = `oriva_popup_${popup.id}`;
  if (popup.frequency === "session") sessionStorage.setItem(key, "1");
  else if (popup.frequency === "once") localStorage.setItem(key, "1");
}

export function PopupManager({ pathname }: { pathname: string }) {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPopup(null);
    setVisible(false);

    (async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("popups")
        .select("*")
        .eq("active", true)
        .order("priority", { ascending: false })
        .limit(20);
      if (cancelled || !data) return;

      const eligible = (data as Popup[]).filter((p) => {
        if (p.start_at && p.start_at > now) return false;
        if (p.end_at && p.end_at < now) return false;
        if (!pageMatches(p.pages, pathname)) return false;
        return shouldShow(p);
      });

      if (eligible.length === 0) return;
      const chosen = eligible[0];
      const delay = Math.max(0, (chosen.delay_seconds ?? 3) * 1000);
      setTimeout(() => {
        if (cancelled) return;
        setPopup(chosen);
        setVisible(true);
      }, delay);
    })();

    return () => { cancelled = true; };
  }, [pathname]);

  if (!popup || !visible) return null;

  const sizeCls = popup.size === "small"
    ? "max-w-sm"
    : popup.size === "large"
      ? "max-w-3xl"
      : "max-w-lg";

  function close() {
    if (popup) markShown(popup);
    setVisible(false);
  }

  const inner = (
    <div className={`relative w-full ${sizeCls} bg-ivory text-obsidian shadow-2xl border border-obsidian/10`}>
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center bg-obsidian/85 text-ivory hover:bg-obsidian"
      >
        <X className="h-4 w-4" />
      </button>
      {popup.image_url && (
        <img src={popup.image_url} alt={popup.title} className="w-full h-auto max-h-[55vh] object-cover" />
      )}
      <div className="p-6 md:p-8 text-center">
        {popup.title && <h3 className="font-serif text-2xl md:text-3xl">{popup.title}</h3>}
        {popup.description && <p className="mt-3 text-sm leading-relaxed text-obsidian/75">{popup.description}</p>}
        {popup.link_url && (
          <a
            href={popup.link_url}
            onClick={close}
            className="mt-5 inline-block px-6 py-2.5 text-xs tracking-[0.32em] uppercase bg-obsidian text-ivory hover:bg-obsidian/85"
          >
            {popup.cta_label || "Explore"}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={close} />
      <div className="relative">{inner}</div>
    </div>
  );
}
