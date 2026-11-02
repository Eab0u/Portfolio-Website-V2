import { Color, type Group, type Mesh } from "three";

// Returns a clone of the island scene whose green top is recolored to `color`.
// Geometries are cloned too, so the shared GLTF cache is never mutated.
export function tintIsland(scene: Group, color: string): Group {
  const copy = scene.clone(true);
  const tint = new Color(color);
  copy.traverse((o) => {
    const m = o as Mesh;
    const col = m.isMesh && m.geometry.getAttribute("color");
    if (!col) return;
    m.geometry = m.geometry.clone();
    const attr = m.geometry.getAttribute("color");
    for (let i = 0; i < attr.count; i++) {
      const g = attr.getY(i);
      if (g > attr.getX(i) * 1.15 && g > attr.getZ(i) * 1.15) attr.setXYZ(i, tint.r * g * 1.2, tint.g * g * 1.2, tint.b * g * 1.2);
    }
  });
  return copy;
}
