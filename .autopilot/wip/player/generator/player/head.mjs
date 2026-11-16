// Head: a big, rounded faceted sand head with no face (toy proportions so it reads at small scale), a
// chin facet so it clearly faces the run, ear nubs, a saturated violet hair cap strictly above the band
// with three low back spikes and a round top knot tied in coral (the charm cue), and a constant-thickness coral
// headband level on the hairline above the brow and ears, a thin hair edge at the nape and soft cheek blush.
import { SKIN, HEAD_SKIN, BLUSH, HAIR, BAND as BAND_SET } from "./palette.mjs";
import { skin, hair, sock, geosphere, ball, band, V, HEAD } from "./shared.mjs";
import { ringAround } from "../lib/shapes.mjs";

const R = 0.17, SY = 1.06;
// Hairline: a level ring above the brow (tilted only slightly back), so no view sees it on the eye line.
const H = V(-0.12, 1, 0).normalize(), BAND = [0.36, 0.5];
const onHead = (d, s = 1) => HEAD.clone().add(V(d.x * R * s, d.y * R * SY * s, d.z * R * s));

// A three-sided spike from the hair surface along `dir`, bent by `bend`.
function spike(dir, len, bend, w = 0.045) {
  const d = dir.clone().normalize(), base = onHead(d, 1.03);
  const tip = base.clone().addScaledVector(d, len).add(bend.clone().multiplyScalar(len));
  const ring = ringAround(base, d, w, 3, 0.25), mid = base.clone().lerp(tip, 0.3);
  ring.forEach((p, i) => {
    const q = ring[(i + 1) % 3];
    hair.lit(p, q, tip, HAIR, V().add(p).add(q).add(tip).divideScalar(3).sub(mid));
  });
}

export function buildHead() {
  geosphere(HEAD, R, 1, SY, (a, b, c, dir) => skin.lit(a, b, c, HEAD_SKIN, dir));
  // Cheek blush: a small coral hexagon just proud of each cheek (charm, not a face).
  for (const s of [1, -1]) {
    const bd = V(0.32, -0.2, s * 0.9).normalize(), hex = ringAround(onHead(bd, 1.0), bd, 0.032, 6, 0);
    hex.forEach((p, i) => skin.lit(p, hex[(i + 1) % 6], onHead(bd, 1.02), BLUSH, bd));
  }
  // Chin facet: a low five-sided pyramid on the jaw (no ball, so no notch where it meets the head).
  const cd = V(0.5, -0.8, 0).normalize(), ring5 = ringAround(onHead(cd, 0.97), cd, 0.065, 5, 0.5);
  ring5.forEach((p, i) => skin.lit(p, ring5[(i + 1) % 5], onHead(cd, 1.1), SKIN, V().subVectors(p, HEAD)));
  for (const s of [1, -1]) ball(skin, onHead(V(-0.08, -0.05, s), 1.0), 0.046, HEAD_SKIN, 1.25);
  // Hair: strictly above the band, one clean edge (nothing crosses the brow, temple or cheek).
  geosphere(HEAD, R * 1.05, 2, SY, (a, b, c, dir) => { if (dir.dot(H) > BAND[0] + 0.04) hair.lit(a, b, c, HAIR, dir); });
  // Nape: a thin hair edge just under the band at the back only, so the back reads as hair over a neck.
  geosphere(HEAD, R * 1.03, 2, SY, (a, b, c, dir) => {
    const h = dir.dot(H);
    if (dir.x < -0.72 && h > BAND[0] - 0.2 && h <= BAND[0] + 0.04) hair.lit(a, b, c, HAIR, dir);
  });
  // Three low spikes sweeping back.
  [[-0.45, 0.85, 0.28], [-0.7, 0.6, 0], [-0.45, 0.85, -0.28]].forEach(([x, y, z]) => spike(V(x, y, z), 0.065, V(-0.9, -0.1, 0)));
  // Charm cue: a round top knot on the crown, tied with a small coral wrap.
  const kd = V(-0.45, 1, 0).normalize(), knot = onHead(kd, 1.32);
  ball(hair, knot, 0.07, HAIR, 0.95);
  const tie = (t, r) => ringAround(onHead(kd, t), kd, r, 7, 0.5);
  band(sock, tie(1.06, 0.045), tie(1.14, 0.042), BAND_SET, (p) => V().subVectors(p, knot).projectOnPlane(kd));
  // Headband: a straight coral strip of constant height (two equal rings), with a lip back to the head.
  const ring = (d, r) => ringAround(HEAD.clone().addScaledVector(H, d * R * SY), H, r, 12, 0.5);
  const r0 = Math.sqrt(1 - BAND[0] * BAND[0]) * R * 1.07, rTop = Math.sqrt(1 - BAND[1] * BAND[1]) * R * 1.0;
  const lo = ring(BAND[0], r0), hi = ring(BAND[0] + 0.1, r0), lip = ring(BAND[1], rTop);
  const outward = (p) => V().subVectors(p, HEAD).projectOnPlane(H);
  band(sock, lo, hi, BAND_SET, outward);
  band(sock, hi, lip, BAND_SET, (p) => outward(p).addScaledVector(H, 0.1));
}
