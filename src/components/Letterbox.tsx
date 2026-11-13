"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRevealing } from "@/lib/sceneReady";

// Cinematic intro: two black bars frame the scene, then slide away as the preloader leaves. Skipped under reduced motion.
const BAR = "pointer-events-none absolute inset-x-0 z-20 h-[11dvh] bg-black transition-transform duration-[1400ms] ease-out";

export default function Letterbox() {
  const open = useRevealing();
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <>
      <div aria-hidden className={`${BAR} top-0 ${open ? "-translate-y-full" : ""}`} />
      <div aria-hidden className={`${BAR} bottom-0 ${open ? "translate-y-full" : ""}`} />
    </>
  );
}
