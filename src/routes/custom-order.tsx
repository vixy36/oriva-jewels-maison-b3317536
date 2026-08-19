import { shapeIcon } from "@/lib/diamond-shapes";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { GsapReveal } from "@/components/site/GsapReveal";
import { buildWhatsAppLink, WHATSAPP_DISPLAY } from "@/lib/products";

export const Route = createFileRoute("/custom-order")({
  head: ({ parentHead }) => ({
    ...parentHead,
  }),

  component: CustomOrderPage,
});

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  type: string;
  size: string;
  metal: string;
  diamondType: string;
  diamondShape: string;
  diamondClarity: string;
  diamondColour: string;
  caratRange: string;
  metalColor: string;
  referenceLink: string;
  quantity: string;
  targetDate: string;
  budget: string;
  comments: string;
};

const initial: FormState = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  type: "",
  size: "",
  metal: "",
  diamondType: "",
  diamondShape: "",
  diamondClarity: "",
  diamondColour: "",
  caratRange: "",
  metalColor: "",
  referenceLink: "",
  quantity: "1",
  targetDate: "",
  budget: "",
  comments: "",
};

const typeOptions = ["Engagement Ring", "Wedding Band", "Earrings", "Pendant", "Necklace", "Bracelet", "Other"];
const metalOptions = ["9K", "14K", "18K"];
const metalColorOptions = ["White Gold", "Yellow Gold", "Rose Gold", "Two-tone"];
const diamondTypeOptions = ["Natural Diamond", "Lab Grown Diamond", "Advise Me"];
const diamondShapeOptions = [
  "Round",
  "Princess",
  "Oval",
  "Emerald",
  "Pear",
  "Cushion",
  "Marquise",
  "Radiant",
  "Asscher",
  "Heart",
];
const clarityOptions = ["VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const colourOptions = ["D", "E", "F", "G", "H", "I", "J", "K"];
const caratOptions = ["Under 0.50 ct", "0.50 - 1.00 ct", "1.00 - 2.00 ct", "2.00 - 3.00 ct", "3.00 - 5.00 ct", "5.00 ct +"];
const budgetOptions = ["Under USD 2,000", "USD 2,000 - 5,000", "USD 5,000 - 10,000", "USD 10,000 - 25,000", "USD 25,000 +", "Flexible"];

function CustomOrderPage() {
  const [f, setF] = useState<FormState>(initial);
  const [touched, setTouched] = useState(false);
  // Steps are always visible per user request

  const requiredFilled = useMemo(
    () => f.firstName && f.lastName && f.email && f.phone && f.type && f.metal && f.metalColor,
    [f],
  );

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  const buildMessage = () => {
    const lines = [
      "*Custom Order Request · Oriva Jewels*",
      "",
      "*Contact*",
      `Name: ${f.firstName} ${f.lastName}`.trim(),
      f.company ? `Company: ${f.company}` : null,
      `Email: ${f.email}`,
      `Phone: ${f.phone}`,
      "",
      "*Order Details*",
      `Type: ${f.type}`,
      f.size ? `Size: ${f.size}` : null,
      `Metal: ${f.metal} · ${f.metalColor}`,
      f.diamondType ? `Diamond: ${f.diamondType}` : null,
      f.diamondShape ? `Shape: ${f.diamondShape}` : null,
      f.diamondClarity ? `Clarity: ${f.diamondClarity}` : null,
      f.diamondColour ? `Colour: ${f.diamondColour}` : null,
      f.caratRange ? `Carat: ${f.caratRange} ct` : null,
      `Quantity: ${f.quantity || "1"}`,
      f.targetDate ? `Target date: ${f.targetDate}` : null,
      f.budget ? `Budget: ${f.budget}` : null,
      "",
      "*Reference*",
      f.referenceLink ? `Link: ${f.referenceLink}` : null,
      f.comments ? `Notes: ${f.comments}` : null,
      "",
      "_I will share reference photos in this chat._",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!requiredFilled) {
      const first = document.querySelector<HTMLElement>("[data-invalid=true]");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const url = buildWhatsAppLink(buildMessage());
    window.location.href = url;
  };

  return (
    <main className="pt-24 md:pt-28 pb-14 md:pb-20 bg-obsidian text-ivory" data-surface="dark">
      {/* HERO */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-16">
        <GsapReveal className="text-center">
          <p data-gsap className="text-[12px] tracking-[0.5em] uppercase text-gold">- Atelier Commission -</p>
          <h1 data-gsap className="mt-6 font-serif text-3xl md:text-4xl lg:text-7xl leading-[1] text-white">
            Custom <em className="italic text-gold-gradient">order request.</em>
          </h1>
          <p data-gsap className="mt-6 mx-auto max-w-2xl text-[15px] md:text-[16px] leading-[1.8] text-white font-bold">
            From CAD to hand-set finish. Submit a custom order request and our atelier will respond within hours.
          </p>
        </GsapReveal>

        {/* trust strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-ivory/10 py-6">
          {[
            { icon: Sparkles, title: "100% Bespoke", note: "Any design, any stone" },
            { icon: Clock, title: "Swift Reply", note: "Direct from our master atelier" },
            { icon: ShieldCheck, title: "GIA · IGI Certified", note: "Insured worldwide dispatch" },
          ].map((t) => (
            <div key={t.title} className="flex items-center gap-4 px-2">
              <t.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
              <div>
                <p className="text-[13px] tracking-[0.28em] uppercase text-white font-bold">{t.title}</p>
                <p className="text-[13px] text-white/80 mt-1 font-medium">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-[1100px] px-6 md:px-16 mt-16 md:mt-20">
        <form onSubmit={onSubmit} className="grid gap-12">
          {/* Contact */}
          <Fieldset 
            title="Contact information" 
            step="01" 
            isOpen={true} 
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="First name" required invalid={touched && !f.firstName}>
                <input className={inputCls} value={f.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </Field>
              <Field label="Last name" required invalid={touched && !f.lastName}>
                <input className={inputCls} value={f.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </Field>
              <Field label="Company (optional)">
                <input className={inputCls} value={f.company} onChange={(e) => set("company", e.target.value)} />
              </Field>
              <Field label="Email" required invalid={touched && !f.email}>
                <input type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Phone / WhatsApp" required invalid={touched && !f.phone}>
                <input className={inputCls} placeholder="+852 …" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
            </div>
            <button 
              type="button" 
              onClick={() => {}}
              className="mt-8 text-gold text-[12px] tracking-[0.4em] uppercase flex items-center gap-2 hover:text-white transition-colors"
            >
              Next Step <ArrowRight className="h-3 w-3" />
            </button>
          </Fieldset>

          {/* Order details */}
          <Fieldset 
            title="Order details" 
            step="02"
            isOpen={true} 
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Jewellery type" required invalid={touched && !f.type}>
                <Select value={f.type} onChange={(v) => set("type", v)} options={typeOptions} placeholder="Select type" />
              </Field>
              <Field label="Size (if applicable)">
                <input className={inputCls} placeholder="US 6 / 16.5 mm / 18 inch" value={f.size} onChange={(e) => set("size", e.target.value)} />
              </Field>
              <Field label="Metal" required invalid={touched && !f.metal}>
                <Select value={f.metal} onChange={(v) => set("metal", v)} options={metalOptions} placeholder="Select metal" />
              </Field>
              <Field label="Metal colour" required invalid={touched && !f.metalColor}>
                <Select value={f.metalColor} onChange={(v) => set("metalColor", v)} options={metalColorOptions} placeholder="Select colour" />
              </Field>
              <Field label="Diamond type">
                <Select value={f.diamondType} onChange={(v) => set("diamondType", v)} options={diamondTypeOptions} placeholder="Natural or Lab" />
              </Field>
              {f.diamondType === "Lab Grown Diamond" && (
                <div className="md:col-span-2">
                  <p className="block text-[11px] tracking-[0.32em] uppercase mb-4 text-white/70 font-bold">Select Diamond Shape</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {diamondShapeOptions.map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => set("diamondShape", shape)}
                        className={`group relative flex flex-col items-center justify-center border p-4 transition-all duration-300 ${
                          f.diamondShape === shape
                            ? "border-gold bg-gold/10"
                            : "border-white/10 bg-charcoal/40 hover:border-gold/50"
                        }`}
                      >
                        <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-sm bg-white/5 p-2 transition-colors ${f.diamondShape === shape ? "bg-white/10" : "group-hover:bg-white/10"}`}>
                           <img 
                            src={shapeIcon(shape)} 
                            alt={shape}
                            className={`h-full w-full object-contain filter invert opacity-90 transition-opacity ${f.diamondShape === shape ? "opacity-100" : "group-hover:opacity-100"}`}
                          />
                        </div>
                        <span className={`text-[12px] font-bold tracking-[0.15em] uppercase transition-colors ${f.diamondShape === shape ? "text-gold" : "text-ivory/80 group-hover:text-gold"}`}>
                          {shape}
                        </span>
                        {f.diamondShape === shape && (
                          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-gold text-[10px] text-obsidian">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Field label="Diamond clarity">
                <Select value={f.diamondClarity} onChange={(v) => set("diamondClarity", v)} options={clarityOptions} placeholder="Select clarity" />
              </Field>
              <Field label="Diamond colour">
                <Select value={f.diamondColour} onChange={(v) => set("diamondColour", v)} options={colourOptions} placeholder="Select colour" />
              </Field>
              <Field label="Centre stone size (ct)">
                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  className={inputCls}
                  placeholder="e.g. 1.25"
                  value={f.caratRange}
                  onChange={(e) => set("caratRange", e.target.value)}
                />
              </Field>
              <Field label="Quantity">
                <input type="number" min={1} className={inputCls} value={f.quantity} onChange={(e) => set("quantity", e.target.value)} />
              </Field>
              <Field label="Target date">
                <input type="date" className={inputCls} value={f.targetDate} onChange={(e) => set("targetDate", e.target.value)} />
              </Field>
              <Field label="Budget range">
                <Select value={f.budget} onChange={(v) => set("budget", v)} options={budgetOptions} placeholder="Select budget" />
              </Field>
            </div>
            <button 
              type="button" 
              onClick={() => {}}
              className="mt-8 text-gold text-[12px] tracking-[0.4em] uppercase flex items-center gap-2 hover:text-white transition-colors"
            >
              Next Step <ArrowRight className="h-3 w-3" />
            </button>
          </Fieldset>

          {/* Reference */}
          <Fieldset 
            title="Reference & notes" 
            step="03"
            isOpen={true} 
            onToggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Reference weblink">
                <input className={inputCls} placeholder="Pinterest, Instagram, competitor URL…" value={f.referenceLink} onChange={(e) => set("referenceLink", e.target.value)} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Comments">
                  <textarea rows={5} className={`${inputCls} resize-none`} placeholder="Describe the piece, engraving, deadlines, sentimental details…" value={f.comments} onChange={(e) => set("comments", e.target.value)} />
                </Field>
              </div>
              <div className="md:col-span-2 border border-dashed border-ivory/20 bg-charcoal/60 px-5 py-6 text-center">
                <p className="text-[13px] tracking-[0.28em] uppercase text-white font-bold">Reference photos</p>
                <p className="mt-2 text-[13px] text-white/80 font-medium">
                  After you submit, please share sketches or screenshots directly in the WhatsApp chat that opens.
                </p>
              </div>
            </div>
          </Fieldset>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-obsidian/15 pt-8">
            <p className="text-[13px] text-white/80 max-w-md font-medium">
              By submitting, you consent to be contacted on WhatsApp at{" "}
              <span className="text-white font-bold">{WHATSAPP_DISPLAY}</span> or email.
            </p>
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-3 bg-ivory text-obsidian px-10 py-4 text-[12px] tracking-[0.4em] uppercase hover:bg-gold hover:text-obsidian transition-colors"
            >
              Submit request
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-white/40 py-3 text-[15px] text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors font-medium";

function Fieldset({ title, step, children, isOpen, onToggle }: { title: string; step: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) {
  return (
    <GsapReveal>
      <div className="border border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => {}}
          className="flex w-full items-center justify-between bg-charcoal/50 px-6 py-5 text-left"
        >
          <div className="flex items-baseline gap-4">
            <span className="font-serif italic text-[15px] text-gold">Step {step}</span>
            <h2 className="font-serif text-2xl md:text-3xl text-white">{title}</h2>
          </div>
          {/* chevron removed for static view */}
        </button>
        {true && (
          <div className="p-6 md:p-8 bg-charcoal/20">
            {children}
          </div>
        )}
      </div>
    </GsapReveal>
  );
}

function Field({
  label,
  required,
  invalid,
  children,
}: {
  label: string;
  required?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block" data-invalid={invalid ? "true" : undefined}>
      <span className={`block text-[11px] tracking-[0.32em] uppercase mb-2 ${invalid ? "text-red-600" : "text-white/70 font-bold"}`}>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {invalid ? <span className="mt-1 block text-[12px] text-red-600">Required</span> : null}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8 cursor-pointer [&>option]:bg-white [&>option]:text-black`}
      >
        <option value="" disabled className="bg-white text-black">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-white text-black">
            {o}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ivory/50">
        ▾
      </span>
    </div>
  );
}
