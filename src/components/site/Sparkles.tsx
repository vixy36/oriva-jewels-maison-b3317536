import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";

/**
 * Sparkles — GSAP-driven luxury sparkle overlay for diamond imagery.
 *
 * - Absolutely positioned; place inside a `relative` container (e.g. a product image).
 * - Each sparkle: opacity 0→1→0, scale 0.2→1.3→0.2, random 360° rotation, 0.6s.
 * - Fires at random 2–5s intervals; never repeats a previously used position.
 * - Very subtle — small (2–4px), luxury white/gold, blurred glow.
 */
export function Sparkles({
  count = 5,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const { gsap } = ensureGsap();
    const nodes = Array.from(layer.querySelectorAll<HTMLElement>("[data-sparkle]"));
    if (!nodes.length) return;

    const used: Array<{ x: number; y: number }> = [];
    const minDist = 12; // percent — avoid repeating the same spot

    const pickPosition = () => {
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 90 + 5;
        const y = Math.random() * 90 + 5;
        if (used.every((p) => Math.hypot(p.x - x, p.y - y) > minDist)) {
          used.push({ x, y });
          if (used.length > 40) used.shift();
          return { x, y };
        }
      }
      const x = Math.random() * 90 + 5;
      const y = Math.random() * 90 + 5;
      used.push({ x, y });
      return { x, y };
    };

    const timers: number[] = [];
    const tweens: gsap.core.Tween[] = [];

    const scheduleNext = (node: HTMLElement) => {
      const delay = (Math.random() * 3 + 2) * 1000; // 2–5s
      const id = window.setTimeout(() => fire(node), delay);
      timers.push(id);
    };

    const fire = (node: HTMLElement) => {
      const { x, y } = pickPosition();
      gsap.set(node, {
        left: `${x}%`,
        top: `${y}%`,
        rotation: Math.random() * 360,
        scale: 0.2,
        opacity: 0,
      });
      const t = gsap.to(node, {
        keyframes: [
          { opacity: 1, scale: 1.3, duration: 0.3, ease: "power2.out" },
          { opacity: 0, scale: 0.2, duration: 0.3, ease: "power2.in" },
        ],
        onComplete: () => scheduleNext(node),
      });
      tweens.push(t);
    };

    nodes.forEach((node) => {
      const id = window.setTimeout(() => fire(node), Math.random() * 3000);
      timers.push(id);
    });

    return () => {
      timers.forEach(clearTimeout);
      tweens.forEach((t) => t.kill());
    };
  }, [count]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          data-sparkle
          className="absolute h-[3px] w-[3px] rounded-full bg-white opacity-0"
          style={{
            boxShadow:
              "0 0 6px 1px rgba(255,255,255,0.9), 0 0 14px 3px rgba(214,169,74,0.55)",
          }}
        />
      ))}
    </div>
  );
}
