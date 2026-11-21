"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Color, Float32BufferAttribute, IcosahedronGeometry, type Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";

// Three brightness steps of the sun color, handed out per face so the unlit disc still reads as faceted.
const STEPS = [0.86, 0.94, 1];

function useSunGeometry() {
  return useMemo(() => {
    const geo = new IcosahedronGeometry(0.82, 1); // non-indexed, so every face can own a color
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

// A low-poly sun disc rising behind the hub island. Unlit and fog-free so it glows. Slow pulse and spin, with a soft coral rim shell; still when reduced motion is on.
export default function Sun() {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const geometry = useSunGeometry();
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state) => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.scale.setScalar(1);
      ref.current.rotation.y = 0;
      return;
    }
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05);
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={ref} position={[1.2, -0.7, -8]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors fog={false} />
      </mesh>
      <mesh geometry={geometry} scale={1.1}>
        <meshBasicMaterial color={PALETTE.coral} side={BackSide} fog={false} transparent opacity={0.55} depthWrite={false} />
      </mesh>
    </group>
  );
}
