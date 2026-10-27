"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePageVisible } from "@/hooks/usePageVisible";
import { PALETTE } from "@/lib/palette";

function HeroCrystal() {
  const ref = useRef<Mesh>(null);
  const reduced = useReducedMotion();
  const speed = reduced ? 0.15 : 1;
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.3 * speed;
    ref.current.rotation.x += delta * 0.1 * speed;
  });
  return (
    <Float speed={1.5} floatIntensity={1.2}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#7cf0c8" flatShading metalness={0} roughness={0.6} />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  const visible = usePageVisible();
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      style={{ background: `linear-gradient(to bottom, ${PALETTE.night} 0%, ${PALETTE.navy} 100%)` }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <HeroCrystal />
    </Canvas>
  );
}
