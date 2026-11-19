"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";
import { useTintedIsland } from "@/hooks/useTintedIsland";

const BASE: [number, number, number] = [-5.2, 0.9, -1];

// The grass island for the football district, upper left, clear of the ring and the title band.
// Bobs on its own phase, still when reduced motion is on.
export default function FootballIsland() {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  const copy = useTintedIsland(scene, PALETTE.grass);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = BASE[1] + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.45 + 1.3) * 0.1);
  });
  return (
    <group ref={ref} position={BASE}>
      <primitive object={copy} scale={0.2} rotation={[0, 0.5, 0.05]} />
    </group>
  );
}
