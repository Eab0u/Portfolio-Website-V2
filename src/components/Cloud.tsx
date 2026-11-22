"use client";

import { Color, CylinderGeometry, IcosahedronGeometry, MeshStandardMaterial } from "three";
import { PALETTE } from "@/lib/palette";

// Puffs: x, radius, value step (0 light, 1 mid, 2 shade). Each sits on the base plane (center y = 0.8 * radius).
const PUFFS: [number, number, number][] = [
  [0.1, 0.55, 0],
  [-0.62, 0.38, 1],
  [0.72, 0.33, 1],
  [-0.2, 0.28, 2],
  [1.02, 0.14, 0],
];

// Shared geometry and per-dim material sets, so every cloud reuses the same two geometries and three materials.
const PUFF_GEO = new IcosahedronGeometry(1, 1);
const BASE_GEO = new CylinderGeometry(1, 0.85, 1, 9);
const MATERIALS = new Map<number, MeshStandardMaterial[]>();

function materialsFor(dim: number) {
  let mats = MATERIALS.get(dim);
  if (!mats) {
    mats = [
      new Color(PALETTE.offWhite).lerp(new Color(PALETTE.sand), 0.12),
      new Color(PALETTE.ice).lerp(new Color(PALETTE.offWhite), 0.3),
      new Color(PALETTE.violet).lerp(new Color(PALETTE.ice), 0.4),
    ]
      .map((c) => c.lerp(new Color(PALETTE.navy).lerp(new Color(PALETTE.violet), 0.5), dim))
      .map((c, i) => new MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: [0.45, 0.25, 0.2][i], flatShading: true, roughness: 0.9 }));
    MATERIALS.set(dim, mats);
  }
  return mats;
}

// One cloud: clustered flat-shaded puffs on a flat base, in off-white, ice and violet value steps.
export default function Cloud({ position = [0, 0, 0], scale = 1, dim = 0 }: { position?: [number, number, number]; scale?: number; dim?: number }) {
  const mats = materialsFor(dim);
  return (
    <group position={position} scale={scale}>
      {PUFFS.map(([x, r, step], i) => (
        <mesh key={i} position={[x, r * 0.8, (i % 3) * 0.1 - 0.1]} scale={[r, r * 0.8, r]} geometry={PUFF_GEO} material={mats[step]} />
      ))}
      <mesh position={[0, 0, 0]} scale={[1.25, 0.07, 0.55]} geometry={BASE_GEO} material={mats[2]} />
    </group>
  );
}
