"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, type InstancedMesh } from "three";
import { PALETTE } from "@/lib/palette";

const COUNT = 8;
const LIFE = 0.8; // seconds a burst lasts
const dummy = new Object3D();

// Eight ice shards fly outward from the hub and shrink away over 0.8 s. `at` holds the clock time of the last click (-1 for none).
export default function HubBurst({ at }: { at: MutableRefObject<number> }) {
  const ref = useRef<InstancedMesh>(null);
  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime - at.current;
    mesh.visible = at.current >= 0 && t < LIFE;
    if (!mesh.visible) return;
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * t * 3.4, 0.5 + t * 0.8, Math.sin(a) * t * 3.4 + 0.8);
      dummy.rotation.set(t * 4 + i, t * 3, 0);
      dummy.scale.setScalar(0.14 * (1 - t / LIFE));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} visible={false} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={PALETTE.ice} />
    </instancedMesh>
  );
}
