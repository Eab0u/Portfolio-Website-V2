"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Cloud from "./Cloud";

// x, y, z, scale, drift phase. Low and wide so the band behind the title stays clear; far (negative z) clouds dim toward navy.
const CLOUDS: [number, number, number, number, number][] = [
  [-4.6, -3.6, 0.2, 0.62, 0],
  [-2.9, -3.9, -1.5, 0.62, 1.7],
  [3.0, -3.8, -1.2, 0.62, 3.1],
  [4.7, -3.5, 0.3, 0.68, 4.4],
  [-7.2, -2.5, -3, 0.6, 5.2],
  [7.2, -2.5, -3, 0.6, 2.3],
];

function DriftingCloud({ x, y, z, scale, phase }: { x: number; y: number; z: number; scale: number; phase: number }) {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  useFrame((state) => {
    if (ref.current && !reduced) ref.current.position.x = x + Math.sin(state.clock.elapsedTime * 0.1 + phase) * 0.4;
  });
  return (
    <group ref={ref} position={[x, y, z]}>
      <Cloud scale={scale} dim={Math.min(0.6, Math.max(0.12, -z * 0.2))} />
    </group>
  );
}

// Six clouds drifting slowly below the islands. Still when reduced motion is on.
export default function CloudLayer() {
  return (
    <>
      {CLOUDS.map(([x, y, z, scale, phase], i) => (
        <DriftingCloud key={i} x={x} y={y} z={z} scale={scale} phase={phase} />
      ))}
    </>
  );
}
