// Props on the needle bed, sized to read at a glance: big spotted coral mushrooms out in front of the
// bottom tier, lavender pebbles and grass tufts, placed in the gaps that face the preview views.
import { MUSH, STEM, TUFT, ROCK_ALT } from "./palette.mjs";
import { rock, band, fan, ball, ringAround, rr, V, UP } from "./shared.mjs";
import { soilY } from "./base.mjs";

const polar = (deg, r) => { const a = (deg * Math.PI) / 180; return [Math.cos(a) * r, Math.sin(a) * r]; };

function mushroom(deg, r, s) {
  const [x, z] = polar(deg, r), y = soilY(x, z), c = V(x, y, z), out = (p) => V(p.x - x, 0, p.z - z);
  const s0 = ringAround(c.clone().add(V(0, -0.02, 0)), UP, 0.07 * s, 6, 0), s1 = ringAround(c.clone().add(V(0, 0.2 * s, 0)), UP, 0.055 * s, 6, 0);
  band(rock, s0, s1, STEM, out);
  // Cap: a wide faceted dome with an off-white rim and three off-white spots.
  const capY = y + 0.2 * s, rim = ringAround(V(x, capY, z), UP, 0.19 * s, 8, 0.5);
  const lift = ringAround(V(x, capY + 0.07 * s, z), UP, 0.15 * s, 8, 0), top = V(x, capY + 0.16 * s, z);
  fan(rock, rim, V(x, capY - 0.02 * s, z), STEM, () => V(0, -1, 0));
  band(rock, rim, lift, MUSH, (p) => V(p.x - x, 0.6, p.z - z));
  fan(rock, lift, top, MUSH, (p) => V(p.x - x, 1, p.z - z));
  [0, 3, 5].forEach((i) => {
    const p = lift[i].clone().lerp(top, 0.25).add(V(0, 0.012 * s, 0)), d = V(p.x - x, 0.9, p.z - z).normalize();
    const spot = ringAround(p, d, 0.035 * s, 5, 0);
    fan(rock, spot, p.clone().addScaledVector(d, 0.01), STEM, () => d);
  });
}

function tuft(deg, r, size) {
  const [x, z] = polar(deg, r), y = soilY(x, z);
  for (let b = 0; b < 5; b++) {
    const a = rr(0, 6.28), w = size * 0.14, ring = [0, 1, 2].map((k) => V(x + Math.cos(a + k * 2.1) * w, y - 0.01, z + Math.sin(a + k * 2.1) * w));
    const tip = V(x + Math.cos(a) * size * 0.45, y + size * rr(0.8, 1.1), z + Math.sin(a) * size * 0.45);
    fan(rock, ring, tip, TUFT, (p) => V(p.x - x, 0.2, p.z - z));
  }
}

export function buildProps() {
  // One mushroom pair toward each preview view, out past the bottom tier's branch tips.
  [[50, 1.44, 1.7, 72, 1.38, 1.1], [143, 1.42, 1.5, 125, 1.4, 1.0], [236, 1.44, 1.6, 255, 1.38, 1.05], [325, 1.42, 1.5, 307, 1.4, 1.0]]
    .forEach(([d0, r0, s0, d1, r1, s1]) => { mushroom(d0, r0, s0); mushroom(d1, r1, s1); });
  [[100, 1.48, 0.15], [190, 1.5, 0.16], [10, 1.48, 0.14], [280, 1.5, 0.15]].forEach(([deg, r, s]) => {
    const [x, z] = polar(deg, r); ball(rock, V(x, soilY(x, z) + s * 0.4, z), s, ROCK_ALT, 0.7);
  });
  tuft(30, 1.45, 0.38); tuft(165, 1.45, 0.36); tuft(212, 1.48, 0.4); tuft(345, 1.45, 0.36);
}
