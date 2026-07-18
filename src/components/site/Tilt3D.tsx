import { useRef, type ReactNode } from "react";

/**
 * Subtle interactive 3D tilt for product imagery.
 * Follows the pointer to rotate the child on X/Y with a specular sheen overlay.
 */
export function Tilt3D({
  children,
  className = "",
  max = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    inner.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,245,220,0.28), transparent 55%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const onLeave = () => {
    if (innerRef.current)
      innerRef.current.style.transform =
        "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 mix-blend-screen"
          />
        )}
      </div>
    </div>
  );
}

export default Tilt3D;
