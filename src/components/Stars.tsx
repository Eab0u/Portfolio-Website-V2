"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, type InstancedMesh } from "three";
import { PALETTE } from "@/lib/palette";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const COUNT = 60;

// Deterministic pseudo-random in [0, 1).
function rand(i: number, salt: number) {
  const x = Math.sin(i * 91.7 + salt * 57.3) * 24634.6345;
  return x - Math.floor(x);
}

// 60 tiny off-white stars in the dark top of the sky, one instanced draw call. They twinkle slowly; still when reduced motion is on.
export default function Stars() {
  const ref = useRef<InstancedMesh>(null);
  const reduced = useReducedMotion();
  const dummy = useMemo(() => new Object3D(), []);
  const stars = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({ x: (rand(i, 1) - 0.5) * 30, y: 2.5 + rand(i, 2) * 6, size: 0.05 + rand(i, 3) * 0.06, phase: rand(i, 4) * 6.28 })),
    [],
  );
  const place = (t: number) => {
    const mesh = ref.current;
    if (!mesh) return;
    stars.forEach((s, i) => {
      dummy.position.set(s.x, s.y, -12);
      dummy.rotation.set(0, 0, i);
      dummy.scale.setScalar(s.size * (reduced ? 1 : 0.7 + 0.3 * Math.sin(t * 0.8 + s.phase)));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  useLayoutEffect(() => place(0));
  useFrame((state) => {
    if (!reduced) place(state.clock.elapsedTime);
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={PALETTE.offWhite} fog={false} />
    </instancedMesh>
  );
}
