"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePageVisible } from "@/hooks/usePageVisible";
import { PALETTE } from "@/lib/palette";
import { markSceneReady } from "@/lib/sceneReady";
import Particles from "./Particles";

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
    <Float enabled={!reduced} speed={1.5} floatIntensity={1.2}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#7cf0c8" flatShading metalness={0} roughness={0.6} />
      </mesh>
    </Float>
  );
}

// Eases the camera toward the pointer for a little parallax. Static when reduced motion is on.
function CameraRig() {
  const reduced = useReducedMotion();
  useFrame((state, delta) => {
    if (reduced) return;
    const k = 1 - Math.exp(-delta * 3);
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  const visible = usePageVisible();
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      onCreated={markSceneReady}
      style={{ background: `linear-gradient(to bottom, ${PALETTE.night} 0%, ${PALETTE.navy} 100%)` }}
    >
      <fog attach="fog" args={[PALETTE.navy, 7, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <CameraRig />
      <Particles />
      <HeroCrystal />
    </Canvas>
  );
}
