// Shared island helpers: seeded randomness, sun direction, triangle soups with per-face
// sun shading, the island outline and height field, jittered rings, and ring bridging.
import * as THREE from "three";
import { UP } from "./palette.mjs";

let seed = 20261028;
export const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
export const rr = (a, b) => a + (b - a) * rnd();
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const SUN = V(4, 6, 3).normalize();
export const PH = [rr(0, 6.28), rr(0, 6.28), rr(0, 6.28), rr(0, 6.28)];
export const nrm = (a, b, c) => V().subVectors(b, a).cross(V().subVectors(c, a)).normalize();

// Triangle soup with per-face colors; flips any face whose normal points inward.
export class Soup {
  pos = []; col = []; tris = 0;
  tri(a, b, c, color, out) {
    if (out && nrm(a, b, c).dot(out) < 0) [b, c] = [c, b];
    for (const p of [a, b, c]) { this.pos.push(p.x, p.y, p.z); this.col.push(color.r, color.g, color.b); }
    this.tris++;
  }
  // Same-hue value step chosen by the facet's angle to the sun; upward ledges get the set's highlight.
  lit(a, b, c, set, out) {
    let n = nrm(a, b, c);
    if (out && n.dot(out) < 0) n = n.negate();
    // Downward faces are judged by their sideways lean only, so the underside keeps a lit side.
    const h = Math.hypot(n.x, n.z) || 1, d = n.y < 0 ? (n.x * SUN.x + n.z * SUN.z) / h : n.dot(SUN), up = UP.get(set);
    this.tri(a, b, c, up && n.y > 0.35 ? up : set[d > 0.2 ? 0 : d > -0.35 ? 1 : 2], out);
  }
}
export const main = new Soup();
export const glow = new Soup();
export const lamp = new Soup();

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
