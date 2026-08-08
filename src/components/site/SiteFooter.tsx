import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/products";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.29.63 4.437 1.727 6.28L4 29l7.9-1.686A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.627 28 15S22.633 3 16.003 3Zm0 21.6a9.56 9.56 0 0 1-4.87-1.33l-.35-.207-4.687 1 1.02-4.567-.227-.373A9.55 9.55 0 0 1 6.4 15c0-5.293 4.31-9.6 9.603-9.6 5.29 0 9.597 4.307 9.597 9.6s-4.307 9.6-9.597 9.6Zm5.487-7.187c-.3-.15-1.777-.877-2.053-.977-.276-.1-.477-.15-.677.15-.2.3-.777.977-.953 1.177-.176.2-.35.223-.65.073-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.135.3-.35.45-.525.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.238-.244-.587-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.03-1.053 2.512s1.078 2.913 1.228 3.113c.15.2 2.12 3.238 5.138 4.542.718.31 1.278.495 1.715.634.72.229 1.376.196 1.894.119.578-.087 1.777-.727 2.028-1.428.25-.7.25-1.3.175-1.428-.075-.128-.275-.203-.575-.353Z"/>
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-obsidian text-ivory/85">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 0%, oklch(0.79 0.11 82 / 0.15), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 pt-8 pb-6 md:px-10 md:pt-10 md:pb-8">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-serif text-3xl tracking-[0.5em] text-ivory">ORIVA</p>
            <p className="mt-1 font-sans text-[14px] tracking-[0.55em] text-gold">- JEWELS -</p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ivory/60">
              End-to-end manufacturers of natural and lab grown diamond jewellery. Designed with
              quiet intention, finished by hand. Global support available.
            </p>
            <div className="mt-10 flex gap-2">
              <SocialLink href={buildWhatsAppLink("Hello Oriva Jewels")} label="WhatsApp">
                <WhatsAppIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/oriva__jewels" label="Instagram">
                <Instagram className="h-4 w-4" strokeWidth={1.3} />
              </SocialLink>
              <SocialLink href="mailto:orivajewelshk@gmail.com" label="Email">
                <Mail className="h-4 w-4" strokeWidth={1.3} />
              </SocialLink>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 gap-10 md:grid-cols-3">
            <FooterCol title="Collections" links={[
              { label: "Engagement Rings", to: "/collections/engagement-rings" },
              { label: "Earrings", to: "/collections/earrings" },
              { label: "Bracelets", to: "/collections/bracelets" },
              { label: "Pendants", to: "/collections/pendants" },
              { label: "Bridal", to: "/collections/bridal" },
              { label: "Lab Grown", to: "/collections/lab-grown" },
            ]} />

            <FooterCol title="The Maison" links={[
              { label: "About Us", to: "/about" },
              { label: "Maison Assurance", to: "/assurance" },
              { label: "Diamond Guide", to: "/education" },
              { label: "Bespoke Commission", to: "/bespoke" },
              { label: "Occasions", to: "/occasions" },
            ]} />

            <FooterCol title="Services" links={[
              { label: "Custom Order", to: "/custom-order" },
              { label: "Contact the Atelier", to: "/contact" },
               { label: "Ring Size Guide", to: "/ring-size-guide" },
               { label: "Book Consultation", to: "/contact" },
            ]} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 pb-0 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] md:text-[13px] tracking-[0.25em] md:tracking-[0.35em] uppercase text-ivory/80">
            © {new Date().getFullYear()} Oriva Jewels
          </p>
          <p className="text-[11px] md:text-[13px] tracking-[0.25em] md:tracking-[0.35em] uppercase text-ivory/80">
            GIA · IGI Certified · Worldwide
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-ivory/40">
            designed & maintained by{" "}
            <a 
              href="https://osmdigital.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold transition"
            >
              OSM DIGITAL
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center border border-white/10 text-ivory/85 hover:border-gold hover:text-gold hover:bg-gold/[0.03] transition"
    >
      {children}
    </a>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="text-[14px] tracking-[0.42em] uppercase text-gold">{title}</p>
      <ul className="mt-7 space-y-3.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-ivory/60 hover:text-ivory transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}