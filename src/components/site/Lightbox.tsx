import { useEffect, useState, type MouseEvent } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, images.length, onClose, onIndexChange]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-xl animate-fade-in flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 grid h-12 w-12 place-items-center bg-obsidian/90 border border-gold/50 text-gold hover:bg-gold hover:text-obsidian transition z-10"
      >
        <X className="h-5 w-5" strokeWidth={1.8} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index - 1 + images.length) % images.length);
        }}
        aria-label="Previous"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center bg-obsidian/90 border border-gold/50 text-gold hover:bg-gold hover:text-obsidian transition z-10"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.8} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index + 1) % images.length);
        }}
        aria-label="Next"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center bg-obsidian/90 border border-gold/50 text-gold hover:bg-gold hover:text-obsidian transition z-10"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={1.8} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMove}
        onMouseLeave={() => setOrigin({ x: 50, y: 50 })}
        className={`relative w-[min(92vw,1100px)] h-[min(88vh,1100px)] overflow-hidden ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
      >
        <img
          src={images[index]}
          alt=""
          onClick={() => setZoomed((z) => !z)}
          className="h-full w-full object-contain transition-transform duration-500 ease-out select-none"
          style={{
            transform: zoomed ? "scale(2.4)" : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
          draggable={false}
        />
        <button
          onClick={() => setZoomed((z) => !z)}
          aria-label="Toggle zoom"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-gold border border-gold px-4 py-2.5 text-[13px] font-semibold tracking-[0.3em] uppercase text-obsidian hover:bg-ivory hover:border-ivory transition"
        >
          <ZoomIn className="h-4 w-4" strokeWidth={2} />
          {zoomed ? "Zoom out" : "Zoom in"}
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-semibold tracking-[0.4em] uppercase text-gold bg-obsidian/80 px-4 py-2 border border-gold/40">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </div>
    </div>
  );
}
