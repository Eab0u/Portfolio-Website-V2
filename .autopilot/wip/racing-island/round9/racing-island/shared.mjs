// Racing-island-only helpers: soups, the seeded stream, the oval track layout (a stadium curve that
// any ring can be offset from), the island outline, and ring bridging. Generic helpers come from lib/.
import { setSeed, rnd, rr } from "../lib/rng.mjs";
import { V, Soup } from "../lib/soup.mjs";
import { band, fan } from "../lib/rings.mjs";
import { extrude, rect, circle } from "../lib/extrude.mjs";
import { HI } from "./palette.mjs";
export { rnd, rr, V, band, fan, extrude, rect, circle };

setSeed(20261109);
const PH = [rr(0, 6.28), rr(0, 6.28)];
export const main = new Soup(HI);
export const paint = new Soup();
export const lamp = new Soup();
export const glow = new Soup();
export const UP = V(0, 1, 0);

// Track: a stadium oval (straights of 2L along x, end radius R), centerline shifted DZ toward +z so
// the back apron has room for the grandstand. W is the track width; the outer edge banks up by BANK.
export const L = 0.6, R = 1.02, W = 0.72, DZ = 0.2, BANK = 0.17, KH = 0.04, N = 64, FOOT = 0.56;
const PER = 4 * L + 2 * Math.PI * R;
// Point at loop parameter u (0..1, front straight first, heading +x) offset `off` outward from the centerline.
export function stad(u, off, y = 0) {
  let s = (((u % 1) + 1) % 1) * PER, cx, a;
  if (s < 2 * L) { cx = -L + s; a = Math.PI / 2; }
  else if ((s -= 2 * L) < Math.PI * R) { cx = L; a = Math.PI / 2 - s / R; }
  else if ((s -= Math.PI * R) < 2 * L) { cx = L - s; a = -Math.PI / 2; }
  else { s -= 2 * L; cx = -L; a = -Math.PI / 2 - s / R; }
  return V(cx + Math.cos(a) * (R + off), y, DZ + Math.sin(a) * (R + off));
}
// Outward horizontal normal of the loop at u.
export const outAt = (u) => V().subVectors(stad(u, 1), stad(u, 0)).normalize();
export const ringAt = (off, y) => Array.from({ length: N }, (_, i) => stad(i / N, off, typeof y === "function" ? y(i) : y));
// Track surface height across the width: flat inside, rising to BANK at the outer edge.
export const bankY = (off) => 0.012 + BANK * Math.max(0, (off + W / 2) / W) ** 1.4;

// Island outline hugs the track: a narrow apron past the berm foot (FOOT), widened behind the back
// straight for the grandstand, with a gentle wobble. t runs from the berm foot (0) to the rim (1).
const margin = (u) => 0.13 + 0.37 * Math.max(0, -outAt(u).z) ** 4 + 0.015 * Math.sin(u * Math.PI * 10 + PH[0]);
export const apronPt = (u, t, y = 0) => stad(u, FOOT + margin(u) * t, y);
export const rimPt = (i, frac = 1, y = 0) => { const p = apronPt(i / N, 1); return V(p.x * frac, y, p.z * frac); };
const ANG = Array.from({ length: N }, (_, i) => rimPt(i)).map((p) => Math.atan2(p.z, p.x));
// Polar radius of the rim at angle a (nearest rim point), for parts placed by angle.
export const rimR = (a) => {
  let best = 0;
  ANG.forEach((b, i) => { if (Math.cos(b - a) > Math.cos(ANG[best] - a)) best = i; });
  return Math.hypot(rimPt(best).x, rimPt(best).z);
};

// Underside ring of n rim points scaled toward the center; jitter is cached by key so a wall and its lip stay parallel.
const jit = {};
export function ring(key, frac, y, n, wob = 0.07) {
  const J = (jit[`${key}:${n}`] ??= Array.from({ length: n }, () => [rr(-1, 1), rr(-1, 1)]));
  return J.map(([jr, jy], i) => rimPt(i * (N / n), frac * (1 + jr * wob), y + jy * 0.05));
}
export const radialOut = (p) => V(p.x, -0.3, p.z);
// Bridge ring a to ring b (a.length a multiple of b.length) with lit faces.
export function bridge(a, b, set, outFn = radialOut) {
  const step = a.length / b.length;
  const face = (p, q, r) => main.lit(p, q, r, set, outFn(V().addVectors(p, q).add(r).divideScalar(3)));
  for (let j = 0; j < b.length; j++) {
    const j1 = (j + 1) % b.length;
    for (let s = 0; s < step; s++) face(a[j * step + s], a[(j * step + s + 1) % a.length], b[j]);
    face(a[(j1 * step) % a.length], b[j1], b[j]);
  }
}
// Flat strip between two equal rings with a per-segment color (no lighting pick: tops are flat).
export function strip(soup, a, b, color) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length, c = color(i);
    if (!c) continue;
    soup.tri(a[i], a[j], b[j], c, UP); soup.tri(a[i], b[j], b[i], c, UP);
  }
}
// An upright box standing on (x, y, z): w along x, d along z.
export const box = (soup, x, y, z, w, h, d, set, pick) => extrude(soup, V(x, y, z), V(x, y + h, z), rect(w, d), set, { pick });
