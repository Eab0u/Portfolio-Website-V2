"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { PointLight } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";

// A faint ice light that trails the pointer in front of the scene so nearby facets catch it. Parked at the center when motion is reduced.
export default function PointerLight() {
  const ref = useRef<PointLight>(null);
  const reduced = useReducedMotion();
  useFrame((state, delta) => {
    const light = ref.current;
    if (!light || reduced) return;
    const k = 1 - Math.exp(-delta * 4);
    light.position.x += (state.pointer.x * 6 - light.position.x) * k;
    light.position.y += (state.pointer.y * 3.5 - light.position.y) * k;
  });
  return <pointLight ref={ref} color={PALETTE.ice} intensity={reduced ? 0 : 5} distance={6} decay={2} position={[0, 0, 2.5]} />;
}
