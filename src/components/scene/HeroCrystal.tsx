"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFit } from "./useFit";

useGLTF.preload("/models/crystals.glb");

const GLOW = 0.3; // extra emissive intensity while the pointer is over the crystals

export default function HeroCrystal() {
  const hover = useRef(false);
  const glow = useRef(0);
  const ref = useRef<Group>(null);
  const squash = useRef<Group>(null);
  const clickedAt = useRef(-1); // clock time of the last click, -1 for none
  const fit = useFit();
  const clock = useThree((s) => s.clock);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/crystals.glb");
  const mats = useMemo(() => {
    const out = new Map<MeshStandardMaterial, number>();
    scene.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined;
      if ((o as Mesh).isMesh && m?.name.endsWith("Crystal")) out.set(m, m.emissiveIntensity);
    });
    return out;
  }, [scene]);
  // The scene is cached, so put the emissive back when this component goes away.
  useEffect(() => () => mats.forEach((base, m) => (m.emissiveIntensity = base)), [mats]);
  useFrame((state, delta) => {
    // Hover ramps the crystal emissive up over about 0.2 s and eases back on leave (no glow when reduced motion).
    glow.current += ((hover.current && !reduced ? GLOW : 0) - glow.current) * (1 - Math.exp(-delta * 15));
    mats.forEach((base, m) => (m.emissiveIntensity = base + glow.current));
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
      <group ref={squash} onPointerOver={() => (hover.current = true)} onPointerOut={() => (hover.current = false)} onClick={() => {
          if (!reduced) clickedAt.current = clock.elapsedTime;
        }}>
        <primitive ref={ref} object={scene} scale={fit * 0.85} />
      </group>
    </Float>
  );
}
