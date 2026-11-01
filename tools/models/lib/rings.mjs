// Ring helpers shared by model generators: bridge two equal-length point rings into lit quads,
// or fan a ring to one apex. `out(p)` gives each face's outward hint; `pick(i)` may swap the
// color set per face (bevels, alternating facets).
import { V } from "./soup.mjs";

export function band(soup, a, b, set, out, pick = () => set) {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length, s = pick(i);
    const o = out(V().add(a[i]).add(a[j]).add(b[i]).add(b[j]).multiplyScalar(0.25));
    soup.lit(a[i], a[j], b[j], s, o); soup.lit(a[i], b[j], b[i], s, o);
  }
}

export function fan(soup, ring, apex, set, out, pick = () => set) {
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    soup.lit(ring[i], ring[j], apex, pick(i), out(V().add(ring[i]).add(ring[j]).add(apex).divideScalar(3)));
  }
}
