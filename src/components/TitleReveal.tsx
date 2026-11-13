"use client";

import type { ReactNode } from "react";
import { useRevealing } from "@/lib/sceneReady";

// Title card: the name and tagline fade up shortly after the preloader starts leaving (the Preloader always
// finishes, with a timeout fallback). The motion-reduce variants are CSS, so reduced-motion visitors see it at once from first paint.
export default function TitleReveal({ children }: { children: ReactNode }) {
  const shown = useRevealing();
  return (
    <div
      className={`transition-[opacity,transform] delay-700 duration-[1200ms] ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
