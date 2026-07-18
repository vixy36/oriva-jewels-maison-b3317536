import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap } from "@/lib/gsap";

/**
 * GsapReveal
 * Wrap a section. Direct descendants (or any nested elements) with
 * `data-gsap` attribute animate in sequence:
 *   heading → subheading → image → buttons (order = DOM order)
 *
 * Animation:
 *   opacity 0 → 1, y +70 → 0
 *   duration 1s, ease power3.out, stagger 0.15
 *   trigger when section reaches 80% of viewport, once (no reverse)
 */
export function GsapReveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap, ScrollTrigger } = ensureGsap();

    const targets = el.querySelectorAll<HTMLElement>("[data-gsap]");
    if (!targets.length) return;

    // Respect reduced motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "willChange" });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 70, willChange: "transform, opacity" });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
      },
      onComplete: () => {
        gsap.set(targets, { clearProps: "willChange" });
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const Component = Tag as any;
  return (
    <Component ref={ref as any} className={className}>
      {children}
    </Component>
  );
}
