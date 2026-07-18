import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/products";

export function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 md:right-6 bottom-24 md:bottom-8 z-[55] flex flex-col items-end gap-3">
      <a
        href={buildWhatsAppLink("Hello Oriva Jewels, I'd like to enquire.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] hover:scale-105 transition"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-ping [animation-duration:2.4s]" aria-hidden />
        <MessageCircle className="relative h-6 w-6" strokeWidth={1.6} />
      </a>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-obsidian/80 backdrop-blur text-gold hover:bg-gold hover:text-obsidian transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" strokeWidth={1.4} />
      </button>
    </div>
  );
}
