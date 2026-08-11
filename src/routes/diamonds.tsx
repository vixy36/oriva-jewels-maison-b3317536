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
      `*Colour:* ${selectedColor}`,
      `*Clarity:* ${selectedClarity}`,
      `*Cut:* ${selectedCut}`,
      `*Carat Range:* ${minCarat} - ${maxCarat} ct`,
      `*Price Range:* $${minPrice} - $${maxPrice}`,
      "",
      "I'm interested in finding this specific diamond. Please share availability and live pricing.",
    ].join("\n");
  }, [diamondType, selectedShape, selectedColor, selectedClarity, selectedCut, minCarat, maxCarat, minPrice, maxPrice]);

  return (
    <div className="bg-[#f5f4f2] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <GsapReveal className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#071c37] mb-2 font-medium">Diamond</h1>
          <p className="text-[13px] tracking-widest text-[#071c37]/60 uppercase">0 Items</p>
        </GsapReveal>

        <div className="flex justify-center gap-16 mb-16">
          {[
            { label: "Certified Lab Grown", img: shapeIcon("round") },
            { label: "Non-Certified Lab Grown", img: shapeIcon("emerald") }
          ].map((type) => (
            <button
              key={type.label}
              onClick={() => setDiamondType(type.label as any)}
              className="group flex flex-col items-center gap-4 focus:outline-none"
            >
              <div className={`relative w-20 h-20 rounded-full border-2 transition-all p-1 ${diamondType === type.label ? 'border-[#071c37]' : 'border-transparent group-hover:border-[#071c37]/20'}`}>
                <img src={type.img} alt={type.label} className="w-full h-full object-contain filter grayscale brightness-125" />
              </div>
              <span className={`text-[12px] tracking-widest uppercase font-medium transition-colors ${diamondType === type.label ? 'text-[#071c37]' : 'text-[#071c37]/60'}`}>
                {type.label}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
          {/* SHAPE SELECTOR */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-12">
            {shapes.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedShape(s.name)}
                className={`group flex flex-col items-center gap-3 p-3 border transition-all ${selectedShape === s.name ? 'border-[#071c37] bg-[#071c37]/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={s.icon} alt={s.name} className="w-10 h-10 object-contain" />
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#071c37]/80">{s.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 border-t border-gray-100 pt-10">
            {/* COLOR */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#071c37]/60 mb-4">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`h-9 min-w-[36px] px-2 border text-[11px] font-bold transition-all ${selectedColor === c ? 'bg-[#071c37] text-white border-[#071c37]' : 'border-gray-200 text-[#071c37]/70 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CLARITY */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#071c37]/60 mb-4">Clarity</label>
              <div className="flex flex-wrap gap-2">
                {clarityOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedClarity(c)}
                    className={`h-9 min-w-[40px] px-2 border text-[11px] font-bold transition-all ${selectedClarity === c ? 'bg-[#071c37] text-white border-[#071c37]' : 'border-gray-200 text-[#071c37]/70 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CUT */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#071c37]/60 mb-4">Cut</label>
              <div className="flex flex-wrap gap-2">
                {cutOptions.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCut(c)}
                    className={`h-9 px-3 border text-[11px] font-bold transition-all ${selectedCut === c ? 'bg-[#071c37] text-white border-[#071c37]' : 'border-gray-200 text-[#071c37]/70 hover:border-gray-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* CARAT */}
            <div className="md:col-span-1">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#071c37]/60 mb-4">Carat Weight</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={minCarat}
                  onChange={(e) => setMinCarat(Number(e.target.value))}
                  className="w-full h-10 border border-gray-200 px-3 text-center text-[13px] text-[#071c37] focus:outline-none focus:border-[#071c37]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  step="0.01"
                  value={maxCarat}
                  onChange={(e) => setMaxCarat(Number(e.target.value))}
                  className="w-full h-10 border border-gray-200 px-3 text-center text-[13px] text-[#071c37] focus:outline-none focus:border-[#071c37]"
                />
              </div>
              <div className="mt-8 px-2">
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={maxCarat}
                  onChange={(e) => setMaxCarat(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#071c37]/10 rounded-full appearance-none cursor-pointer accent-[#071c37]"
                />
              </div>
            </div>

            {/* PRICE */}
            <div className="md:col-span-1">
              <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#071c37]/60 mb-4">Price Range</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full h-10 border border-gray-200 px-3 text-center text-[13px] text-[#071c37] focus:outline-none focus:border-[#071c37]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-10 border border-gray-200 px-3 text-center text-[13px] text-[#071c37] focus:outline-none focus:border-[#071c37]"
                />
              </div>
              <div className="mt-8 px-2">
                <input 
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#071c37]/10 rounded-full appearance-none cursor-pointer accent-[#071c37]"
                />
              </div>
            </div>

            {/* SINGLES/PAIRS TOGGLE */}
            <div className="flex items-end justify-center md:justify-end pb-2">
              <button 
                type="button"
                onClick={() => setIsPairs(!isPairs)}
                className="flex items-center gap-4 border border-gray-300 rounded-full px-4 py-2 hover:border-[#071c37] transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                  <img src={shapeIcon("round")} alt="Single" className="w-6 h-6 object-contain" />
                </div>
                
                <div className={`w-12 h-6 rounded-full relative border transition-colors duration-300 ${isPairs ? 'bg-[#071c37] border-[#071c37]' : 'bg-gray-100 border-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isPairs ? 'left-7' : 'left-1'}`} />
                </div>
                
                <span className="text-[11px] font-bold text-[#071c37] tracking-wider uppercase">{isPairs ? 'Pairs' : 'Singles'}</span>
                
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center relative z-10 overflow-hidden">
                    <img src={shapeIcon("round")} alt="Pair 1" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                    <img src={shapeIcon("round")} alt="Pair 2" className="w-6 h-6 object-contain" />
                  </div>
                </div>
              </button>
            </div>
          </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a
              href={buildWhatsAppLink(message)}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-center gap-3 bg-[#071c37] text-white px-12 py-5 text-[12px] tracking-[0.4em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300 shadow-xl shadow-[#071c37]/10"
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
