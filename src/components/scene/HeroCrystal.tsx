"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFit } from "./useFit";

useGLTF.preload("/models/crystals.glb");

export default function HeroCrystal() {
  const ref = useRef<Group>(null);
  const squash = useRef<Group>(null);
  const clickedAt = useRef(-1); // clock time of the last click, -1 for none
  const fit = useFit();
  const clock = useThree((s) => s.clock);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/crystals.glb");
  useFrame((state, delta) => {
    // Spins on the vertical axis only, so the rock base stays underneath.
    if (ref.current) ref.current.rotation.y += delta * 0.3 * (reduced ? 0.15 : 1);
    // A click squashes the crystal and springs it back (a damped wobble, volume kept roughly equal).
    if (squash.current && clickedAt.current >= 0) {
      const t = state.clock.elapsedTime - clickedAt.current;
      const s = t > 1.2 ? 0 : Math.exp(-5 * t) * Math.cos(16 * t) * 0.16;
      squash.current.scale.set(1 + s, 1 - s * 2, 1 + s);
      if (t > 1.2) clickedAt.current = -1;
    }
  });
  return (
    <Float enabled={!reduced} speed={1.5} floatIntensity={1.2} position={[0, 0.1, 0]}>
      <group ref={squash} onClick={() => {
          if (!reduced) clickedAt.current = clock.elapsedTime;
        }}>
        <primitive ref={ref} object={scene} scale={fit * 0.85} />
      </group>
    </Float>
  );
}
