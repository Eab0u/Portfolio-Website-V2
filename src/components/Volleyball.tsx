"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Float32BufferAttribute, IcosahedronGeometry, Vector3, type Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE } from "@/lib/palette";

const PANELS = [PALETTE.offWhite, PALETTE.blue, PALETTE.sun].map((c) => new Color(c));

// Low-poly volleyball: an icosahedron (detail 1). Panels follow each face's dominant axis (three colors, opposite
// sides match), underside faces darken one value step.
function makeBall() {
  const geo = new IcosahedronGeometry(1, 1);
  const pos = geo.attributes.position;
  const colors: number[] = [];
  const n = new Vector3();
  const c = new Color();
  for (let f = 0; f < pos.count / 3; f++) {
    n.set(0, 0, 0);
    for (let v = 0; v < 3; v++) n.add(new Vector3().fromBufferAttribute(pos, f * 3 + v));
    n.normalize();
    const axis = Math.abs(n.x) > Math.abs(n.y) && Math.abs(n.x) > Math.abs(n.z) ? 0 : Math.abs(n.y) > Math.abs(n.z) ? 1 : 2;
    c.copy(PANELS[axis]);
    if (n.y < -0.2) c.multiplyScalar(0.6);
    for (let v = 0; v < 3; v++) colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geo;
}

// Hovers gently and spins slowly. Still when reduced motion is on.
export default function Volleyball({ position, size = 0.13 }: { position: [number, number, number]; size?: number }) {
  const ref = useRef<Mesh>(null);
  const reduced = useReducedMotion();
  const geometry = useMemo(() => makeBall(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state) => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.position.y = position[1];
      return;
    }
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.6) * 0.03;
    ref.current.rotation.y = t * 0.5;
  });
  return (
    <mesh ref={ref} geometry={geometry} position={position} scale={size}>
      <meshStandardMaterial vertexColors flatShading roughness={0.55} emissive={PALETTE.sun} emissiveIntensity={0.05} />
    </mesh>
  );
}
