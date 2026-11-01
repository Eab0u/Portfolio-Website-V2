// Crystal-cluster soups (one per material) and the seeded random stream.
import { setSeed, rr } from "../lib/rng.mjs";
import { V, Soup } from "../lib/soup.mjs";
export { rr, V };

setSeed(20261101);
export const rock = new Soup();
export const rim = new Soup();
export const mint = new Soup();
export const violet = new Soup();
export const core = new Soup();

// Bridge two equal-length rings into a band of lit quads; `out` gives each face's outward hint.
// `pick(i)` may swap the color set per quad (bevels, alternating facets).
export function band(soup, a, b, set, out, pick = () => set) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length;
    const o = out(V().add(a[i]).add(a[j]).add(b[i]).add(b[j]).multiplyScalar(0.25));
    const s = pick(i);
    soup.lit(a[i], a[j], b[j], s, o); soup.lit(a[i], b[j], b[i], s, o);
  }
}
// Fan a ring to one apex point. `pick(i)` may swap the set per face for facet variety.
export function fan(soup, ring, apex, set, out, pick = () => set) {
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    soup.lit(ring[i], ring[j], apex, pick(i), out(V().add(ring[i]).add(ring[j]).add(apex).divideScalar(3)));
  }
}
// A low hex mound (ground ring or patch) centered at c, from outer radius ro up to inner radius ri.
export function mound(soup, c, ro, ri, rise, set, n = 6, k = 0) {
  const ring = (r, y) => Array.from({ length: n }, (_, i) => {
    const a = ((i + k) / n) * Math.PI * 2;
    return V(c.x + Math.cos(a) * r, c.y + y, c.z + Math.sin(a) * r);
  });
  const outer = ring(ro, -0.03), inner = ring(ri, rise);
  band(soup, outer, inner, set, (p) => V(p.x - c.x, 1, p.z - c.z));
  fan(soup, inner, V(c.x, c.y + rise * 1.2, c.z), set, () => V(0, 1, 0));
}
