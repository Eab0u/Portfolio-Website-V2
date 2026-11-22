"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import type { Group, PointLight } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";

// Pointer over the hub or crystal lifts both about 0.15 units and fades in a soft ice glow. Still when reduced motion is on.
export default function HubHover({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const glow = useRef<PointLight>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const active = hovered && !reduced;
  useCursor(active);
  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 8);
    if (ref.current) ref.current.position.y += ((active ? 0.15 : 0) - ref.current.position.y) * k;
    if (glow.current) glow.current.intensity += ((active ? 6 : 0) - glow.current.intensity) * k;
  });
  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <pointLight ref={glow} color={PALETTE.ice} intensity={0} distance={5} position={[0, -1.2, 1.5]} />
      {children}
    </group>
  );
}
