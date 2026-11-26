"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import type { Group, PointLight } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";
import HubBurst from "./HubBurst";

// Pointer over the hub or crystal lifts both about 0.15 units and fades in a soft ice glow. Still when reduced motion is on.
export default function HubHover({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const glow = useRef<PointLight>(null);
  const clickedAt = useRef(-1); // clock time of the last click, -1 for none
  const clock = useThree((s) => s.clock);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const active = hovered && !reduced;
  useCursor(active);
  useFrame((state, delta) => {
    // A click pops the hub to 1.04 and back over 0.3 s.
    const t = state.clock.elapsedTime - clickedAt.current;
    if (ref.current) ref.current.scale.setScalar(clickedAt.current >= 0 && t < 0.3 ? 1 + 0.04 * Math.sin((t / 0.3) * Math.PI) : 1);
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
      onPointerDown={() => {
        if (!reduced) clickedAt.current = clock.elapsedTime;
      }}
    >
      <pointLight ref={glow} color={PALETTE.ice} intensity={0} distance={5} position={[0, -1.2, 1.5]} />
      <HubBurst at={clickedAt} />
      {children}
    </group>
  );
}
