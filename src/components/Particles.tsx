"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Object3D, type InstancedMesh } from "three";
import { PALETTE } from "@/lib/palette";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COUNT = 300;
const SPAN = 14;
const TINTS = [PALETTE.ice, PALETTE.violet, PALETTE.coral].map((c) => new Color(c));

// Deterministic pseudo-random in [0, 1).
function rand(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// 300 drifting tetrahedra, tinted ice, violet and coral, in one instanced draw call. Static when reduced motion is on.
export default function Particles() {
  const ref = useRef<InstancedMesh>(null);
  const reduced = useReducedMotion();
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({
      x: (rand(i, 1) - 0.5) * SPAN * 1.6, y: (rand(i, 2) - 0.5) * SPAN, z: -3 - rand(i, 3) * 9,
      s: 0.03 + rand(i, 4) ** 2 * 0.1, v: 0.05 + rand(i, 5) * 0.12,
    })),
    [],
  );

  const place = useCallback((t: number) => {
    const mesh = ref.current;
    if (!mesh) return;
    seeds.forEach((p, i) => {
      dummy.position.set(p.x, ((p.y + t * p.v + SPAN / 2) % SPAN) - SPAN / 2, p.z);
      dummy.rotation.set(t * p.v * 2 + i, t * p.v + i, 0);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, seeds]);

  // Each shard gets one of three palette tints (ice, violet, coral), fixed per instance.
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < COUNT; i++) mesh.setColorAt(i, TINTS[Math.floor(rand(i, 6) * 3)]);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);
  useLayoutEffect(() => place(0), [place, reduced]);
  useFrame((state) => {
    if (!reduced) place(state.clock.elapsedTime);
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ffffff" flatShading emissive={PALETTE.offWhite} emissiveIntensity={0.3} />
    </instancedMesh>
  );
}
