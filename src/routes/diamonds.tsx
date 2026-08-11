import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { GsapReveal } from "@/components/site/GsapReveal";
import { buildWhatsAppLink } from "@/lib/products";
import { DIAMOND_SHAPES, shapeIcon } from "@/lib/diamond-shapes";

export const Route = createFileRoute("/diamonds")({
  head: () => ({
    meta: [
      { title: "Diamond Search - Certified Natural & Lab Grown | Oriva Jewels" },
      {
        name: "description",
        content: "Search for certified natural and lab grown diamonds. Select your shape, clarity, colour, and carat to begin your bespoke enquiry.",
      },
      { property: "og:title", content: "Diamond Search | Oriva Jewels" },
      { property: "og:description", content: "Certified diamonds tailored to your exact specification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiamondsSearchPage,
});

const shapes = DIAMOND_SHAPES;


const colorOptions = ["D", "E", "F", "G", "H", "I"];
const clarityOptions = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const cutOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

function DiamondsSearchPage() {
  const [diamondType, setDiamondType] = useState<"Certified Lab Grown" | "Non-Certified Lab Grown">("Certified Lab Grown");
  const [selectedShape, setSelectedShape] = useState("Round");
  const [selectedColor, setSelectedColor] = useState("D");
  const [selectedClarity, setSelectedClarity] = useState("IF");
  const [selectedCut, setSelectedCut] = useState("Excellent");
  const [minCarat, setMinCarat] = useState(0.23);
  const [maxCarat, setMaxCarat] = useState(6.00);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9500);
  const [isPairs, setIsPairs] = useState(false);

  const message = useMemo(() => {
    return [
      "*Diamond Enquiry · Oriva Jewels*",
      "",
      `*Type:* ${diamondType}`,
      `*Shape:* ${selectedShape}`,
      `*Configuration:* ${isPairs ? 'Pairs' : 'Single'}`,
      `*Colour:* ${selectedColor}`,
      `*Clarity:* ${selectedClarity}`,
      `*Cut:* ${selectedCut}`,
      `*Carat Range:* ${minCarat} - ${maxCarat} ct`,
      `*Price Range:* $${minPrice} - $${maxPrice}`,
      "",
      "I'm interested in finding this specific diamond. Please share availability and live pricing.",
    ].join("\n");
  }, [diamondType, selectedShape, isPairs, selectedColor, selectedClarity, selectedCut, minCarat, maxCarat, minPrice, maxPrice]);

  return (
    <div className="bg-[#f5f4f2] min-h-screen pt-24 md:pt-32 pb-16 md:pb-20">
      <div className="mx-auto max-w-[1300px] px-4 md:px-6">
        <GsapReveal className="text-center mb-10 md:mb-16">
          <h1 className="font-serif text-4xl md:text-6xl text-[#071c37] mb-3 md:mb-4 font-medium">Diamonds</h1>
          <p className="text-[12px] md:text-[14px] tracking-[0.2em] md:tracking-[0.3em] text-[#071c37]/60 uppercase">Curated Brilliance</p>
        </GsapReveal>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 mb-16 md:mb-20">
          {[
            { label: "Certified Lab Grown", img: shapeIcon("round") },
            { label: "Non-Certified Lab Grown", img: shapeIcon("emerald") }
          ].map((type) => (
            <button
              key={type.label}
              onClick={() => setDiamondType(type.label as any)}
              className="group flex flex-col items-center gap-4 md:gap-6 focus:outline-none w-full md:w-auto"
            >
              <div className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 transition-all p-2 bg-white/50 ${diamondType === type.label ? 'border-[#071c37]' : 'border-transparent group-hover:border-[#071c37]/20'}`}>
                <img src={type.img} alt={type.label} className="w-full h-full object-contain filter grayscale brightness-125" />
              </div>
              <span className={`text-[12px] md:text-[14px] tracking-[0.2em] uppercase font-bold transition-colors text-center ${diamondType === type.label ? 'text-[#071c37]' : 'text-[#071c37]/60'}`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-12 shadow-sm">
          {/* SHAPE SELECTOR */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-4 mb-12 md:mb-16">
            {shapes.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedShape(s.name)}
                className={`group flex flex-col items-center gap-2 md:gap-4 p-3 md:p-5 border transition-all ${selectedShape === s.name ? 'border-[#071c37] bg-[#071c37]/5 ring-1 ring-[#071c37]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={s.icon} alt={s.name} className="w-10 h-10 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-110" />
                <span className="text-[9px] md:text-[11px] tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold text-[#071c37] text-center">{s.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10 md:gap-y-12 border-t border-gray-100 pt-12 md:pt-16">
            {/* COLOR */}
            <div>
              <label className="block text-[12px] tracking-[0.2em] uppercase font-bold text-[#071c37] mb-5 md:mb-6">Color</label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {colorOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`h-10 md:h-12 min-w-[40px] md:min-w-[48px] px-2 md:px-3 border text-[12px] md:text-[13px] font-bold transition-all ${selectedColor === c ? 'bg-[#071c37] text-white border-[#071c37]' : 'border-gray-200 text-[#071c37]/70 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CLARITY */}
            <div>
              <label className="block text-[12px] tracking-[0.2em] uppercase font-bold text-[#071c37] mb-5 md:mb-6">Clarity</label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {clarityOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedClarity(c)}
                    className={`h-10 md:h-12 min-w-[46px] md:min-w-[54px] px-2 md:px-3 border text-[12px] md:text-[13px] font-bold transition-all ${selectedClarity === c ? 'bg-[#071c37] text-white border-[#071c37]' : 'border-gray-200 text-[#071c37]/70 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CUT */}
            <div>
              <label className="block text-[12px] tracking-[0.2em] uppercase font-bold text-[#071c37] mb-5 md:mb-6">Cut</label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {cutOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCut(c)}
                    className={`h-10 md:h-12 px-3 md:px-4 border text-[12px] md:text-[13px] font-bold transition-all ${selectedCut === c ? 'bg-[#071c37] text-white border-[#071c37]' : 'border-gray-200 text-[#071c37]/70 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CARAT */}
            <div className="md:col-span-1">
              <label className="block text-[12px] tracking-[0.2em] uppercase font-bold text-[#071c37] mb-6">Carat Weight</label>
              <div className="flex items-center gap-4">
                <div className="relative w-full">
                  <input
                    type="number"
                    step="0.01"
                    value={minCarat}
                    onChange={(e) => setMinCarat(Number(e.target.value))}
                    className="w-full h-12 border border-gray-200 px-3 text-center text-[15px] font-medium text-[#071c37] focus:outline-none focus:border-[#071c37]"
                  />
                  <span className="absolute -top-6 left-0 text-[9px] uppercase tracking-tighter text-gray-400">Min Carat</span>
                </div>
                <span className="text-gray-400 font-serif text-2xl">—</span>
                <div className="relative w-full">
                  <input
                    type="number"
                    step="0.01"
                    value={maxCarat}
                    onChange={(e) => setMaxCarat(Number(e.target.value))}
                    className="w-full h-12 border border-gray-200 px-3 text-center text-[15px] font-medium text-[#071c37] focus:outline-none focus:border-[#071c37]"
                  />
                  <span className="absolute -top-6 left-0 text-[9px] uppercase tracking-tighter text-gray-400">Max Carat</span>
                </div>
              </div>
              <div className="mt-10 px-2 relative h-6">
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="0.01"
                  value={minCarat}
                  onChange={(e) => setMinCarat(Math.min(Number(e.target.value), maxCarat))}
                  className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-[#071c37] z-20 pointer-events-auto"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="0.01"
                  value={maxCarat}
                  onChange={(e) => setMaxCarat(Math.max(Number(e.target.value), minCarat))}
                  className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-[#071c37] z-10 pointer-events-auto"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#071c37]/10 rounded-full" />
              </div>
            </div>

            {/* PRICE */}
            <div className="md:col-span-1">
              <label className="block text-[12px] tracking-[0.2em] uppercase font-bold text-[#071c37] mb-6">Price Range ($$)</label>
              <div className="flex items-center gap-4">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">$</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full h-12 border border-gray-200 pl-7 pr-3 text-center text-[15px] font-medium text-[#071c37] focus:outline-none focus:border-[#071c37]"
                  />
                  <span className="absolute -top-6 left-0 text-[9px] uppercase tracking-tighter text-gray-400">Min Price</span>
                </div>
                <span className="text-gray-400 font-serif text-2xl">—</span>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-12 border border-gray-200 pl-7 pr-3 text-center text-[15px] font-medium text-[#071c37] focus:outline-none focus:border-[#071c37]"
                  />
                  <span className="absolute -top-6 left-0 text-[9px] uppercase tracking-tighter text-gray-400">Max Price</span>
                </div>
              </div>
              <div className="mt-10 px-2 relative h-6">
                <input 
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                  className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-[#071c37] z-20 pointer-events-auto"
                />
                <input 
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                  className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-[#071c37] z-10 pointer-events-auto"
                />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#071c37]/10 rounded-full" />
              </div>
            </div>

            {/* SINGLES/PAIRS TOGGLE */}
            <div className="flex items-end justify-center md:justify-end pb-2 pt-6 md:pt-0">
              <button 
                type="button"
                onClick={() => setIsPairs(!isPairs)}
                className="flex items-center gap-3 md:gap-6 border border-gray-300 rounded-full px-4 md:px-6 py-2 md:py-3 hover:border-[#071c37] transition-all bg-[#f8f8f8]"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img src={shapeIcon(selectedShape.toLowerCase())} alt="Single" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                </div>
                
                <div className={`w-10 md:w-14 h-5 md:h-7 rounded-full relative border transition-colors duration-300 ${isPairs ? 'bg-[#071c37] border-[#071c37]' : 'bg-gray-200 border-gray-300'}`}>
                  <div className={`absolute top-0.5 md:top-1 w-3.5 h-3.5 md:w-5 md:h-5 bg-white rounded-full shadow-md transition-all duration-300 ${isPairs ? 'left-5.5 md:left-8' : 'left-0.5 md:left-1'}`} />
                </div>
                
                <span className="text-[10px] md:text-[12px] font-bold text-[#071c37] tracking-[0.1em] md:tracking-[0.2em] uppercase">{isPairs ? 'Pairs' : 'Singles'}</span>
                
                <div className="flex -space-x-2 md:-space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center relative z-10 overflow-hidden">
                    <img src={shapeIcon(selectedShape.toLowerCase())} alt="Pair 1" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    <img src={shapeIcon(selectedShape.toLowerCase())} alt="Pair 2" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-12 md:mt-16 flex justify-center">
            <a
              href={buildWhatsAppLink(message)}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full md:w-auto items-center justify-center gap-3 bg-[#071c37] text-white px-8 md:px-12 py-4 md:py-5 text-[11px] md:text-[12px] tracking-[0.2em] md:tracking-[0.4em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 shadow-xl shadow-[#071c37]/10"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <div className="mt-20 text-center">
          <GsapReveal>
            <h2 className="font-serif text-3xl text-[#071c37] mb-6">Experience Brilliance</h2>
            <p className="max-w-2xl mx-auto text-[15px] leading-relaxed text-[#071c37]/70">
              Our diamond search allows you to filter through thousands of certified stones. 
              Once you've selected your ideal parameters, our master gemologists will curate a personal 
              selection for your review.
            </p>
          </GsapReveal>
        </div>
      </div>
    </div>
  );
}
