"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { reveal } from "@/lib/sceneReady";
import { useFit } from "./useFit";

// Eases the camera toward the pointer for a little parallax. Static when reduced motion is on.
export default function CameraRig() {
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
