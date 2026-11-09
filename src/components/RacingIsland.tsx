"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";
import { tintIsland } from "@/lib/tintIsland";

const BASE: [number, number, number] = [-3.9, -1.5, 0.4];

// The ice island for the racing district, front left of the hub. Bobs on its own phase, still when reduced motion is on.
export default function RacingIsland() {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  const copy = useMemo(() => tintIsland(scene, PALETTE.ice), [scene]);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = BASE[1] + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.5 + 4.1) * 0.1);
  });
  return (
    <group ref={ref} position={BASE}>
      <primitive object={copy} scale={0.2} rotation={[0, 1.2, -0.06]} />
    </group>
  );
}
