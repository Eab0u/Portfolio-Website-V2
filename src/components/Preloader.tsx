"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSceneReady } from "@/lib/sceneReady";
import PreloaderGem from "./PreloaderGem";

// Full-screen loading overlay: faceted gem that fades out on its own once loading reaches 100%. Sound stays off.
export default function Preloader() {
  const { progress, total } = useProgress();
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const percent = Math.round(progress);
  const ready = useSceneReady();
  const loaded = total > 0 ? percent >= 100 : ready;
  const reduced = useReducedMotion();
  const [waited, setWaited] = useState(false);

  // Keep the gem up long enough to be seen: 2.4 s, or 0.8 s when motion is reduced.
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), reduced ? 800 : 2400);
    return () => clearTimeout(t);
  }, [reduced]);

  // Latch completion so the overlay never reappears; finish on the Canvas being ready when no assets load, and time out if neither happens.
  useEffect(() => {
    if (!waited) return;
    const t = setTimeout(() => setDone(true), loaded ? 0 : 4000);
    return () => clearTimeout(t);
  }, [loaded, waited]);

  // Fallback removal in case the opacity transition never fires (reduced motion, hidden tab).
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;
  return (
    <div
      role="status"
      onTransitionEnd={(e) => {
        if (done && e.target === e.currentTarget && e.propertyName === "opacity") setGone(true);
      }}
      className={`absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg)] transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <PreloaderGem leaving={done} />
      <span className="sr-only">Loading</span>
    </div>
  );
}
