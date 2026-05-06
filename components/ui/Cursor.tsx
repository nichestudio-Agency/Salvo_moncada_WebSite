"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Tutto gestito via DOM diretto — zero lag, zero re-render React
    let hovering = false;

    const setVisual = () => {
      if (hovering) {
        el.style.width = "22px";
        el.style.height = "22px";
        el.style.background = "#C85035";
        el.style.border = "2px solid #C85035";
      } else {
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.background = "transparent";
        el.style.border = "1.5px solid rgba(200, 80, 53, 0.75)";
      }
    };

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };

    const onEnter = () => { hovering = true; setVisual(); };
    const onLeave = () => { hovering = false; setVisual(); };
    const onHide  = () => { el.style.opacity = "0"; };
    const onShow  = () => { el.style.opacity = "1"; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);

    const interactables = document.querySelectorAll("a, button, [role='button']");
    interactables.forEach((node) => {
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      interactables.forEach((node) => {
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 10000,
        left: -100,
        top: -100,
        opacity: 0,
        width: 10,
        height: 10,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: "transparent",
        border: "1.5px solid rgba(200, 80, 53, 0.75)",
        transition:
          "width 0.18s ease, height 0.18s ease, background 0.18s ease, border 0.18s ease, opacity 0.25s ease",
        willChange: "left, top",
      }}
    />
  );
}
