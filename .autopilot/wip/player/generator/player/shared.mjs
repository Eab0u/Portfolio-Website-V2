// Footballer-only soups (one per material), the seeded random stream, the pose skeleton, and helpers:
// a loft (profile swept along a polyline with per-point scale), round tubes and a subdivided geosphere.
// Generic helpers come from tools/models/lib/.
import { setSeed, rr } from "../lib/rng.mjs";
import { V, Soup, nrm } from "../lib/soup.mjs";
import { band, fan } from "../lib/rings.mjs";
import { ball } from "../lib/shapes.mjs";
import { extrude, chamfer, circle } from "../lib/extrude.mjs";
export { rr, V, band, fan, ball, extrude, chamfer, circle };

// Routes each face by its color step: sun-step faces to `warm`, the rest to `cool`, so the two halves
// can carry different emissive tints (a warm tint greys the shade, a cool tint greys the sun side).
// A set may carry `under`: a color used only on clearly downward faces (limb and neck undersides).
class SplitSoup extends Soup {
  warm = new Soup(); cool = new Soup();
  tri(a, b, c, color, out) { (this.sunSteps.has(color) ? this.warm : this.cool).tri(a, b, c, color, out); this.tris++; }
  lit(a, b, c, set, out) {
    const n = nrm(a, b, c);
    if (out && n.dot(out) < 0) n.negate();
    if (set.under && n.y < -0.3) this.tri(a, b, c, set.under, out);
    else super.lit(a, b, c, set, out);
  }
}

setSeed(20261115);
export const shirt = new Soup();
export const pale = new SplitSoup();
export const skin = new SplitSoup();
export const sock = new Soup();
export const dark = new Soup();
export const hair = new Soup();
export const glow = new Soup();
export const grass = new Soup();
export const UP = V(0, 1, 0);
export const Z = V(0, 0, 1);

// Pose: running toward +x, left side at +z. Left leg forward with the knee up, right leg pushing off
// behind with its toe on the grass; arms counter-swing (right arm forward, left arm back).
export const BASE_Y = 0.15;
export const HIP = V(0.0, 1.02, 0), NECK = V(0.15, 1.6, 0), HEAD = V(0.23, 1.87, 0);
export const LEGS = {
  left: { hip: V(0.05, 1.0, 0.12), knee: V(0.5, 0.94, 0.15), ankle: V(0.34, 0.56, 0.15), toe: V(0.52, 0.56, 0.15) },
  right: { hip: V(-0.05, 1.0, -0.12), knee: V(-0.22, 0.6, -0.14), ankle: V(-0.62, 0.38, -0.15), toe: V(-0.5, BASE_Y + 0.035, -0.15) },
};
export const ARMS = {
  right: { sh: V(0.15, 1.51, -0.27), el: V(0.3, 1.24, -0.58), hand: V(0.27, 1.53, -0.66) },
  left: { sh: V(0.1, 1.51, 0.27), el: V(-0.12, 1.32, 0.53), hand: V(-0.2, 1.1, 0.62) },
};

// Loft: sweep profile `prof` ([u, v] points) along axis points `pts`, scaled by `sc[i]`.
// `side` sets the profile's u direction; pick(i, seg) may swap the color set per face.
export function loft(soup, pts, prof, sc, set, { side = Z, pick, caps = true } = {}) {
  const rings = pts.map((c, i) => {
    const a = V().subVectors(pts[Math.min(i + 1, pts.length - 1)], pts[Math.max(i - 1, 0)]).normalize();
    const u = side.clone().addScaledVector(a, -side.dot(a)).normalize(), w = V().crossVectors(a, u);
    return prof.map(([pu, pv]) => c.clone().addScaledVector(u, pu * sc[i]).addScaledVector(w, pv * sc[i]));
  });
  for (let i = 0; i < pts.length - 1; i++) {
    const m = pts[i].clone().lerp(pts[i + 1], 0.5), ax = V().subVectors(pts[i + 1], pts[i]).normalize();
    const out = (p) => { const d = V().subVectors(p, m); return d.addScaledVector(ax, -d.dot(ax)); };
    band(soup, rings[i], rings[i + 1], set, out, pick ? (k) => pick(k, i) : undefined);
  }
  const n = pts.length - 1;
  if (caps === true || caps === "a") fan(soup, rings[0], pts[0], set, () => V().subVectors(pts[0], pts[1]));
  if (caps === true || caps === "b") fan(soup, rings[n], pts[n], set, () => V().subVectors(pts[n], pts[n - 1]));
  return rings;
}

// A round tube from a to b with n sides, radius ra at a and rb at b.
export const tube = (soup, a, b, ra, rb, set, opts = {}) =>
  extrude(soup, a, b, circle(ra, opts.n ?? 6, opts.k ?? 0.5), set, { scaleB: rb / ra, ...opts });

// Geosphere: icosahedron subdivided `div` times, radius r, stretched by `sy`. Calls emit(a, b, c, dir)
// for each face, where dir is the face centroid's unit direction from the center (before stretch).
export function geosphere(c, r, div, sy, emit) {
  const t = (1 + Math.sqrt(5)) / 2;
  const faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const raw = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  let tri = faces.map((f) => f.map((i) => V(...raw[i]).normalize()));
  for (let d = 0; d < div; d++) {
    tri = tri.flatMap(([a, b, e]) => {
      const ab = a.clone().add(b).normalize(), be = b.clone().add(e).normalize(), ea = e.clone().add(a).normalize();
      return [[a, ab, ea], [ab, b, be], [ea, be, e], [ab, be, ea]];
    });
  }
  const place = (v) => V(v.x * r, v.y * r * sy, v.z * r).add(c);
  for (const [a, b, e] of tri) emit(place(a), place(b), place(e), a.clone().add(b).add(e).normalize());
}
