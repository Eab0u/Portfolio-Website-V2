"use client";

import { Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Float, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useSettings } from "@/context/SettingsContext";
import { PALETTE } from "@/lib/palette";
import { SKY } from "@/lib/sky";
import { markSceneReady, reveal } from "@/lib/sceneReady";
import CloudLayer from "./CloudLayer";
import IslandRing from "./IslandRing";
import Particles from "./Particles";
import VolleyballIsland from "./VolleyballIsland";

// Narrow (portrait) viewports get a smaller crystal and a farther camera so nothing is cropped.
function useFit() {
  const { width, height } = useThree((s) => s.size);
  return Math.min(1, (width / height) * 1.3);
}

// Portrait screens (aspect under 0.7) pull the satellite islands toward the hub so none is cropped. The scale falls
// with the aspect to the power 2.5 (the view narrows and the islands also sit nearer the camera), never below 0.32.
const NARROW_ASPECT = 0.7;
const MIN_SATELLITE_SCALE = 0.32;
function Satellites({ children }: { children: ReactNode }) {
  const { width, height } = useThree((s) => s.size);
  const k = Math.min(1, Math.max(MIN_SATELLITE_SCALE, (width / height / NARROW_ASPECT) ** 2.5));
  return <group scale={k}>{children}</group>;
}

function HeroCrystal() {
  const ref = useRef<Group>(null);
  const fit = useFit();
  const reduced = useReducedMotion();
  const { scene } = useGLTF("/models/crystals.glb");
  useFrame((_, delta) => {
    // Spins on the vertical axis only, so the rock base stays underneath.
    if (ref.current) ref.current.rotation.y += delta * 0.3 * (reduced ? 0.15 : 1);
  });
  return (
    <Float enabled={!reduced} speed={1.5} floatIntensity={1.2} position={[0, 0.1, 0]}>
      <primitive ref={ref} object={scene} scale={fit * 0.85} />
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
  // 1 = start pose (a little closer and lower), 0 = rest pose. GSAP eases it over 1.5 s once the preloader leaves.
  const intro = useRef({ v: reduced ? 0 : 1, started: false });
  useFrame((state, delta) => {
    const i = intro.current;
    if (!i.started && reveal.start >= 0) {
      i.started = true;
      if (!reduced) gsap.to(i, { v: 0, duration: 1.5, ease: "power3.out" });
    }
    const v = reduced ? 0 : i.v;
    state.camera.position.z = 7.5 + (1 - fit) * 3 - 1.2 * v;
    if (reduced) {
      state.camera.lookAt(0, -0.6, 0);
      return;
    }
    const k = 1 - Math.exp(-delta * 3);
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.4 - 0.6 * v - state.camera.position.y) * k;
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
      style={{ background: SKY }}
    >
      <fog attach="fog" args={[PALETTE.navy, 7, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <CameraRig />
      <Particles />
      <group position={[0, 0.6, 0]}>
        <Suspense fallback={null}>
          <HeroCrystal />
          <Island />
          <Satellites>
            <IslandRing />
            <VolleyballIsland />
          </Satellites>
          <CloudLayer />
        </Suspense>
      </group>
      {quality !== "low" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
