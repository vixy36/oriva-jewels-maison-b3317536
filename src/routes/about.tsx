import { createFileRoute, Link } from "@tanstack/react-router";
import atelier from "@/assets/about-atelier.jpg";
import modernLux from "@/assets/insta-6.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta2 from "@/assets/insta-2.jpg";
import bridal from "@/assets/collection-bridal.jpg";
import editorial from "@/assets/editorial-emerald.jpg";
import { Reveal } from "@/components/site/Reveal";
import { ArrowRight, Sparkles, Shield, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Maison - Oriva Jewels" },
      { name: "description", content: "A modern maison of fine jewellery. Discover our heritage, craftsmanship, and commitment to excellence." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-ink overflow-x-hidden">
      {/* Cinematic Hero */}
      <section className="relative h-[90svh] flex items-center justify-center overflow-hidden bg-obsidian text-ivory" data-surface="dark">
        <img src={atelier} alt="Oriva atelier" className="absolute inset-0 h-full w-full object-cover opacity-60 animate-slow-zoom scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian" />
        
        <div className="relative z-10 text-center px-6">
          <Reveal>
            <span className="inline-block text-gold text-[12px] tracking-[0.6em] uppercase mb-8">Established 2024</span>
            <h1 className="font-serif text-7xl md:text-[10rem] leading-[0.85] tracking-tight text-white">
              Oriva <br />
              <em className="text-gold-gradient italic">Jewels</em>
            </h1>
            <p className="mt-12 mx-auto max-w-2xl text-[17px] leading-[1.8] text-white font-medium">
              We are end-to-end manufacturers of Diamonds & Jewellery. 
              A modern maison where heritage meets innovation, crafted for the discerning.
            </p>
          </Reveal>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-px h-12 bg-gold" />
        </div>
      </section>

      {/* Philosophy Section - Split with Image */}
      <section className="py-24 md:py-32 bg-ink">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16 grid gap-20 md:grid-cols-2 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
              <span className="eyebrow text-gold">Our Philosophy</span>
              <h2 className="mt-8 font-serif text-5xl md:text-7xl leading-tight text-white">
                Luxury in its <br />
                <em className="text-gold-gradient italic">purest form.</em>
              </h2>
              <p className="mt-10 text-[17px] leading-[1.9] text-white max-w-lg font-medium">
                We believe fine jewellery should be more than an accessory; it should be an extension of one's identity. 
                Our approach is defined by restraint—nothing is added for show, everything is included for excellence.
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gold/20 pt-12">
                <div>
                  <span className="font-serif text-3xl text-gold italic">01.</span>
                  <p className="mt-4 font-sans text-[13px] tracking-widest uppercase text-gold font-bold">Transparency</p>
                  <p className="mt-2 text-[15px] text-white font-medium leading-relaxed">From mine to finger, we own every step of the journey.</p>
                </div>
                <div>
                  <span className="font-serif text-3xl text-gold italic">02.</span>
                  <p className="mt-4 font-sans text-[13px] tracking-widest uppercase text-gold font-bold">Legacy</p>
                  <p className="mt-2 text-[15px] text-white font-medium leading-relaxed">Designs that transcend trends, meant to be passed down.</p>
                </div>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={200} className="relative">
            <div className="aspect-[4/5] overflow-hidden gold-border p-3">
              <img src={modernLux} alt="Modern Luxury" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-obsidian p-8 text-ivory border border-gold/20 hidden md:block" data-surface="dark">
              <p className="font-serif italic text-2xl text-gold">"Quiet from a distance, extraordinary up close."</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Craftsmanship - Full width immersive */}
      <section className="relative bg-obsidian text-ivory py-24 md:py-40 overflow-hidden" data-surface="dark">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-gold/20 to-transparent" />
        </div>
        
        <div className="relative mx-auto max-w-[1500px] px-6 md:px-16 text-center">
          <Reveal>
            <span className="eyebrow">Craftsmanship</span>
            <h2 className="mt-8 font-serif text-6xl md:text-[8rem] leading-[0.9] text-white">
              The <em className="text-gold-gradient italic drop-shadow-sm">Atelier</em> Spirit
            </h2>
          </Reveal>
          
          <div className="mt-24 grid gap-12 md:grid-cols-3">
            {[
              { 
                icon: Sparkles, 
                title: "Certified Selection", 
                desc: "Every diamond in our collection is hand-selected and certified by GIA or IGI.",
                img: insta5
              },
              { 
                icon: Shield, 
                title: "Master Settings", 
                desc: "Our artisans use traditional techniques combined with cutting-edge technology.",
                img: insta2
              },
              { 
                icon: Heart, 
                title: "Eternal Quality", 
                desc: "Each piece undergoes rigorous quality control to ensure it lasts for generations.",
                img: bridal
              }
            ].map((item, idx) => (
              <Reveal key={item.title} delay={idx * 150} className="group">
                <div className="relative aspect-[3/4] mb-8 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-obsidian/40 group-hover:bg-transparent transition-colors duration-700" />
                </div>
                <div className="flex justify-center mb-6">
                  <item.icon className="w-8 h-8 text-gold" strokeWidth={1} />
                </div>
                <h3 className="font-serif text-3xl mb-4 text-white">{item.title}</h3>
                <p className="text-white text-[15px] max-w-[280px] mx-auto leading-relaxed font-bold">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-24 md:py-32 bg-ink">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <span className="eyebrow text-gold">The Journey</span>
            <h2 className="mt-8 font-serif text-5xl md:text-7xl text-white">From a sketch <br /><em className="text-gold-gradient italic">to her finger.</em></h2>
            <p className="mt-12 text-[18px] leading-[2] text-white font-medium">
              Unlike traditional jewellers, we manage the entire lifecycle of our pieces. 
              By sourcing rough diamonds directly and manufacturing in our own facility, 
              we remove the middleman, ensuring both ethical sourcing and unparalleled value.
            </p>
            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex flex-col items-center">
                <span className="text-5xl font-serif text-gold">100%</span>
                <span className="mt-2 text-[12px] tracking-widest uppercase text-gold font-bold">In-House</span>
              </div>
              <div className="hidden md:block w-px h-16 bg-gold/20" />
              <div className="flex flex-col items-center">
                <span className="text-5xl font-serif text-gold">05+</span>
                <span className="mt-2 text-[12px] tracking-widest uppercase text-gold font-bold">Checkpoints</span>
              </div>
              <div className="hidden md:block w-px h-16 bg-gold/20" />
              <div className="flex flex-col items-center">
                <span className="text-5xl font-serif text-gold">40+</span>
                <span className="mt-2 text-[12px] tracking-widest uppercase text-gold font-bold">Countries</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative h-[80svh] flex items-center justify-center bg-obsidian text-ivory overflow-hidden" data-surface="dark">
        <div className="absolute inset-0 opacity-30 animate-slow-zoom">
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian z-10" />
          <img src={atelier} alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <Reveal className="relative z-20 text-center px-6">
          <h2 className="font-serif text-5xl md:text-8xl leading-none text-white">
            Join the <em className="text-gold-gradient italic drop-shadow-sm">Conversation.</em>
          </h2>
          <p className="mt-8 mx-auto max-w-lg text-white text-[16px] leading-relaxed font-medium drop-shadow-sm">
            Discover the world of Oriva Jewels through a private consultation or by exploring our collection.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/collections/engagement-rings"
              className="bg-gold text-obsidian px-12 py-5 text-[12px] tracking-[0.4em] uppercase hover:bg-ivory transition-all duration-300 w-full sm:w-auto font-bold"
            >
              Explore Collection
            </Link>
            <Link
              to="/contact"
              className="border border-white/40 bg-obsidian/20 backdrop-blur-sm px-12 py-5 text-[12px] tracking-[0.4em] uppercase text-white hover:border-gold hover:text-gold transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-3 font-bold"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
