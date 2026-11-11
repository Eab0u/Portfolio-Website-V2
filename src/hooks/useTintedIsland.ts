import { useEffect, useMemo } from "react";
import type { Group, Mesh } from "three";
import { tintIsland } from "@/lib/tintIsland";

// A tinted clone of the island scene. The clone owns cloned geometries; this frees them (never ones shared with the cached scene) when the island goes away.
export function useTintedIsland(scene: Group, color: string, fade = 0): Group {
  const copy = useMemo(() => tintIsland(scene, color, fade), [scene, color, fade]);
  useEffect(() => {
    const shared = new Set<unknown>();
    scene.traverse((o) => (o as Mesh).isMesh && shared.add((o as Mesh).geometry));
    return () =>
      copy.traverse((o) => {
        const m = o as Mesh;
        if (m.isMesh && !shared.has(m.geometry)) m.geometry.dispose();
      });
  }, [scene, copy]);
  return copy;
}
