"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";

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
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={2.4} color="#ffd9a0" />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#7aa8ff" />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.3}>
          <Center>
            <Model src={src} />
          </Center>
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  );
}
