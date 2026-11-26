"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, type Group, type InstancedMesh } from "three";
import { PALETTE } from "@/lib/palette";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// x, base width, height of the five far mountains.
const PEAKS = [
  [-8, 2.4, 1.5],
  [-4.2, 1.8, 1.0],
  [0.5, 2.6, 1.7],
  [4.6, 2, 1.2],
  [8.5, 2.6, 1.6],
] as const;
const SHIFT = 0.2; // world units the row slides against the pointer, a slow far-layer parallax

// One distant row of dark faceted cones low behind the ring, one instanced draw call. Still when reduced motion is on.
export default function MountainRow() {
  const group = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);
  const reduced = useReducedMotion();
  const dummy = useMemo(() => new Object3D(), []);
  useLayoutEffect(() => {
    PEAKS.forEach(([x, w, h], i) => {
      dummy.position.set(x, -4.1 + h / 2, 0);
      dummy.rotation.y = i;
      dummy.scale.set(w, h, w);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);
  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    group.current.position.x += (-state.pointer.x * SHIFT - group.current.position.x) * (1 - Math.exp(-delta * 2));
  });
  return (
    <group ref={group} position={[0, 0, -9]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, PEAKS.length]} frustumCulled={false}>
        <coneGeometry args={[0.5, 1, 5]} />
        <meshStandardMaterial color={PALETTE.night} emissive={PALETTE.navy} emissiveIntensity={0.6} flatShading fog={false} />
      </instancedMesh>
    </group>
  );
}
