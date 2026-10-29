// Island-only helpers: seeded phases, the island outline and height field, jittered rings, and ring
// bridging. Randomness, vectors and the triangle soup come from tools/models/lib/.
import { UP } from "./palette.mjs";
import { setSeed, rnd, rr } from "../lib/rng.mjs";
import { V, SUN, nrm, Soup } from "../lib/soup.mjs";
export { rnd, rr, V, SUN, nrm, Soup };

setSeed(20261028);
export const PH = [rr(0, 6.28), rr(0, 6.28), rr(0, 6.28), rr(0, 6.28)];
export const main = new Soup(UP);
export const glow = new Soup(UP);
export const lamp = new Soup(UP);

// Island outline and surface height. The mound sits on the back edge, away from the center.
export const N = 40;
export const rimR = (t) => 2.1 * (1 + 0.08 * Math.sin(3 * t + PH[0]) + 0.05 * Math.sin(5 * t + PH[1]) + 0.03 * Math.sin(8 * t + PH[2]));
export const PLATEAU = 0.8;
export const HILL = V(-0.98, 0, -1.32);
export function heightAt(x, z) {
  const r = Math.hypot(x, z);
  if (r < PLATEAU) return 0;
  const ramp = Math.min(1, (r - PLATEAU) / 0.35);
  const wave = 0.05 * Math.sin(x * 1.7 + PH[3]) * Math.cos(z * 1.5);
  return ramp * (wave + 0.5 * Math.exp(-((x - HILL.x) ** 2 + (z - HILL.z) ** 2) / 0.28));
}
export const patch = (x, z) => Math.sin(x * 1.1 + PH[0]) * Math.cos(z * 1.0 + PH[1]);

// Rings share jitter by key, so a wall and its lip stay parallel (no self-intersection).
export const jitCache = {};
export function ring(key, frac, y, n = N, wob = 0.08) {
  const J = (jitCache[`${key}:${n}`] ??= Array.from({ length: n }, () => [rr(-0.25, 0.25), rr(-1, 1), rr(-1, 1)]));
  return J.map(([ja, jr, jy], i) => {
    const a = ((i + ja) / n) * Math.PI * 2, r = rimR(a) * frac * (1 + jr * wob);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    return V(x, typeof y === "function" ? y(x, z, i) : y + jy * 0.05, z);
  });
}
export const radialOut = (p) => V(p.x, -0.3, p.z);
export function bridge(a, b, set, outFn = radialOut) {
  const step = a.length / b.length;
  const face = (p, q, r) => main.lit(p, q, r, set, outFn(V().addVectors(p, q).add(r).divideScalar(3)));
  for (let j = 0; j < b.length; j++) {
    const j1 = (j + 1) % b.length;
    for (let s = 0; s < step; s++) face(a[j * step + s], a[(j * step + s + 1) % a.length], b[j]);
    face(a[(j1 * step) % a.length], b[j1], b[j]);
  }
}
