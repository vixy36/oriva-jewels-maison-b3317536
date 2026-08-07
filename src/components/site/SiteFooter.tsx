import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/products";

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
              quiet intention, finished by hand. Concierge available worldwide.
            </p>
            <div className="mt-10 flex gap-2">
              <SocialLink href={buildWhatsAppLink("Hello Oriva Jewels")} label="WhatsApp">
                <MessageCircle className="h-4 w-4" strokeWidth={1.3} />
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
              { label: "Our Story", to: "/about" },
              { label: "Maison Assurance", to: "/assurance" },
              { label: "Diamond Guide", to: "/education" },
              { label: "Bespoke Commission", to: "/bespoke" },
              { label: "Occasions", to: "/occasions" },
            ]} />

            <FooterCol title="Services" links={[
              { label: "Custom Order", to: "/custom-order" },
              { label: "Contact Concierge", to: "/contact" },
               { label: "Ring Size Guide", to: "/ring-size-guide" },
               { label: "orivajewelshk@gmail.com", to: "/contact" },
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
