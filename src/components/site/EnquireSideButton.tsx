import { buildWhatsAppLink } from "@/lib/products";

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.29.63 4.437 1.727 6.28L4 29l7.9-1.686A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.627 28 15S22.633 3 16.003 3Zm0 21.6a9.56 9.56 0 0 1-4.87-1.33l-.35-.207-4.687 1 1.02-4.567-.227-.373A9.55 9.55 0 0 1 6.4 15c0-5.293 4.31-9.6 9.603-9.6 5.29 0 9.597 4.307 9.597 9.6s-4.307 9.6-9.597 9.6Zm5.487-7.187c-.3-.15-1.777-.877-2.053-.977-.276-.1-.477-.15-.677.15-.2.3-.777.977-.953 1.177-.176.2-.35.223-.65.073-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.135.3-.35.45-.525.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.238-.244-.587-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.03-1.053 2.512s1.078 2.913 1.228 3.113c.15.2 2.12 3.238 5.138 4.542.718.31 1.278.495 1.715.634.72.229 1.376.196 1.894.119.578-.087 1.777-.727 2.028-1.428.25-.7.25-1.3.175-1.428-.075-.128-.275-.203-.575-.353Z" />
    </svg>
  );
}

/**
 * Vertical "Enquire us now" WhatsApp launcher pinned to the right edge on desktop.
 * Hidden on mobile (bottom-nav already has a WhatsApp entry).
 */
export function EnquireSideButton() {
  return (
    <a
      href={buildWhatsAppLink("Hello Oriva Jewels, I'd like to enquire about a piece.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Enquire on WhatsApp"
      className="group fixed right-0 top-1/2 z-[55] hidden md:flex -translate-y-1/2 items-center gap-2.5 rounded-l-md bg-gold px-3 py-5 text-obsidian shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:bg-ivory hover:text-obsidian transition-colors"
      style={{ writingMode: "vertical-rl" }}
    >
      <WhatsAppGlyph className="h-5 w-5 rotate-90" />
      <span className="text-[12px] tracking-[0.42em] uppercase font-medium rotate-180">
        Enquire us now
      </span>
    </a>
  );
}
