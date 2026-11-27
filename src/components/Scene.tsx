"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { usePageVisible } from "@/hooks/usePageVisible";
import { useSettings } from "@/context/SettingsContext";
import { PALETTE } from "@/lib/palette";
import { SKY } from "@/lib/sky";
import { markSceneReady } from "@/lib/sceneReady";
import CloudLayer from "./CloudLayer";
import FootballIsland from "./FootballIsland";
import HubHover from "./scene/HubHover";
import HeroCrystal from "./scene/HeroCrystal";
import CameraRig from "./scene/CameraRig";
import HubPines from "./scene/HubPines";
import Island from "./scene/Island";
import ModelErrorBoundary from "./ModelErrorBoundary";
import IslandRing from "./IslandRing";
import MountainRow from "./MountainRow";
import PointerLight from "./PointerLight";
import Particles from "./Particles";
import RacingIsland from "./RacingIsland";
import Stars from "./Stars";
import Sun from "./Sun";
import VolleyballIsland from "./VolleyballIsland";

// A very small red/blue split that grows toward the screen edge; kept as one shared vector so it is not rebuilt per render.
const FRINGE = new Vector2(0.0006, 0.0006);

// Portrait screens (aspect under 0.7) pull the satellite islands toward the hub so none is cropped. The scale falls
// with the aspect to the power 2.5 (the view narrows and the islands also sit nearer the camera), never below 0.32.
const NARROW_ASPECT = 0.7;
const MIN_SATELLITE_SCALE = 0.32;
function Satellites({ children }: { children: ReactNode }) {
  const { width, height } = useThree((s) => s.size);
  const k = Math.min(1, Math.max(MIN_SATELLITE_SCALE, (width / height / NARROW_ASPECT) ** 2.5));
  return <group scale={k}>{children}</group>;
}

// A failed model hides only its own subtree, so the crystal, hub island and ring survive.
function Guarded({ children }: { children: ReactNode }) {
  return (
    <ModelErrorBoundary>
      <Suspense fallback={null}>{children}</Suspense>
    </ModelErrorBoundary>
  );
}

export default function Scene() {
  const visible = usePageVisible();
  const { quality } = useSettings();
  // PerformanceMonitor reports 0 (struggling) to 1 (smooth). The render scale follows it from 1x to 2x in
  // quarter steps and settles at 1x once it has flip-flopped more than 3 times.
  const [perf, setPerf] = useState(1);
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 50 }}
      dpr={quality === "low" ? 1 : [1, 1 + Math.round(perf * 4) / 4]}
      onCreated={markSceneReady}
      style={{ background: SKY }}
    >
      <fog attach="fog" args={[PALETTE.navy, 7, 16]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <PerformanceMonitor factor={1} flipflops={3} onChange={({ factor }) => setPerf(factor)} onFallback={() => setPerf(0)} />
      <CameraRig />
      <PointerLight />
      <Stars />
      <MountainRow />
      <Particles />
      <group position={[0, 0.6, 0]}>
        <ModelErrorBoundary>
        <Suspense fallback={null}>
          <HubHover>
            <HeroCrystal />
            <Island>
              <Guarded>
                <HubPines />
              </Guarded>
            </Island>
          </HubHover>
          <Satellites>
            <IslandRing />
            <Guarded>
              <VolleyballIsland />
            </Guarded>
            <RacingIsland />
            <Guarded>
              <FootballIsland />
            </Guarded>
          </Satellites>
          <Sun />
          <Guarded>
            <CloudLayer />
          </Guarded>
        </Suspense>
        </ModelErrorBoundary>
      </group>
      {quality !== "low" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
          <ChromaticAberration offset={FRINGE} radialModulation modulationOffset={0.4} />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
