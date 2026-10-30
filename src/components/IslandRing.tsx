"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color, type Group, Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";

// Four small islands in a loose ring behind the hub. Each one swaps its green top for another palette color.
const ISLANDS = [
  { top: PALETTE.coral, scale: 0.3 },
  { top: PALETTE.ice, scale: 0.2 },
  { top: PALETTE.sand, scale: 0.26 },
  { top: PALETTE.violet, scale: 0.18 },
] as const;

function SmallIsland({ top, scale, position, phase }: { top: string; scale: number; position: [number, number, number]; phase: number }) {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  const copy = useMemo(() => {
    const c = scene.clone(true);
    const tint = new Color(top);
    c.traverse((o) => {
      const m = o as Mesh;
      const col = m.isMesh && m.geometry.getAttribute("color");
      if (!col) return;
      m.geometry = m.geometry.clone();
      const attr = m.geometry.getAttribute("color");
      for (let i = 0; i < attr.count; i++) {
        const g = attr.getY(i);
        if (g > attr.getX(i) * 1.15 && g > attr.getZ(i) * 1.15) attr.setXYZ(i, tint.r * g * 1.2, tint.g * g * 1.2, tint.b * g * 1.2);
      }
    });
    return c;
  }, [scene, top]);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = position[1] + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.12);
  });
  return (
    <group ref={ref} position={position}>
      <primitive object={copy} scale={scale} />
    </group>
  );
}

export default function IslandRing() {
  return (
    <group>
      {ISLANDS.map(({ top, scale }, i) => {
        const a = (i / ISLANDS.length) * Math.PI * 2 + 0.9;
        return <SmallIsland key={top} top={top} scale={scale} phase={i * 1.7} position={[Math.cos(a) * 4.6, Math.sin(a) * 1.8 - 0.6, -2 - 1.5 * Math.sin(a + i)]} />;
      })}
    </group>
  );
}
