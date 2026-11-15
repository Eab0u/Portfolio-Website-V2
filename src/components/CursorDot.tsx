"use client";

import { useEffect, useRef } from "react";

// A small mint dot that eases after the mouse on desktop. Not rendered for touch, and it snaps to the pointer under reduced motion.
export default function CursorDot() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const dot = ref.current;
    if (!dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const snap = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      pos.x += (target.x - pos.x) * (snap ? 1 : 0.18);
      pos.y += (target.y - pos.y) * (snap ? 1 : 0.18);
      dot.style.transform = `translate3d(${pos.x - 6}px, ${pos.y - 6}px, 0)`;
      raf = Math.hypot(target.x - pos.x, target.y - pos.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (dot.style.opacity !== "1") {
        pos.x = e.clientX;
        pos.y = e.clientY;
        dot.style.opacity = "1";
      }
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => (dot.style.opacity = "0");
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <span ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 h-3 w-3 rounded-full border-[1.5px] border-[var(--fg)] bg-[var(--accent)] opacity-0 shadow-[0_0_0_2px_#1a1f3a99,0_0_8px_#7cf0c8,0_0_18px_#7cf0c888] transition-opacity duration-300 motion-reduce:transition-none" />;
}
