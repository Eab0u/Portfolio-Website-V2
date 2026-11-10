"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Float32BufferAttribute, IcosahedronGeometry, type Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";

// Three brightness steps of the sun color, handed out per face so the unlit disc still reads as faceted.
const STEPS = [0.86, 0.94, 1];

function useSunGeometry() {
  return useMemo(() => {
    const geo = new IcosahedronGeometry(1.1, 1); // non-indexed, so every face can own a color
    const base = new Color(PALETTE.sun);
    const colors: number[] = [];
    for (let f = 0; f < geo.attributes.position.count / 3; f++) {
      const c = base.clone().multiplyScalar(STEPS[(f * 7) % STEPS.length]);
      for (let v = 0; v < 3; v++) colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geo;
  }, []);
}

// A low-poly sun disc rising behind the hub island. Unlit and fog-free so it glows. Slow pulse, still when reduced motion is on.
export default function Sun() {
  const ref = useRef<Mesh>(null);
  const reduced = useReducedMotion();
  const geometry = useSunGeometry();
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state) => {
    if (ref.current) ref.current.scale.setScalar(reduced ? 1 : 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05);
  });
  return (
    <mesh ref={ref} geometry={geometry} position={[1.8, -1.2, -8]}>
      <meshBasicMaterial vertexColors fog={false} />
    </mesh>
  );
}
