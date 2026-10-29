// Triangle soup with per-face colors, shaded by one consistent warm sun. Shared by all model generators.
import * as THREE from "three";

export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const SUN = V(4, 6, 3).normalize();
export const nrm = (a, b, c) => V().subVectors(b, a).cross(V().subVectors(c, a)).normalize();

// `highlights` maps a three-step color set to its brighter color for upward-facing faces.
export class Soup {
  pos = []; col = []; tris = 0;
  constructor(highlights = new Map()) { this.highlights = highlights; }
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
    const h = Math.hypot(n.x, n.z) || 1, d = n.y < 0 ? (n.x * SUN.x + n.z * SUN.z) / h : n.dot(SUN), up = this.highlights.get(set);
    this.tri(a, b, c, up && n.y > 0.35 ? up : set[d > 0.2 ? 0 : d > -0.35 ? 1 : 2], out);
  }
}
