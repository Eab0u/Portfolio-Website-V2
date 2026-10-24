"use client";

import { useState } from "react";
import { useProgress } from "@react-three/drei";

const BTN =
  "rounded-full border border-[var(--accent)] px-10 py-3 text-lg tracking-widest text-[var(--accent)] outline-offset-4 transition hover:bg-[var(--accent)] hover:text-[var(--bg)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]";

// Full-screen loading overlay: percent counter, then Start, then a sound opt-in (state only, no audio yet) that fades the overlay out.
export default function Preloader() {
  const { progress, total } = useProgress();
  const [started, setStarted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [sound, setSound] = useState<"on" | "off" | null>(null);
  const [gone, setGone] = useState(false);
  const percent = total === 0 ? 100 : Math.round(progress);
  if (gone) return null;
  return (
    <div
      role="status"
      data-sound={sound}
      onTransitionEnd={(e) => {
        if (entered && e.target === e.currentTarget && e.propertyName === "opacity") setGone(true);
      }}
      className={`absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg)] transition-opacity duration-700 ${
        entered ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {percent < 100 ? (
        <p className="font-mono text-5xl tabular-nums text-[var(--accent)]">{percent}%</p>
      ) : started ? (
        <div className="flex flex-col items-center gap-4">
          {(["on", "off"] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              autoFocus={choice === "on"}
              onClick={() => {
                setSound(choice);
                setEntered(true);
              }}
              className={BTN}
            >
              {choice === "on" ? "Enter" : "Enter (no music)"}
            </button>
          ))}
        </div>
      ) : (
        <button type="button" autoFocus onClick={() => setStarted(true)} className={BTN}>
          Start
        </button>
      )}
    </div>
  );
}
