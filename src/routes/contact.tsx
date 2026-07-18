import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Calendar, Globe2 } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_DISPLAY } from "@/lib/products";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Oriva Jewels, Hong Kong" },
      { name: "description", content: "Book a private consultation with the Oriva Jewels atelier. WhatsApp, email or in-person appointments in Hong Kong." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="bg-ink pt-40 md:pt-48">
      <section className="mx-auto max-w-[1500px] px-6 pb-16 md:px-16 md:pb-24">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <p className="eyebrow">Correspondence</p>
          </div>
          <h1 className="mt-8 font-serif text-6xl md:text-[8.5rem] leading-[0.92] tracking-[-0.02em] text-ivory max-w-5xl">
            A private <em className="text-gold-gradient">conversation</em>,
            at your convenience.
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-[1.8] text-ivory/65">
            Our client advisors are available in Hong Kong, or virtually — worldwide.
            Every enquiry receives a personal reply within one business day.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 md:px-16 grid gap-16 md:grid-cols-12 md:gap-20">
        <div className="md:col-span-5 space-y-8">
          <Reveal>
            <InfoRow n="01" icon={MapPin} title="Hong Kong Atelier" body={"By appointment only\nCentral, Hong Kong SAR"} />
          </Reveal>
          <Reveal delay={80}>
            <InfoRow n="02" icon={MessageCircle} title="WhatsApp" body={WHATSAPP_DISPLAY} href={buildWhatsAppLink("Hello Oriva Jewels")} />
          </Reveal>
          <Reveal delay={140}>
            <InfoRow n="03" icon={Mail} title="Email" body="hello@orivajewels.com" href="mailto:hello@orivajewels.com" />
          </Reveal>
          <Reveal delay={200}>
            <InfoRow n="04" icon={Calendar} title="Consultation Hours" body={"Monday – Saturday\n10:00 – 19:00 HKT"} />
          </Reveal>
          <Reveal delay={260}>
            <InfoRow n="05" icon={Globe2} title="Worldwide Shipping" body="Insured to Hong Kong, Dubai, Singapore, US, EU and beyond." />
          </Reveal>
        </div>

        <Reveal delay={100} className="md:col-span-7">
          <form
            className="border border-white/10 bg-charcoal/50 p-8 md:p-12 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <p className="eyebrow">— Request an Appointment</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-ivory">Tell us about your piece.</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <Input label="First Name" />
              <Input label="Last Name" />
            </div>
            <Input label="Email" type="email" />
            <Input label="Phone / WhatsApp" />
            <div>
              <label className="text-[12px] tracking-[0.42em] uppercase text-gold">
                Interest
              </label>
              <select className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory outline-none focus:border-gold transition [&>option]:bg-obsidian">
                <option>Engagement Ring</option>
                <option>Bridal / Wedding</option>
                <option>Earrings</option>
                <option>Bracelet</option>
                <option>Pendant</option>
                <option>Bespoke / Custom</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] tracking-[0.42em] uppercase text-gold">
                Message
              </label>
              <textarea
                rows={5}
                className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/25 outline-none focus:border-gold resize-none transition"
                placeholder="Tell us about the piece you have in mind…"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold text-obsidian py-5 text-[12px] tracking-[0.4em] uppercase hover:bg-ivory transition mt-4"
            >
              Request Appointment
            </button>
          </form>
        </Reveal>
      </section>

      <section className="mt-28 md:mt-36">
        <div className="relative aspect-[16/9] md:aspect-[16/6] overflow-hidden bg-charcoal border-t border-white/10">
          <iframe
            title="Oriva Jewels Hong Kong"
            src="https://www.openstreetmap.org/export/embed.html?bbox=114.15%2C22.27%2C114.18%2C22.29&amp;layer=mapnik&amp;marker=22.281%2C114.158"
            className="h-full w-full grayscale contrast-125 invert opacity-70"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian/60" />
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  n,
  icon: Icon,
  title,
  body,
  href,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-6 border-t border-white/8 pt-6">
      <div className="shrink-0 flex flex-col items-center gap-3">
        <span className="text-[12px] tracking-[0.42em] text-gold">{n}</span>
        <div className="grid h-11 w-11 place-items-center border border-white/10 text-gold">
          <Icon className="h-4 w-4" strokeWidth={1.3} />
        </div>
      </div>
      <div>
        <p className="text-[12px] tracking-[0.42em] uppercase text-ivory/50">{title}</p>
        <p className="mt-3 font-serif text-2xl text-ivory whitespace-pre-line leading-tight">{body}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block hover:text-gold transition group">
      {content}
    </a>
  ) : (
    content
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-[12px] tracking-[0.42em] uppercase text-gold">{label}</label>
      <input
        type={type}
        className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/25 outline-none focus:border-gold transition"
      />
    </div>
  );
}
