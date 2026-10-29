// Grass top: faceted rings around a flat center plateau, patched in three grass values.
import { GRASS } from "./palette.mjs";
import { main, ring, heightAt, patch, PLATEAU, N, V } from "./shared.mjs";

export function buildTop() {
  const rings = [0.16, 0.3, 0.44, 0.58, 0.72, 0.85, 0.95].map((f, k) => ring(`t${k}`, f, heightAt, N, f < 0.35 ? 0 : 0.03));
  rings.push(ring("rim", 1, (x, z) => heightAt(x, z) + 0.07, N, 0));
  const up = V(0, 1, 0), o = V(0, 0, 0);
  const pick = (m) => (Math.hypot(m.x, m.z) < PLATEAU ? GRASS[0] : GRASS[patch(m.x, m.z) > 0.4 ? 0 : patch(m.x, m.z) < -0.45 ? 2 : 1]);
  for (let i = 0; i < N; i++) main.tri(o, rings[0][i], rings[0][(i + 1) % N], GRASS[0], up);
  for (let k = 0; k + 1 < rings.length; k++) {
    const a = rings[k], b = rings[k + 1];
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N, m = V().addVectors(a[i], b[j]).multiplyScalar(0.5);
      main.tri(a[i], a[j], b[j], pick(m), up); main.tri(a[i], b[j], b[i], pick(m), up);
    }
  }
  return rings[rings.length - 1];
}
