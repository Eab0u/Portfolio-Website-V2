"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// The floating island under the crystal. Bobs slowly, still when reduced motion is on. Children share its bob.
const ISLAND_Y = -1.5;

export default function Island({ children }: { children?: ReactNode }) {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  useFrame((state) => {
    if (ref.current) ref.current.position.y = ISLAND_Y + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.1);
  });
  return (
    <group ref={ref} position={[0, ISLAND_Y, 0]}>
      <primitive object={scene} scale={0.6} />
      {children}
    </group>
  );
}
