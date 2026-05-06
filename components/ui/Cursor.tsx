"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    document.addEventListener("mousemove", onMove);

    const interactables = document.querySelectorAll("a, button, [role='button']");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);

      if (dot) {
        dot.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      }
      if (ringEl) {
        ringEl.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Punto centrale */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#C4783C",
          willChange: "transform",
        }}
      />
      {/* Anello esterno con ritardo */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none transition-all duration-200"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "rgba(196,120,58,0.8)" : "rgba(196,120,58,0.35)"}`,
          boxShadow: isHovering
            ? "0 0 20px 4px rgba(196,120,58,0.25)"
            : "none",
          transform: isHovering ? "scale(1.4)" : "scale(1)",
          willChange: "transform",
        }}
      />
    </>
  );
}
