// Faceted rock base: narrow blue-violet rim with an off-white chamfer trim, a raised sand ridge
// around a slightly sunken, uneven sand bowl, and a few tiny sand, mint and violet pebbles.
import { ROCK, EDGE, SAND, MINT, VIOLET } from "./palette.mjs";
import { rock, rim, band, fan, rr, V } from "./shared.mjs";

const N = 14;
export const TOP_Y = 0.3;
const radial = (p) => V(p.x, 0, p.z);
export const SAND_HI = [SAND[0], SAND[0], SAND[1]], SAND_LO = [SAND[1], SAND[2], SAND[2]];

function ringAt(jit, r, y, dy = 0.02, k = 2) {
  return jit.map(([ja, jr, jy], i) => {
    const a = ((i + ja) / N) * Math.PI * 2;
    return V(Math.cos(a) * r * jr, y === 0 ? 0 : y + (k === 2 ? jy : Math.sin(i * k)) * dy, Math.sin(a) * r * jr);
  });
}

export function buildBase() {
  const jit = Array.from({ length: N }, () => [rr(-0.2, 0.2), rr(0.92, 1.08), rr(-1, 1)]);
  const b0 = ringAt(jit, 0.86, 0), b1 = ringAt(jit, 0.95, 0.1), b2 = ringAt(jit, 0.93, 0.2);
  const bc = ringAt(jit, 0.9, 0.23), ridge = ringAt(jit, 0.8, TOP_Y + 0.04, 0.015);
  const b3 = ringAt(jit, 0.6, TOP_Y - 0.01, 0.035, 2.3);
  const alt = (i) => [SAND_HI, SAND, SAND_LO][i % 3];
  band(rim, b0, b1, ROCK, radial);
  band(rim, b1, b2, ROCK, radial);
  band(rock, b2, bc, EDGE, (p) => V(p.x, 0.8, p.z));
  band(rock, bc, ridge, SAND, (p) => V(p.x, 1.5, p.z));
  band(rock, ridge, b3, SAND, () => V(0, 1, 0), alt);
  fan(rock, b3, V(0, TOP_Y + 0.07, 0), SAND, () => V(0, 1, 0), alt);
  fan(rim, b0, V(0, 0, 0), ROCK, () => V(0, -1, 0));
}

// A small five-sided boulder sitting on the rock.
function pebble(c, r, set) {
  const k = rr(0, 6.28), ring = [];
  for (let i = 0; i < 5; i++) {
    const a = k + (i / 5) * Math.PI * 2, rj = r * rr(0.8, 1.15);
    ring.push(V(c.x + Math.cos(a) * rj, c.y + r * 0.35, c.z + Math.sin(a) * rj));
  }
  const out = (p) => V().subVectors(p, c);
  fan(rock, ring, V(c.x, c.y + r * 0.95, c.z), set, out);
  fan(rock, ring, V(c.x, c.y - r * 0.3, c.z), set, out);
}

export function buildPebbles() {
  [[30, 0.72, 0.07, SAND_LO], [80, 0.6, 0.04, MINT], [115, 0.74, 0.05, VIOLET], [200, 0.7, 0.07, SAND_LO],
    [255, 0.76, 0.04, MINT], [300, 0.58, 0.035, VIOLET], [330, 0.74, 0.05, MINT]]
    .forEach(([deg, d, r, set]) => {
      const a = (deg * Math.PI) / 180;
      pebble(V(Math.cos(a) * d, 0.31, Math.sin(a) * d), r, set);
    });
}
