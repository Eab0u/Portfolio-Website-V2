"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color, type Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";
import { tintIsland } from "@/lib/tintIsland";

// Sand lightened toward off-white so the beach reads brighter than the small sand island.
const BEACH = `#${new Color(PALETTE.sand).lerp(new Color(PALETTE.offWhite), 0.55).getHexString()}`;
const BASE: [number, number, number] = [3.9, -1.5, 0.4];

// The sand island for the volleyball district, front right of the hub. Bobs on its own phase, still when reduced motion is on.
export default function VolleyballIsland() {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  const copy = useMemo(() => tintIsland(scene, BEACH), [scene]);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = BASE[1] + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.55 + 2.4) * 0.1);
  });
  return (
    <group ref={ref} position={BASE}>
      <primitive object={copy} scale={0.2} rotation={[0, 3.6, 0.08]} />
    </group>
  );
}
