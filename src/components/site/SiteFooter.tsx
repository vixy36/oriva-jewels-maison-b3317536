import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory/70 mt-24">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-24">
        <div className="grid gap-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-serif text-3xl tracking-[0.28em] text-ivory">ORIVA</p>
            <p className="mt-1 font-serif text-[11px] tracking-[0.5em] text-champagne">JEWELS</p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed">
              A Hong Kong-based fine jewellery house specialising in Natural and Lab Grown Diamond
              jewellery. Crafted for the moments that matter.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href={buildWhatsAppLink("Hello Oriva Jewels")}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center border border-white/15 hover:border-champagne hover:text-champagne transition"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/orivajewels"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center border border-white/15 hover:border-champagne hover:text-champagne transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@orivajewels.com"
                aria-label="Email"
                className="grid h-10 w-10 place-items-center border border-white/15 hover:border-champagne hover:text-champagne transition"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterCol title="Collections" links={[
            { label: "Engagement Rings", to: "/collections/engagement-rings" },
            { label: "Earrings", to: "/collections/earrings" },
            { label: "Bracelets", to: "/collections/bracelets" },
            { label: "Pendants", to: "/collections/pendants" },
            { label: "Bridal", to: "/collections/bridal" },
            { label: "Lab Grown", to: "/collections/lab-grown" },
          ]} />

          <FooterCol title="Customer Care" links={[
            { label: "Shipping Policy", to: "/contact" },
            { label: "Return Policy", to: "/contact" },
            { label: "Diamond Guide", to: "/about" },
            { label: "Jewellery Care", to: "/about" },
            { label: "Privacy Policy", to: "/contact" },
          ]} />

          <FooterCol title="Contact" links={[
            { label: "Hong Kong Atelier", to: "/contact" },
            { label: WHATSAPP_DISPLAY, to: "/contact" },
            { label: "hello@orivajewels.com", to: "/contact" },
            { label: "Book Consultation", to: "/contact" },
          ]} />
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[10px] tracking-[0.3em] uppercase text-ivory/50">
            © {new Date().getFullYear()} Oriva Jewels. Hong Kong.
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-ivory/50">
            Worldwide shipping · Insured delivery
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.35em] uppercase text-champagne">{title}</p>
      <ul className="mt-6 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-ivory/70 hover:text-champagne transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
