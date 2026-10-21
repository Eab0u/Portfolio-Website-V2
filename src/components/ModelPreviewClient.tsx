"use client";

import dynamic from "next/dynamic";

const ModelPreviewScene = dynamic(() => import("./ModelPreviewScene"), { ssr: false });

export default function ModelPreviewClient({ src }: { src: string }) {
  return <ModelPreviewScene src={src} />;
}
