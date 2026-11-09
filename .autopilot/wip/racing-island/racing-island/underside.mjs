// Rim and underside, in the hub island's family: a snow bevel with hanging icicles, an ice cliff
// band, a sand stone lip, violet strata with ice-lit ledges, a three-point coral tip, and fused
// stalactites. Rings follow the island's own outline (ANG and rimR in shared.mjs).
import { SNOW, SNOW2, CLIFF, ICE, STONE, VHI, VIOLET, TIP, SPIKE } from "./palette.mjs";
import { main, ring, bridge, rimR, rimPt, rr, V, N } from "./shared.mjs";

// [y, radius fraction, points, band, jitter key]. Outward steps make ice-lit ledges.
const PROFILE = [
  [-0.5, 0.985, 64, CLIFF, "a"], [-0.56, 1.0, 64, STONE, "a"], [-0.78, 0.95, 64, STONE, "a"],
  [-0.88, 0.8, 32, VHI, "b"], [-1.3, 0.62, 32, VHI, "c"], [-1.36, 0.66, 32, VHI, "c"], [-1.46, 0.63, 32, VIOLET, "c"],
  [-1.95, 0.44, 16, VIOLET, "d"], [-2.0, 0.47, 16, VIOLET, "d"], [-2.1, 0.44, 16, VIOLET, "d"],
  [-2.55, 0.25, 8, VIOLET, "e"], [-2.8, 0.15, 8, TIP, "e"],
];

export function buildUnderside(rim) {
  const bevel = rim.map((p) => V(p.x * 1.025, p.y - 0.09, p.z * 1.025));
  bridge(rim, bevel, SNOW);
  let prev = bevel.map((p, i) => V(p.x * 0.995, -0.14 - [0.12, 0.02, 0.07, 0.03][i % 4], p.z * 0.995));
  bridge(bevel, prev, SNOW2);
  const rings = PROFILE.map(([y, s, n, set, key]) => { const r = ring(key, s, y, n); bridge(prev, r, set); prev = r; return r; });
  const tips = [[-3.55, 0.5], [-3.15, 2.6], [-3.3, 4.6]].map(([y, a]) => V(Math.cos(a) * 0.14, y, Math.sin(a) * 0.14));
  const out = (p) => V(p.x, -0.5, p.z), cut = [0, 3, 5, 8];
  for (let s = 0; s < 3; s++) {
    for (let i = cut[s]; i < cut[s + 1]; i++) main.lit(prev[i], prev[(i + 1) % 8], tips[s], TIP, out(prev[i]));
    const b = prev[cut[s + 1] % 8];
    main.lit(b, tips[s], tips[(s + 1) % 3], TIP, out(b));
  }
  main.lit(tips[0], tips[1], tips[2], TIP, V(0, -1, 0));
  return rings;
}

// Icicles under the snow bevel: three-sided tapered cones in two sizes, alternating along the rim.
export function buildIcicles() {
  for (let k = 0; k < 18; k++) {
    const i = (k * 7 + 2) % N, p = rimPt(i, 0.985, -0.12), a = Math.atan2(p.z, p.x), len = k % 2 ? rr(0.18, 0.26) : rr(0.34, 0.5);
    const r = k % 2 ? 0.045 : 0.07, tip = V(p.x * 0.99, p.y - len, p.z * 0.99);
    const base = [0, 1, 2].map((j) => V(p.x + Math.cos(a + j * 2.09) * r, p.y, p.z + Math.sin(a + j * 2.09) * r));
    for (let j = 0; j < 3; j++) main.lit(base[j], base[(j + 1) % 3], tip, ICE, V().subVectors(base[j], p).setY(-0.2));
  }
}

// Stalactites fused into the body, all one coral: three big inner ones and three small outer ones.
export function buildSpikes() {
  [[0.9, 0.36, 0.3, -2.95], [3.0, 0.36, 0.28, -2.8], [5.1, 0.36, 0.3, -2.9],
    [1.95, 0.58, 0.18, -1.75], [4.05, 0.58, 0.17, -1.7], [6.0, 0.58, 0.18, -1.8]].forEach(([a, f, r, y]) => {
    const Rr = rimR(a) * f, c = V(Math.cos(a) * Rr, -0.95, Math.sin(a) * Rr), tip = V(c.x * 1.2, y, c.z * 1.2);
    const ring6 = (yy, rad, k) => Array.from({ length: 6 }, (_, i) => {
      const t = (i / 6) * Math.PI * 2 + a;
      return V(c.x * k + Math.cos(t) * rad, yy, c.z * k + Math.sin(t) * rad);
    });
    const top = ring6(-0.95, r, 1), mid = ring6((-0.95 + y) / 2 + 0.12, r * 0.55, 1.1);
    const out = (p) => V(p.x - c.x, -0.2, p.z - c.z);
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6;
      main.lit(top[i], top[j], mid[j], SPIKE, out(top[i])); main.lit(top[i], mid[j], mid[i], SPIKE, out(top[i]));
      main.lit(mid[i], mid[j], tip, SPIKE, out(mid[i]));
    }
  });
}
