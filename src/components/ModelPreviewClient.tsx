"use client";

import dynamic from "next/dynamic";

const ModelPreviewScene = dynamic(() => import("./ModelPreviewScene"), { ssr: false });

export default function ModelPreviewClient({ src, angle }: { src: string; angle: number }) {
  return <ModelPreviewScene src={src} angle={angle} />;
}
