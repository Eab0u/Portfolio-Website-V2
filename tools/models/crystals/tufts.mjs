// Grass tufts and small stepped rock chunks around the crystal roots, hiding hard intersections.
import { GRASS, ROCK } from "./palette.mjs";
import { rock, fan, rr, V } from "./shared.mjs";
import { TOP_Y } from "./base.mjs";

// One tuft: three thin three-sided blades fanning out from a point.
function tuft(c, size) {
  for (let b = 0; b < 3; b++) {
    const a = rr(0, 6.28), lean = rr(0.3, 0.6), w = size * 0.18;
    const ring = [0, 1, 2].map((k) => {
      const t = a + (k / 3) * Math.PI * 2;
      return V(c.x + Math.cos(t) * w, c.y - 0.01, c.z + Math.sin(t) * w);
    });
    const tip = V(c.x + Math.cos(a) * size * lean, c.y + size, c.z + Math.sin(a) * size * lean);
    fan(rock, ring, tip, GRASS, (p) => V(p.x - c.x, 0.2, p.z - c.z));
  }
}

// A two-step rock chunk: a wide low slab with a smaller block on top.
function chunk(c, r) {
  for (const [y0, y1, s] of [[-0.02, r * 0.5, 1], [r * 0.5, r * 0.95, 0.6]]) {
    const k = rr(0, 1), lo = [], hi = [];
    for (let i = 0; i < 5; i++) {
      const a = ((i + k) / 5) * Math.PI * 2, rj = r * s * rr(0.85, 1.1);
      lo.push(V(c.x + Math.cos(a) * rj, c.y + y0, c.z + Math.sin(a) * rj));
      hi.push(V(c.x + Math.cos(a) * rj * 0.8, c.y + y1, c.z + Math.sin(a) * rj * 0.8));
    }
    const out = (p) => V(p.x - c.x, 0.3, p.z - c.z);
    for (let i = 0; i < 5; i++) {
      const j = (i + 1) % 5;
      rock.lit(lo[i], lo[j], hi[j], ROCK, out(lo[i])); rock.lit(lo[i], hi[j], hi[i], ROCK, out(lo[i]));
    }
    fan(rock, hi, V(c.x, c.y + y1 + r * 0.05, c.z), ROCK, () => V(0, 1, 0));
  }
}

export function buildTufts() {
  [[20, 0.5], [70, 0.46], [120, 0.62], [165, 0.3], [210, 0.48], [250, 0.42], [305, 0.5], [340, 0.4]].forEach(([deg, d]) => {
    const a = (deg * Math.PI) / 180;
    tuft(V(Math.cos(a) * d, TOP_Y + 0.02, Math.sin(a) * d), rr(0.09, 0.13));
  });
  [[40, 0.46, 0.06], [225, 0.36, 0.07], [290, 0.5, 0.05]].forEach(([deg, d, r]) => {
    const a = (deg * Math.PI) / 180;
    chunk(V(Math.cos(a) * d, TOP_Y + 0.02, Math.sin(a) * d), r);
  });
}
