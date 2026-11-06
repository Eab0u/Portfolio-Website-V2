"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneClient() {
  return (
    <div
      role="img"
      aria-label="Interactive 3D scene: a cluster of mint and violet crystals above a floating island, with smaller islands, clouds and drifting shards in a night sky with a warm horizon glow."
      className="h-full w-full"
    >
      <Scene />
    </div>
  );
}
