import { useSyncExternalStore } from "react";

// Tiny store: the Canvas flips it once, the Preloader reads it. Survives either mount order.
let ready = false;
const listeners = new Set<() => void>();

export function markSceneReady() {
  ready = true;
  listeners.forEach((l) => l());
}

export function useSceneReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => false,
  );
}

// Set when the preloader starts leaving; the camera eases in from here. Read per frame, so not reactive.
export const reveal = { start: -1 };

export function markRevealing() {
  if (reveal.start < 0) reveal.start = performance.now();
}
