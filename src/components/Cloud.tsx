"use client";

import { useEffect, useMemo } from "react";
import { Color, MeshStandardMaterial } from "three";
import { PALETTE } from "@/lib/palette";

// Puffs: x, radius, value step (0 light, 1 mid, 2 shade). Each sits on the base plane (center y = 0.8 * radius).
const PUFFS: [number, number, number][] = [
  [0.1, 0.55, 0],
  [-0.62, 0.38, 1],
  [0.72, 0.33, 1],
  [-0.2, 0.28, 2],
  [1.02, 0.14, 0],
];

// One cloud: clustered flat-shaded puffs on a flat base, in off-white, ice and violet value steps.
export default function Cloud({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const mats = useMemo(
    () =>
      [
        new Color(PALETTE.offWhite).lerp(new Color(PALETTE.sand), 0.12),
        new Color(PALETTE.ice).lerp(new Color(PALETTE.offWhite), 0.3),
        new Color(PALETTE.violet).lerp(new Color(PALETTE.ice), 0.4),
      ].map((c, i) => new MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: [0.45, 0.25, 0.2][i], flatShading: true, roughness: 0.9 })),
    [],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  return (
    <group position={position} scale={scale}>
      {PUFFS.map(([x, r, step], i) => (
        <mesh key={i} position={[x, r * 0.8, (i % 3) * 0.1 - 0.1]} scale={[r, r * 0.8, r]} material={mats[step]}>
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]} scale={[1.25, 0.07, 0.55]} material={mats[2]}>
        <cylinderGeometry args={[1, 0.85, 1, 9]} />
      </mesh>
    </group>
  );
}
