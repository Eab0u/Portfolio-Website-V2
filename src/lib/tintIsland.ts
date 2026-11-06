import { Color, type Group, type Mesh } from "three";
import { PALETTE } from "./palette";

// Returns a clone of the island scene whose green top is recolored to `color`.
// Geometries are cloned too, so the shared GLTF cache is never mutated.
// `fade` (0 to 1) then blends every vertex color toward `fadeTo` for atmospheric depth on far islands.
export function tintIsland(scene: Group, color: string, fade = 0, fadeTo: string = PALETTE.navy): Group {
  const copy = scene.clone(true);
  const tint = new Color(color);
  const far = new Color(fadeTo);
  copy.traverse((o) => {
    const m = o as Mesh;
    const col = m.isMesh && m.geometry.getAttribute("color");
    if (!col) return;
    m.geometry = m.geometry.clone();
    const attr = m.geometry.getAttribute("color");
    for (let i = 0; i < attr.count; i++) {
      const g = attr.getY(i);
      if (g > attr.getX(i) * 1.15 && g > attr.getZ(i) * 1.15) attr.setXYZ(i, tint.r * g * 1.2, tint.g * g * 1.2, tint.b * g * 1.2);
      if (fade > 0) attr.setXYZ(i, attr.getX(i) + (far.r - attr.getX(i)) * fade, attr.getY(i) + (far.g - attr.getY(i)) * fade, attr.getZ(i) + (far.b - attr.getZ(i)) * fade);
    }
  });
  return copy;
}
