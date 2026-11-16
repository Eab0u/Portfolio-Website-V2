// Grass tuft base: a chunky ten-sided turf disc with soft irregular patches on top, a
// light bevel lip, a deep green skirt, blade tufts in three greens around the rim and two sun flowers.
import { GRASS_HI, GRASS, GRASS_SOFT, GRASS_DEEP, FLOWER, SOCK } from "./palette.mjs";
import { grass, glow, sock, band, fan, rr, V, UP, BASE_Y } from "./shared.mjs";

const N = 10, R = 0.62, CX = -0.07;
const ring = (r, y, jit, k = 0) => Array.from({ length: N }, (_, i) => {
  const a = ((i + k) / N) * Math.PI * 2, rs = r * jit[i];
  return V(CX + Math.cos(a) * rs, y, Math.sin(a) * rs);
});
const radial = (p) => V(p.x - CX, 0, p.z), up = (p) => V(p.x - CX, 2, p.z);

export function buildBase() {
  const jit = Array.from({ length: N }, () => rr(0.95, 1.05));
  const bottom = ring(R * 0.9, 0, jit), skirt = ring(R, BASE_Y - 0.05, jit), lip = ring(R * 0.94, BASE_Y - 0.01, jit);
  // Turf top in three rings with small height jitter and two or three irregular soft patches (no pinwheel).
  const mid = ring(R * 0.66, BASE_Y + 0.012, jit.map(() => rr(0.92, 1.06)), 0.5).map((p) => p.setY(p.y + rr(-0.01, 0.012)));
  const inner = ring(R * 0.3, BASE_Y + 0.02, jit.map(() => rr(0.85, 1.15)), 0.1).map((p) => p.setY(p.y + rr(-0.008, 0.01)));
  const patch = (soft) => (i) => (soft.includes(i) ? GRASS_SOFT : GRASS);
  band(grass, bottom, skirt, GRASS_DEEP, radial);
  band(grass, skirt, lip, GRASS_HI, up);
  band(grass, lip, mid, GRASS, up, patch([1, 2, 3, 6, 7]));
  band(grass, mid, inner, GRASS, up, patch([2, 3, 7]));
  fan(grass, inner, V(CX, BASE_Y + 0.025, 0), GRASS, () => UP, patch([2]));
  fan(grass, bottom, V(CX, 0, 0), GRASS_DEEP, () => V(0, -1, 0));
}

// A tuft of 4 or 5 three-sided blades leaning outward.
function tuft(x, z, size, set) {
  const n = 4 + Math.floor(rr(0, 2));
  for (let b = 0; b < n; b++) {
    const a = rr(0, 6.28), w = size * 0.14;
    const base = [0, 1, 2].map((k) => V(x + Math.cos(a + k * 2.1) * w, BASE_Y - 0.01, z + Math.sin(a + k * 2.1) * w));
    const lean = V(x - CX, 0, z).normalize().multiplyScalar(size * 0.35);
    const tip = V(x + Math.cos(a) * size * 0.25 + lean.x, BASE_Y + size * rr(0.8, 1.1), z + Math.sin(a) * size * 0.25 + lean.z);
    fan(grass, base, tip, set, (p) => V(p.x - x, 0.2, p.z - z));
  }
}

// A five-petal flower: sun petals around a coral center, flat on the turf.
function flower(x, z, r) {
  const y = BASE_Y + 0.02, c = V(x, y + 0.012, z);
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2, rr2 = i % 2 ? r * 0.45 : r;
    return V(x + Math.cos(a) * rr2, y, z + Math.sin(a) * rr2);
  });
  fan(glow, pts, c, FLOWER, () => UP);
  const dot = Array.from({ length: 5 }, (_, i) => V(x + Math.cos(i * 1.26) * r * 0.3, y + 0.014, z + Math.sin(i * 1.26) * r * 0.3));
  fan(sock, dot, V(x, y + 0.03, z), SOCK, () => UP);
}

export function buildTufts() {
  const T = [[0.38, 0.32, 0.16, GRASS_HI], [-0.42, 0.28, 0.14, GRASS], [0.2, -0.42, 0.15, GRASS_DEEP], [-0.3, -0.36, 0.13, GRASS_HI],
    [0.44, -0.14, 0.12, GRASS], [-0.12, 0.44, 0.13, GRASS_DEEP], [-0.52, -0.02, 0.12, GRASS_HI]];
  T.forEach(([x, z, s, set]) => tuft(x, z, s, set));
  flower(-0.22, 0.3, 0.05);
  flower(0.3, -0.3, 0.045);
}
