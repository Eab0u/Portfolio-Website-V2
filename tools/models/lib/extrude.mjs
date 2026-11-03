// Straight extrusions shared by model generators: sweep a convex 2D profile from point a to point b,
// as lit side quads plus optional end caps. Good for posts, bars, tapes, ropes and rods.
import { V } from "./soup.mjs";
import { band, fan } from "./rings.mjs";

// Profiles are lists of [u, v] points around the axis (convex, either winding).
export const rect = (w, d) => [[w / 2, d / 2], [-w / 2, d / 2], [-w / 2, -d / 2], [w / 2, -d / 2]];
// A rectangle with its corners cut by c, so highlights catch the edges.
export const chamfer = (w, d, c) => {
  const x = w / 2, y = d / 2;
  return [[x, y - c], [x - c, y], [-x + c, y], [-x, y - c], [-x, -y + c], [-x + c, -y], [x - c, -y], [x, -y + c]];
};
export const circle = (r, n, k = 0.5) => Array.from({ length: n }, (_, i) => {
  const a = ((i + k) / n) * Math.PI * 2;
  return [Math.cos(a) * r, Math.sin(a) * r];
});

// Frame for axis a->b; `side` (optional) picks the profile's u direction.
function frame(a, b, side) {
  const ax = V().subVectors(b, a).normalize();
  const ref = side ? side.clone() : Math.abs(ax.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0);
  const u = ref.addScaledVector(ax, -ref.dot(ax)).normalize(), w = V().crossVectors(ax, u);
  return { ax, u, w };
}
const place = (c, f, prof) => prof.map(([pu, pv]) => c.clone().addScaledVector(f.u, pu).addScaledVector(f.w, pv));

// opts: { side, caps (true, false, "a" or "b" for one end only), pick(i) per-face color set, scaleB (profile scale at b) }.
export function extrude(soup, a, b, prof, set, opts = {}) {
  const f = frame(a, b, opts.side), s = opts.scaleB ?? 1;
  const ra = place(a, f, prof), rb = place(b, f, prof.map(([x, y]) => [x * s, y * s]));
  const out = (p) => { const t = V().subVectors(p, a).dot(f.ax); return V().subVectors(p, a).addScaledVector(f.ax, -t); };
  band(soup, ra, rb, set, out, opts.pick);
  const caps = opts.caps ?? true;
  if (caps === true || caps === "a") fan(soup, ra, a.clone(), set, () => f.ax.clone().negate());
  if (caps === true || caps === "b") fan(soup, rb, b.clone(), set, () => f.ax.clone());
  return { ra, rb };
}
