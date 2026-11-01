// Ground: a faceted sand mound with alternating sand facets, a white foam ring, and a blue lagoon
// disc with ice ripples and a deep blue-violet skirt. Props: a coral starfish, a fallen coconut,
// violet pebbles and grass tufts, all sized to read at a glance.
import { SAND, SAND_ALT, FOAM, WATER, WATER_ALT, DEEP, VIOLET, GRASS, STAR } from "./palette.mjs";
import { ground, foam, band, fan, ringAround, rr, V } from "./shared.mjs";
import { coconut } from "./coconuts.mjs";

const N = 18, UPV = V(0, 1, 0);
const disc = (jit, r, y, k = 0) => ringAround(V(0, y, 0), UPV, r, N, k, jit);
// Sand height by radius (matches the mound rings below).
const PROF = [[0, 0.33], [0.5, 0.29], [0.82, 0.18], [1.0, 0.06]];
export function sandY(x, z) {
  const r = Math.hypot(x, z);
  for (let i = 1; i < PROF.length; i++) {
    const [r0, y0] = PROF[i - 1], [r1, y1] = PROF[i];
    if (r <= r1) return y0 + ((r - r0) / (r1 - r0)) * (y1 - y0);
  }
  return 0.06;
}
const up = (p) => V(p.x, 2, p.z), radial = (p) => V(p.x, 0, p.z);

// Runs first in palm.mjs, so its ring jitter is the first draw from the seeded stream.
export function buildGround() {
  const jit = Array.from({ length: N }, () => rr(0.94, 1.06)), d = (r, y, k) => disc(jit, r, y, k);
  const skirt = d(1.38, -0.14), lagoon = d(1.38, 0.02), crest = d(1.24, 0.03, 0.5), foam0 = d(1.09, 0.04);
  const foam1 = d(1.02, 0.06), s1 = d(0.82, 0.18, 0.5), s2 = d(0.5, 0.29);
  band(ground, skirt, lagoon, DEEP, radial);
  band(ground, lagoon, crest, WATER, up, (i) => (i % 2 ? WATER_ALT : WATER));
  band(ground, crest, foam0, WATER_ALT, up);
  band(foam, foam0, foam1, FOAM, up);
  band(ground, foam1, s1, SAND, up, (i) => (i % 2 ? SAND_ALT : SAND));
  band(ground, s1, s2, SAND, up, (i) => (i % 3 ? SAND : SAND_ALT));
  fan(ground, s2, V(0, 0.33, 0), SAND, () => UPV, (i) => (i % 2 ? SAND_ALT : SAND));
  fan(ground, skirt, V(0, -0.14, 0), DEEP, () => V(0, -1, 0));
}

function starfish(x, z, r, rot) {
  const y = sandY(x, z) + 0.005, c = V(x, y + 0.045, z), pts = [];
  for (let i = 0; i < 10; i++) {
    const a = rot + (i / 10) * Math.PI * 2, rr2 = i % 2 ? r * 0.38 : r;
    pts.push(V(x + Math.cos(a) * rr2, sandY(x + Math.cos(a) * rr2, z + Math.sin(a) * rr2) + 0.008, z + Math.sin(a) * rr2));
  }
  fan(ground, pts, c, STAR, () => UPV);
}
function pebble(x, z, r, set) {
  const y = sandY(x, z), ring = ringAround(V(x, y + r * 0.3, z), UPV, r, 5, rr(0, 1));
  fan(ground, ring, V(x, y + r * 0.95, z), set, (p) => V(p.x - x, 0.2, p.z - z));
  fan(ground, ring, V(x, y - r * 0.3, z), set, (p) => V(p.x - x, -0.2, p.z - z));
}
function tuft(x, z, size) {
  const y = sandY(x, z);
  for (let b = 0; b < 4; b++) {
    const a = rr(0, 6.28), w = size * 0.13, ring = [0, 1, 2].map((k) => V(x + Math.cos(a + k * 2.1) * w, y - 0.01, z + Math.sin(a + k * 2.1) * w));
    const tip = V(x + Math.cos(a) * size * 0.5, y + size, z + Math.sin(a) * size * 0.5);
    fan(ground, ring, tip, GRASS, (p) => V(p.x - x, 0.2, p.z - z));
  }
}

export function buildProps() {
  starfish(0.55, 0.42, 0.17, 0.3);
  starfish(-0.62, -0.5, 0.16, 1.1);
  coconut(V(-0.45, sandY(-0.45, 0.5) + 0.08, 0.5), 0.15, V(0.3, 0.8, 0.5).normalize());
  pebble(0.72, -0.3, 0.12, VIOLET); pebble(-0.78, 0.1, 0.1, VIOLET); pebble(0.15, 0.75, 0.09, VIOLET);
  tuft(0.35, -0.6, 0.3); tuft(-0.25, -0.75, 0.26); tuft(0.82, 0.12, 0.26); tuft(-0.6, 0.62, 0.24);
}
