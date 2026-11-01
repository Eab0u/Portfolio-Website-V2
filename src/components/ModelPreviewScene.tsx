"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { PALETTE } from "@/lib/palette";

const ANGLES: [number, number, number][] = [
  [3, 2, 4],
  [-4, 2, 3],
  [-3, 2, -4],
  [4, 2, -3],
];

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

export default function ModelPreviewScene({ src, angle }: { src: string; angle: number }) {
  return (
    <Canvas key={angle} camera={{ position: ANGLES[angle], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0b10"]} />
      <ambientLight intensity={0.5} />
      {/* Same lights, bloom and vignette as src/components/Scene.tsx so the critic sees what the site shows. */}
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.08}>
          <Center>
            <Model src={src} />
          </Center>
        </Bounds>
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.55} />
      </EffectComposer>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
