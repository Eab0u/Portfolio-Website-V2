"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useSettings } from "@/context/SettingsContext";
import { PALETTE } from "@/lib/palette";
import { markSceneReady, reveal } from "@/lib/sceneReady";
import Particles from "./Particles";

// Narrow (portrait) viewports get a smaller crystal and a farther camera so nothing is cropped.
function useFit() {
  const { width, height } = useThree((s) => s.size);
  return Math.min(1, (width / height) * 1.3);
}

function HeroCrystal() {
  const ref = useRef<Mesh>(null);
  const fit = useFit();
  const reduced = useReducedMotion();
  const speed = reduced ? 0.15 : 1;
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.3 * speed;
    ref.current.rotation.x += delta * 0.1 * speed;
  });
  return (
    <Float enabled={!reduced} speed={1.5} floatIntensity={1.2} position={[0, 0.5, 0]}>
      <mesh ref={ref} scale={fit * 0.65}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#7cf0c8" flatShading metalness={0} roughness={0.6} />
      </mesh>
    </Float>
  );
}

// The floating island under the crystal. Bobs slowly, still when reduced motion is on.
const ISLAND_Y = -1.5;

function Island() {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/island.glb");
  useFrame((state) => {
    if (ref.current) ref.current.position.y = ISLAND_Y + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.1);
  });
  return <primitive ref={ref} object={scene} position={[0, ISLAND_Y, 0]} scale={0.6} />;
}

// Eases the camera toward the pointer for a little parallax. Static when reduced motion is on.
function CameraRig() {
  const reduced = useReducedMotion();
  const fit = useFit();
  useFrame((state, delta) => {
    // Starts 0.8 back and glides in over 1.3 s once the preloader begins to leave.
    const t = reveal.start < 0 ? 0 : Math.min(1, (performance.now() - reveal.start) / 1300);
    const intro = reduced ? 0 : 0.8 * (1 - t) ** 3;
    state.camera.position.z = 7.5 + (1 - fit) * 3 + intro;
    state.camera.lookAt(0, -0.6, 0);
    if (reduced) return;
    const k = 1 - Math.exp(-delta * 3);
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * k;
    state.camera.lookAt(0, -0.6, 0);
  });
  return null;
}

export default function Scene() {
  const visible = usePageVisible();
  const { quality } = useSettings();
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 50 }}
      dpr={quality === "low" ? 1 : [1, 2]}
      onCreated={markSceneReady}
      style={{ background: `linear-gradient(to bottom, ${PALETTE.night} 0%, ${PALETTE.navy} 100%)` }}
    >
      <fog attach="fog" args={[PALETTE.navy, 7, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <CameraRig />
      <Particles />
      <group position={[0, 0.6, 0]}>
        <HeroCrystal />
        <Suspense fallback={null}>
          <Island />
        </Suspense>
      </group>
    </Canvas>
  );
}
