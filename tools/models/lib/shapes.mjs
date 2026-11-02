// Shape helpers shared by model generators: point rings around an axis and faceted balls.
import { V } from "./soup.mjs";

// n points around center c in the plane perpendicular to `axis`, phase k, optional per-point radius scales.
export function ringAround(c, axis, r, n, k = 0, jit = null) {
  const ax = axis.clone().normalize(), u = V(0, 0, 1).cross(ax).normalize(), w = V().crossVectors(ax, u);
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + k) / n) * Math.PI * 2, rs = r * (jit ? jit[i] : 1);
    return c.clone().addScaledVector(u, Math.cos(a) * rs).addScaledVector(w, Math.sin(a) * rs);
  });
}
// A faceted ball (icosahedron, stretched along y by `sy`) centered at c.
export function ball(soup, c, r, set, sy = 1) {
  const t = (1 + Math.sqrt(5)) / 2, raw = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
    [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  const p = raw.map(([x, y, z]) => { const v = V(x, y, z).normalize().multiplyScalar(r); v.y *= sy; return v.add(c); });
  const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (const [a, b, e] of F) soup.lit(p[a], p[b], p[e], set, V().add(p[a]).add(p[b]).add(p[e]).divideScalar(3).sub(c));
  return p;
}
