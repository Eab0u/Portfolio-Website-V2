// Ground: a modest faceted sand pad (alternating sand facets, coral-garnet skirt) sitting on y = 0,
// a raised light sand footing around each post over a garnet-brown ring, with a coral base plate
// and sun bolts, light sand ripple ridges, violet pebbles, grass tuft clusters, a shell and a starfish.
import { SAND, SAND_ALT, SKIRT, RIPPLE, LIP, FOOT, FOOT_RING, PEBBLE, GRASS, CORAL, SUN, SHELL, STAR } from "./palette.mjs";
import { ground, tape, band, fan, ringAround, extrude, circle, rr, V, UP, sandY, PROFILE, PAD_X, PAD_Z, POST_X } from "./shared.mjs";

const N = 18;
const radial = (p) => V(p.x / PAD_X, 0, p.z / PAD_Z);

// Runs first in volleyball-net.mjs, so its ring jitter is the first draw from the seeded stream.
export function buildPad() {
  const jit = Array.from({ length: N }, () => rr(0.95, 1.05));
  const ring = (s, y, k = 0) => Array.from({ length: N }, (_, i) => {
    const a = ((i + k) / N) * Math.PI * 2, r = s * (s > 0.5 ? jit[i] : 1);
    return V(Math.cos(a) * PAD_X * r, y, Math.sin(a) * PAD_Z * r);
  });
  const [, p1, p2, p3, p4, p5] = PROFILE;
  const bot = ring(p5[0], p5[1]), rim = ring(p4[0], p4[1], 0.5), lip = ring(p3[0], p3[1], 0.5);
  const r2 = ring(p2[0], p2[1]), r1 = ring(p1[0], p1[1], 0.5);
  band(ground, bot, rim, SKIRT, (p) => radial(p).add(V(0, 0.2, 0)), (i) => (i % 2 ? SKIRT : SAND_ALT));
  band(ground, rim, lip, LIP, (p) => radial(p).add(V(0, 1, 0)));
  band(ground, lip, r2, SAND, (p) => radial(p).add(V(0, 2, 0)), (i) => (i % 2 ? SAND_ALT : SAND));
  band(ground, r2, r1, SAND, () => UP, (i) => (i % 3 ? SAND : SAND_ALT));
  fan(ground, r1, V(0, PROFILE[0][1], 0), SAND, () => UP, (i) => (i % 2 ? SAND_ALT : SAND));
  fan(ground, bot, V(0, 0, 0), SKIRT, () => V(0, -1, 0));
}

// A raised faceted mound of lighter sand hugging the post foot, its rings following the pad surface,
// over a darker garnet-brown ring, topped by a coral base plate with three small sun bolts.
function footing(x) {
  const on = (r, dy, k) => ringAround(V(x, 0, 0), UP, r, 9, k).map((p) => { p.y = sandY(p.x, p.z) + dy; return p; });
  const out = (p) => V(p.x - x, 0.6, p.z);
  const r0 = on(0.32, -0.015, 0), rb = on(0.29, 0.045, 0), r1 = on(0.22, 0.1, 0.5), r2 = on(0.14, 0.17, 0);
  band(ground, r0, rb, FOOT_RING, out);
  band(ground, rb, r1, FOOT, out);
  band(ground, r1, r2, FOOT, out);
  const y = sandY(x, 0) + 0.15, top = y + 0.045;
  extrude(tape, V(x, y, 0), V(x, top, 0), circle(0.15, 9, 0), CORAL, { caps: "b" });
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + 0.6, c = V(x + Math.cos(a) * 0.115, top, Math.sin(a) * 0.115);
    fan(tape, ringAround(c, UP, 0.02, 4, 0.5), c.clone().add(V(0, 0.022, 0)), SUN, (p) => V(p.x - c.x, 0.5, p.z - c.z));
  }
}
// A small scallop shell: a domed fan of alternating light and coral ribs lying on the sand.
function shell(x, z, r, rot) {
  const y = sandY(x, z) + 0.004, hinge = V(x, y, z), peak = V(x + Math.cos(rot) * r * 0.45, y + r * 0.35, z + Math.sin(rot) * r * 0.45);
  const arc = Array.from({ length: 7 }, (_, i) => {
    const a = rot - 1.2 + (i / 6) * 2.4;
    return V(x + Math.cos(a) * r, y, z + Math.sin(a) * r);
  });
  for (let i = 0; i < 6; i++) ground.lit(arc[i], arc[i + 1], peak, i % 2 ? SHELL : SAND_ALT, UP);
  ground.lit(hinge, arc[0], peak, SHELL, UP); ground.lit(arc[6], hinge, peak, SHELL, UP);
}

