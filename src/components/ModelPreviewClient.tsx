"use client";

import dynamic from "next/dynamic";

const ModelPreviewScene = dynamic(() => import("./ModelPreviewScene"), { ssr: false });

export default function ModelPreviewClient({ src, angle, unlit }: { src: string; angle: number; unlit: boolean }) {
  return <ModelPreviewScene src={src} angle={angle} unlit={unlit} />;
}
