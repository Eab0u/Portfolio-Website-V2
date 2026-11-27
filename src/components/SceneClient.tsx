"use client";

import dynamic from "next/dynamic";
import ModelErrorBoundary from "./ModelErrorBoundary";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneClient() {
  return (
    <div
      role="img"
      aria-label="Interactive 3D scene: a cluster of mint and violet crystals above a floating island, with smaller islands, clouds and drifting shards in a night sky with a warm horizon glow."
      className="h-full w-full"
    >
      <ModelErrorBoundary
        fallback={
          <p className="flex h-full items-center justify-center px-6 text-center text-sm text-[var(--accent)]">
            The 3D world could not start on this device. The rest of the page
            still works.
          </p>
        }
      >
        <Scene />
      </ModelErrorBoundary>
    </div>
  );
}