// A tiny five-armed coral starfish lying flat on the sand.
function starfish(x, z, r, rot) {
  const y = sandY(x, z) + 0.005, pts = Array.from({ length: 10 }, (_, i) => {
    const a = rot + (i / 10) * Math.PI * 2, d = i % 2 ? r * 0.4 : r;
    return V(x + Math.cos(a) * d, y, z + Math.sin(a) * d);
  });
  fan(ground, pts, V(x, y + 0.03, z), STAR, () => UP);
}
// A raised triangular sand ridge lying on the pad (tape soup, so its warm glow keeps it from greying).
function ripple(x, z, len, a) {
  const d = V(Math.cos(a), 0, Math.sin(a)).multiplyScalar(len / 2);
  const p0 = V(x - d.x, 0, z - d.z), p1 = V(x + d.x, 0, z + d.z);
  p0.y = sandY(p0.x, p0.z) - 0.008; p1.y = sandY(p1.x, p1.z) - 0.008;
  extrude(tape, p0, p1, [[-0.012, -0.05], [0.045, 0], [-0.012, 0.05]], RIPPLE, { side: UP, scaleB: 0.6 });
}
function pebble(x, z, r) {
  const y = sandY(x, z), ring = ringAround(V(x, y + r * 0.3, z), UP, r, 5, rr(0, 1));
  fan(ground, ring, V(x, y + r * 0.95, z), PEBBLE, (p) => V(p.x - x, 0.2, p.z - z));
  fan(ground, ring, V(x, y - r * 0.3, z), PEBBLE, (p) => V(p.x - x, -0.2, p.z - z));
}
function tuft(x, z, size) {
  const y = sandY(x, z);
  for (let b = 0; b < 4; b++) {
    const a = rr(0, 6.28), w = size * 0.13, ring = [0, 1, 2].map((k) => V(x + Math.cos(a + k * 2.1) * w, y - 0.01, z + Math.sin(a + k * 2.1) * w));
    const tip = V(x + Math.cos(a) * size * 0.5, y + size, z + Math.sin(a) * size * 0.5);
    fan(ground, ring, tip, GRASS, (p) => V(p.x - x, 0.2, p.z - z));
  }
}

export function buildGroundProps() {
  footing(POST_X); footing(-POST_X);
  ripple(-0.45, 0.36, 0.44, 0.15); ripple(0.5, -0.36, 0.44, 0.2); ripple(-0.3, -0.42, 0.36, -0.2);
  ripple(-0.85, 0.17, 0.3, 0.4); ripple(0.1, 0.3, 0.4, -0.1); ripple(0.7, 0.3, 0.3, 0.25);
  pebble(0.8, 0.36, 0.09); pebble(-0.7, -0.34, 0.08); pebble(0.1, -0.52, 0.06); pebble(-1.35, 0.1, 0.06);
  tuft(1.05, -0.36, 0.24); tuft(1.25, -0.36, 0.2); tuft(-1.05, 0.4, 0.22); tuft(-0.9, 0.48, 0.18);
  tuft(0.65, 0.5, 0.2); tuft(-0.15, -0.55, 0.18);
  shell(0.32, 0.46, 0.12, 1.3); shell(-0.55, -0.2, 0.1, 4.2);
  starfish(0.95, 0.16, 0.09, 0.4); starfish(-0.25, 0.48, 0.08, 1.0);
}
