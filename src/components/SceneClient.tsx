"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneClient() {
  return (
    <div
      role="img"
      aria-label="Interactive 3D scene: a slowly turning mint crystal floating in a night sky with drifting shards."
      className="h-full w-full"
    >
      <Scene />
    </div>
  );
}
