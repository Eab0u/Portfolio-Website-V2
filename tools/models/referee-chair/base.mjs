// Ground: a small chunky faceted sand disc on y = 0 (light alternating sand facets, a raised light lip
// and a warm coral-sand skirt), coral foot plates under the four legs, two scallop shells, a coral starfish
// and two grass tufts.
import { SAND, SAND_ALT, LIP, SKIRT, SKIRT_ALT, GRASS, SHELL, STAR, CORAL } from "./palette.mjs";
import { ground, cloth, band, fan, extrude, circle, rr, V, UP, sandY, frontZ, PROFILE, MOUND_R,
  LEG_X, REAR_Z, FOOT_Y } from "./shared.mjs";

const N = 14;
const radial = (p) => V(p.x, 0, p.z).normalize();

// Runs first in referee-chair.mjs, so its rim jitter is the first draw from the seeded stream.
export function buildMound() {
  const jit = Array.from({ length: N }, () => rr(0.97, 1.03));
  const ring = ([s, y], k = 0) => Array.from({ length: N }, (_, i) => {
    const a = ((i + k) / N) * Math.PI * 2, r = MOUND_R * s * (s > 0.95 ? jit[i] : 1);
    return V(Math.cos(a) * r, y, Math.sin(a) * r);
  });
  const [p0, p1, p2, p3, p4, p5] = PROFILE;
  const bot = ring(p5), edge = ring(p4), lip = ring(p3), r2 = ring(p2), r1 = ring(p1, 0.5);
  band(ground, bot, edge, SKIRT, (p) => radial(p).add(V(0, 0.2, 0)), (i) => (i % 2 ? SKIRT : SKIRT_ALT));
  band(ground, edge, lip, LIP, (p) => radial(p).add(V(0, 1, 0)));
  band(ground, lip, r2, LIP, (p) => radial(p).negate().add(V(0, 2, 0)));
  band(ground, r2, r1, SAND, () => UP, (i) => (i % 2 ? SAND_ALT : SAND));
  fan(ground, r1, V(0, p0[1], 0), SAND, () => UP, (i) => (i % 2 ? SAND : SAND_ALT));
  fan(ground, bot, V(0, 0, 0), SKIRT, () => V(0, -1, 0));
}

// A coral octagon plate under a leg foot, sitting a hair into the sand.
function footPlate(x, z) {
  const y = sandY(x, z);
  extrude(cloth, V(x, y - 0.02, z), V(x, y + 0.03, z), circle(0.09, 6), CORAL, { caps: "b" });
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

function tuft(x, z, size) {
  const y = sandY(x, z);
  for (let b = 0; b < 4; b++) {
    const a = rr(0, 6.28), w = size * 0.13, ring = [0, 1, 2].map((k) => V(x + Math.cos(a + k * 2.1) * w, y - 0.01, z + Math.sin(a + k * 2.1) * w));
    const tip = V(x + Math.cos(a) * size * 0.5, y + size, z + Math.sin(a) * size * 0.5);
    fan(ground, ring, tip, GRASS, (p) => V(p.x - x, 0.2, p.z - z));
  }
}

export function buildGroundProps() {
  const fz = frontZ(FOOT_Y);
  for (const s of [1, -1]) { footPlate(s * LEG_X, REAR_Z); footPlate(s * LEG_X, fz); }
    shell(0.2, 0.56, 0.14, 1.4); shell(0.52, -0.3, 0.12, 4.0);
  starfish(-0.2, 0.58, 0.12, 0.5);
  tuft(0.58, 0.28, 0.3); tuft(-0.52, -0.46, 0.27); tuft(-0.62, 0.12, 0.22);
}
