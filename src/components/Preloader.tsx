"use client";

import { useProgress } from "@react-three/drei";

// Full-screen loading overlay with a percent counter. Hides itself once everything is loaded.
export default function Preloader() {
  const { progress, total } = useProgress();
  const percent = total === 0 ? 100 : Math.round(progress);
  if (percent >= 100) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg)]"
    >
      <p className="font-mono text-5xl tabular-nums text-[var(--accent)]">{percent}%</p>
    </div>
  );
}
