"use client";

import { useState } from "react";
import { useProgress } from "@react-three/drei";

// Full-screen loading overlay: percent counter, then a Start button that fades the overlay out.
export default function Preloader() {
  const { progress, total } = useProgress();
  const [started, setStarted] = useState(false);
  const [gone, setGone] = useState(false);
  const percent = total === 0 ? 100 : Math.round(progress);
  if (gone) return null;
  return (
    <div
      role="status"
      onTransitionEnd={(e) => {
        if (started && e.target === e.currentTarget && e.propertyName === "opacity") setGone(true);
      }}
      className={`absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg)] transition-opacity duration-700 ${
        started ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {percent < 100 ? (
        <p className="font-mono text-5xl tabular-nums text-[var(--accent)]">{percent}%</p>
      ) : (
        <button
          type="button"
          autoFocus
          onClick={() => setStarted(true)}
          className="rounded-full border border-[var(--accent)] px-10 py-3 text-lg tracking-widest text-[var(--accent)] outline-offset-4 transition hover:bg-[var(--accent)] hover:text-[var(--bg)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          Start
        </button>
      )}
    </div>
  );
}
