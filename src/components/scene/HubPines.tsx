"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("/models/pine.glb");
useGLTF.preload("/models/referee-chair.glb");

// x, z on the hub island top (island local space), scale. Local y 0.12 sits the pine base in the grass.
const PINES: [number, number, number][] = [
  [-0.85, -0.4, 0.08],
  [0.8, -0.5, 0.07],
];

// Two small pines on the hub island rim, behind the crystal. They are children of the island group, so they share its bob.
export default function HubPines() {
  const { scene } = useGLTF("/models/pine.glb");
  const clones = useMemo(() => PINES.map(() => scene.clone(true)), [scene]);
  return (
    <>
      {clones.map((c, i) => (
        <primitive key={i} object={c} position={[PINES[i][0], 0.12, PINES[i][1]]} scale={PINES[i][2]} rotation={[0, i * 2.1, 0]} />
      ))}
    </>
  );
}
