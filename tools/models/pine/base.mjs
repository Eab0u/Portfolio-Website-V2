// Round rock base: a chunky faceted lavender boulder with a light chamfered rim, a warm sand and
// coral needle-bed top, and two smaller boulders leaning on its flank.
import { ROCK, ROCK_ALT, RIM, SOIL, SOIL_ALT } from "./palette.mjs";
import { rock, band, fan, ball, ringAround, rr, V, UP } from "./shared.mjs";

const N = 16;
// Soil height by radius (matches the top rings below).
const PROF = [[0, 0.5], [1.0, 0.47], [1.56, 0.43]];
export function soilY(x, z) {
  const r = Math.hypot(x, z);
  for (let i = 1; i < PROF.length; i++) {
    const [r0, y0] = PROF[i - 1], [r1, y1] = PROF[i];
    if (r <= r1) return y0 + ((r - r0) / (r1 - r0)) * (y1 - y0);
  }
  return 0.43;
}
const out = (p) => V(p.x, 0, p.z);

// Runs first in pine.mjs, so its jitter is the first draw from the seeded stream.
export function buildBase() {
  const jit = Array.from({ length: N }, () => rr(0.92, 1.08)), yj = Array.from({ length: N }, () => rr(-0.05, 0.05));
  const ring = (r, y, k, yk) => ringAround(V(0, y, 0), UP, r, N, k, jit).map((p, i) => { p.y += yj[i] * yk; return p; });
  const bot = ring(1.3, -0.34, 0.5, 0.4), belly = ring(1.8, -0.06, 0, 1), upper = ring(1.78, 0.22, 0.5, 1);
  const lip = ring(1.67, 0.37, 0.5, 0), edge = ring(1.56, 0.43, 0.5, 0), mid = ring(1.0, 0.47, 0, 0);
  const alt = (i) => (i % 3 === 1 ? ROCK_ALT : ROCK);
  band(rock, bot, belly, ROCK, out, alt);
  band(rock, belly, upper, ROCK, out, (i) => (i % 2 ? ROCK_ALT : ROCK));
  band(rock, upper, lip, RIM, (p) => out(p).add(V(0, 0.6, 0)));
  band(rock, lip, edge, RIM, () => UP);
  band(rock, edge, mid, SOIL, () => UP, (i) => (i % 2 ? SOIL_ALT : SOIL));
  fan(rock, mid, V(0, 0.5, 0), SOIL, () => UP, (i) => (i % 3 ? SOIL : SOIL_ALT));
  fan(rock, bot, V(0, -0.38, 0), ROCK, () => V(0, -1, 0));
  // Two side boulders leaning on the flank, between the preview views.
  [[110, 0.3, 0.3], [290, 0.26, 0.3]].forEach(([deg, r, h]) => {
    const a = (deg * Math.PI) / 180;
    ball(rock, V(Math.cos(a) * 1.7, h * 0.3, Math.sin(a) * 1.7), r, ROCK_ALT, 0.8);
  });
}
