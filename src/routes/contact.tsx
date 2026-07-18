import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Calendar, Globe2 } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_DISPLAY } from "@/lib/products";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Oriva Jewels, Hong Kong" },
      { name: "description", content: "Book a consultation with the Oriva Jewels atelier. WhatsApp, email or in-person appointments in Hong Kong." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-28 md:pt-32">
      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10 md:pb-24">
        <Reveal>
          <p className="eyebrow">Get in Touch</p>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[1] max-w-3xl">
            A private conversation, at your convenience.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] text-muted-foreground">
            Our client advisors are available in Hong Kong, or virtually — worldwide.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-12 md:grid-cols-2">
        {/* Left: contact info */}
        <div className="space-y-8">
          <Reveal>
            <InfoRow icon={MapPin} title="Hong Kong Atelier" body={"By appointment only\nCentral, Hong Kong SAR"} />
          </Reveal>
          <Reveal delay={80}>
            <InfoRow icon={MessageCircle} title="WhatsApp" body={WHATSAPP_DISPLAY} href={buildWhatsAppLink("Hello Oriva Jewels")} />
          </Reveal>
          <Reveal delay={140}>
            <InfoRow icon={Mail} title="Email" body="hello@orivajewels.com" href="mailto:hello@orivajewels.com" />
          </Reveal>
          <Reveal delay={200}>
            <InfoRow icon={Calendar} title="Consultation Hours" body={"Monday – Saturday\n10:00 – 19:00 HKT"} />
          </Reveal>
          <Reveal delay={260}>
            <InfoRow icon={Globe2} title="Worldwide Shipping" body="Fully insured to Hong Kong, Dubai, Singapore, US, EU and beyond." />
          </Reveal>
        </div>

        {/* Right: form */}
        <Reveal delay={100}>
          <form
            className="border border-border bg-card p-8 md:p-10 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <p className="eyebrow">Request an Appointment</p>
            <h2 className="font-serif text-3xl">Tell us about your piece.</h2>

            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" />
              <Input label="Last Name" />
            </div>
            <Input label="Email" type="email" />
            <Input label="Phone / WhatsApp" />
            <div>
              <label className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                Interest
              </label>
              <select className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground">
                <option>Engagement Ring</option>
                <option>Bridal / Wedding</option>
                <option>Earrings</option>
                <option>Bracelet</option>
                <option>Pendant</option>
                <option>Bespoke / Custom</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                Message
              </label>
              <textarea
                rows={4}
                className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-ink text-ivory py-4 text-[11px] tracking-[0.32em] uppercase hover:bg-emerald-deep transition"
            >
              Request Appointment
            </button>
          </form>
        </Reveal>
      </section>

      {/* Map */}
      <section className="mt-24 md:mt-32">
        <div className="relative aspect-[16/9] md:aspect-[16/6] overflow-hidden bg-secondary">
          <iframe
            title="Oriva Jewels Hong Kong"
            src="https://www.openstreetmap.org/export/embed.html?bbox=114.15%2C22.27%2C114.18%2C22.29&amp;layer=mapnik&amp;marker=22.281%2C114.158"
            className="h-full w-full grayscale contrast-125"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-5">
      <div className="shrink-0 grid h-11 w-11 place-items-center border border-border text-champagne">
        <Icon className="h-4 w-4" strokeWidth={1.4} />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground">{title}</p>
        <p className="mt-2 text-[15px] whitespace-pre-line">{body}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block hover:text-champagne transition">
      {content}
    </a>
  ) : (
    content
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground">{label}</label>
      <input
        type={type}
        className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground"
      />
    </div>
  );
}
