"use client";

import { Suspense, useMemo } from "react";
import { Color, Mesh, MeshBasicMaterial } from "three";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { PALETTE } from "@/lib/palette";

const ANGLES: [number, number, number][] = [
  [3, 2, 4],
  [-4, 2, 3],
  [-3, 2, -4],
  [4, 2, -3],
];

// unlit shows the raw albedo (vertex colors and material color only), so a pink render can be
// told apart: pink here means the palette is wrong, pink only when lit means the lighting is.
function Model({ src, unlit }: { src: string; unlit: boolean }) {
  const { scene } = useGLTF(src);
  const shown = useMemo(() => {
    if (!unlit) return scene;
    const copy = scene.clone(true);
    copy.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      // toneMapped false: the lit view goes through the effect composer (no tone mapping), so the
      // unlit view must skip it too or hues would differ for a reason that has nothing to do with light.
      const flat = (mat: unknown) => {
        const std = mat as { color?: Color; vertexColors?: boolean };
        return new MeshBasicMaterial({ color: std.color ?? 0xffffff, vertexColors: !!std.vertexColors, toneMapped: false });
      };
      m.material = Array.isArray(m.material) ? m.material.map(flat) : flat(m.material);
    });
    return copy;
  }, [scene, unlit]);
  return <primitive object={shown} />;
}

export default function ModelPreviewScene({ src, angle, unlit = false }: { src: string; angle: number; unlit?: boolean }) {
  return (
    <Canvas key={angle} camera={{ position: ANGLES[angle], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={["#0a0b10"]} />
      <ambientLight intensity={0.5} />
      {/* Same lights, bloom and vignette as src/components/Scene.tsx so the critic sees what the site shows. */}
      <directionalLight position={[3, 4, 2]} intensity={2} />
      <directionalLight position={[-4, -1, -3]} intensity={1.2} color={PALETTE.ice} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.08}>
          <Center>
            <Model src={src} unlit={unlit} />
          </Center>
        </Bounds>
      </Suspense>
      {!unlit && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.35} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}
      <OrbitControls makeDefault />
    </Canvas>
  );
}
