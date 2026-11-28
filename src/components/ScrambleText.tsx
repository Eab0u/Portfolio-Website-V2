"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRevealing } from "@/lib/sceneReady";

const GLYPHS = "ABCDEFGHJKLMNPRSTUVWXZ";
const START_MS = 700; // matches the title card fade-in delay
const RESOLVE_MS = 1100;

// Hero title: letters flicker through random glyphs and settle left to right once the title card shows.
// Screen readers get the real text through aria-label; reduced motion and first paint show it as is.
export default function ScrambleText({ text }: { text: string }) {
  const revealing = useRevealing();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!revealing || reduced) return;
    const t0 = performance.now() + START_MS;
    const id = window.setInterval(() => {
      const p = (performance.now() - t0) / RESOLVE_MS;
      if (p >= 1) {
        setShown(text);
        window.clearInterval(id);
        return;
      }
      setShown(
        [...text].map((c, i) => (c === " " || p > (i + 1) / text.length ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""),
      );
    }, 50);
    return () => window.clearInterval(id);
  }, [revealing, reduced, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </>
  );
}
