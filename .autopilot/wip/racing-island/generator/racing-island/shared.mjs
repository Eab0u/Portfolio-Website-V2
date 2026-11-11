// Racing-island-only helpers: soups, the seeded stream, the oval track layout (a stadium curve that
// any ring can be offset from), the island outline, and ring bridging. Generic helpers come from lib/.
import { setSeed, rnd, rr } from "../lib/rng.mjs";
import { V, Soup } from "../lib/soup.mjs";
import { band, fan } from "../lib/rings.mjs";
import { extrude, rect, circle } from "../lib/extrude.mjs";
import { C, P, HI, CLIFF, SNOW2, STONE, VHI, VIOLET, GARNET, STAND } from "./palette.mjs";
export { rnd, rr, V, band, fan, extrude, rect, circle };

setSeed(20261109);
const PH = [rr(0, 6.28), rr(0, 6.28)];
export const main = new Soup(HI);
export const paint = new Soup();
export const lamp = new Soup();
export const glow = new Soup();
export const ember = new Soup(); // coral spikes and tip, with a faint coral glow so their shade side stays coral
// Underside bands in their own meshes, each with a soft same-hue glow: the scene's ice fill light would
// otherwise turn the ice wall denim, the strata indigo and the sand brown on the faces it reaches.
export const wall = new Soup(), strata = new Soup(HI), stone = new Soup(HI);
// Garnet trim and the grandstand walls get the same treatment (garnet goes near-black, sand goes tan).
export const accent = new Soup(), stand = new Soup();
const ROUTE = new Map([[CLIFF, wall], [SNOW2, wall], [STONE, stone], [VHI, strata], [VIOLET, strata], [GARNET, accent], [STAND, stand]]);
const mainLit = main.lit.bind(main);
main.lit = (a, b, c, set, out) => (ROUTE.get(set) ?? { lit: mainLit }).lit(a, b, c, set, out);
// Facet play: the glow evens out shading on the glowing bands, so faces step light / mid / dark in a
// fixed scrambled order. Pairs share a value so quads stay whole. Variants keep upward-ledge highlights.
function facetPlay(soup, lightFn, darkFn) {
  const base = soup.lit.bind(soup), VAR = new Map();
  let k = 0;
  soup.lit = (a, b, c, set, out) => {
    if (!VAR.has(set)) {
      const v = [set, set.map(lightFn), set.map(darkFn)];
      if (soup.highlights.has(set)) v.forEach((s) => soup.highlights.set(s, soup.highlights.get(set)));
      VAR.set(set, v);
    }
    base(a, b, c, VAR.get(set)[[0, 2, 1, 2, 0, 1, 2][(k++ >> 1) % 7]], out);
  };
}
// Ice wall: light steps toward bright ice, dark steps lean violet so they never read cold steel.
facetPlay(wall, (x) => x.clone().lerp(C(P.ice), 0.5).lerp(C(P.white), 0.1), (x) => x.clone().lerp(C(P.violet), 0.14).multiplyScalar(0.72));
// Violet strata: same-hue value steps.
facetPlay(strata, (x) => x.clone().lerp(C(P.white), 0.14), (x) => x.clone().multiplyScalar(0.74));
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
  const soup = ROUTE.get(set) ?? main, face = (p, q, r) => soup.lit(p, q, r, set, outFn(V().addVectors(p, q).add(r).divideScalar(3)));
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
