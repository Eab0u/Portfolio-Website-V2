// Rim and underside: beveled grass rim with drips, earth and stone bands, violet strata with
// ice-lit ledges, a three-point coral tip, and fused stalactites.
import { GRASS, EARTH, STONE, VHI, VIOLET, TIP } from "./palette.mjs";
import { main, ring, bridge, rimR, V } from "./shared.mjs";

// Underside profile: [y, radius fraction, segments, band, jitter key]. Outward steps make ice-lit
// ledges; the body tapers fast so the lowest strata are well under half the rim width.
export const PROFILE = [
  [-0.5, 0.985, 40, EARTH, "a"], [-0.56, 1.0, 40, STONE, "a"], [-0.78, 0.95, 40, STONE, "a"],
  [-0.88, 0.8, 40, VHI, "b"], [-1.3, 0.62, 20, VHI, "c"], [-1.36, 0.66, 20, VHI, "c"], [-1.46, 0.63, 20, VIOLET, "c"],
  [-1.95, 0.44, 20, VIOLET, "d"], [-2.0, 0.47, 20, VIOLET, "d"], [-2.1, 0.44, 20, VIOLET, "d"],
  [-2.55, 0.25, 10, VIOLET, "e"], [-2.8, 0.15, 10, TIP, "e"],
];
// The bottom splits into three uneven coral points, closed by a small base triangle.
export function buildRimAndUnderside(rim) {
  const bevel = rim.map((p) => V(p.x * 1.03, p.y - 0.09, p.z * 1.03));
  bridge(rim, bevel, GRASS);
  let prev = bevel.map((p, i) => V(p.x, -0.06 - [0.22, 0.03, 0.12][i % 3], p.z));
  bridge(bevel, prev, GRASS);
  const rings = PROFILE.map(([y, s, n, set, key]) => { const r = ring(key, s, y, n); bridge(prev, r, set); prev = r; return r; });
  const tips = [[-3.55, 0.5], [-3.15, 2.6], [-3.3, 4.6]].map(([y, a]) => V(Math.cos(a) * 0.14, y, Math.sin(a) * 0.14));
  const out = (p) => V(p.x, -0.5, p.z);
  const cut = [0, 4, 7, 10];
  for (let s = 0; s < 3; s++) {
    for (let i = cut[s]; i < cut[s + 1]; i++) main.lit(prev[i], prev[(i + 1) % 10], tips[s], TIP, out(prev[i]));
    const b = prev[cut[s + 1] % 10];
    main.lit(b, tips[s], tips[(s + 1) % 3], TIP, out(b));
  }
  main.lit(tips[0], tips[1], tips[2], TIP, V(0, -1, 0));
  return rings;
}

// Stalactites fused into the body in clear size order: three big inner ones, three small outer ones.
export function buildSpikes() {
  [[0.9, 0.36, 0.3, -2.95], [3.0, 0.36, 0.28, -2.8], [5.1, 0.36, 0.3, -2.9],
    [1.95, 0.58, 0.18, -1.75], [4.05, 0.58, 0.17, -1.7], [6.0, 0.58, 0.18, -1.8]].forEach(([a, f, r, y]) => {
    const R = rimR(a) * f, c = V(Math.cos(a) * R, -0.95, Math.sin(a) * R), tip = V(c.x * 1.2, y, c.z * 1.2);
    const ring6 = (yy, rad, k) => Array.from({ length: 6 }, (_, i) => {
      const t = (i / 6) * Math.PI * 2 + a;
      return V(c.x * k + Math.cos(t) * rad, yy, c.z * k + Math.sin(t) * rad);
    });
    const top = ring6(-0.95, r, 1), mid = ring6((-0.95 + y) / 2 + 0.12, r * 0.55, 1.1);
    const out = (p) => V(p.x - c.x, -0.2, p.z - c.z);
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6;
      main.lit(top[i], top[j], mid[j], VIOLET, out(top[i])); main.lit(top[i], mid[j], mid[i], VIOLET, out(top[i]));
      main.lit(mid[i], mid[j], tip, TIP, out(mid[i]));
    }
  });
}
