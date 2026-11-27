"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { reveal } from "@/lib/sceneReady";
import { useFit } from "./useFit";

const IDLE_AFTER = 4; // seconds of no input before the sway fades in
const SWAY = { x: 0.25, y: 0.12 }; // world units
const INPUT_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;

// Eases the camera toward the pointer for a little parallax. Static when reduced motion is on.
export default function CameraRig() {
  const reduced = useReducedMotion();
  const fit = useFit();
  // 1 = start pose (a little closer and lower), 0 = rest pose. GSAP eases it over 1.5 s once the preloader leaves.
  const intro = useRef({ v: reduced ? 0 : 1, started: false });
  // Idle sway: after a few still seconds a slow drift fades in; any pointer move, click, key or wheel fades it out.
  const idle = useRef({ x: 0, y: 0, still: 0, mix: 0 });
  useEffect(() => {
    const reset = () => {
      idle.current.still = 0;
    };
    INPUT_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => INPUT_EVENTS.forEach((e) => window.removeEventListener(e, reset));
  }, []);
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
    const d = idle.current;
    const moved = d.x !== state.pointer.x || d.y !== state.pointer.y;
    d.x = state.pointer.x;
    d.y = state.pointer.y;
    d.still = moved || i.v > 0.01 ? 0 : d.still + delta;
    d.mix += ((d.still > IDLE_AFTER ? 1 : 0) - d.mix) * (1 - Math.exp(-delta * 1.5));
    const t = state.clock.elapsedTime;
    const swayX = Math.sin(t * 0.4) * SWAY.x * d.mix;
    const swayY = Math.sin(t * 0.3 + 1) * SWAY.y * d.mix;
    state.camera.position.x += (state.pointer.x * 0.6 + swayX - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.4 + swayY - 0.6 * v - state.camera.position.y) * k;
    state.camera.lookAt(0, -0.6, 0);
  });
  return null;
}
