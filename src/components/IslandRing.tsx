"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor, useGLTF } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";
import { tintIsland } from "@/lib/tintIsland";

// Four small islands in a loose ring behind the hub. Each one swaps its green top for another palette color.
const ISLANDS = [
  { top: PALETTE.coral, scale: 0.3 },
  { top: PALETTE.ice, scale: 0.2 },
  { top: PALETTE.sand, scale: 0.26 },
  { top: PALETTE.violet, scale: 0.18 },
] as const;

useGLTF.preload("/models/island.glb");

const FAR_Z = -3;

function SmallIsland({ top, scale, position, phase }: { top: string; scale: number; position: [number, number, number]; phase: number }) {
  const fade = position[2] < FAR_Z ? 0.35 : 0; // the farthest islands sink toward navy for depth
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  const copy = useMemo(() => tintIsland(scene, top, fade), [scene, top, fade]);
  // The tinted copy owns cloned geometries; free those (never ones shared with the cached scene) when the island goes away.
  useEffect(() => {
    const shared = new Set<unknown>();
    scene.traverse((o) => (o as Mesh).isMesh && shared.add((o as Mesh).geometry));
    return () =>
      copy.traverse((o) => {
        const m = o as Mesh;
        if (m.isMesh && !shared.has(m.geometry)) m.geometry.dispose();
      });
  }, [scene, copy]);
  const [hovered, setHovered] = useState(false);
  const lift = useRef(0);
  const active = hovered && !reduced;
  useCursor(active);
  useFrame((state, delta) => {
    // Hover lifts the island about 0.15 units with an eased lerp (no lift when reduced motion).
    lift.current += ((active ? 0.15 : 0) - lift.current) * (1 - Math.exp(-delta * 8));
    if (ref.current) ref.current.position.y = position[1] + lift.current + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.12);
  });
  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
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
