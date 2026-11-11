// Flat top at y = 0 with the oval track baked in. Inside out: mint infield in mowing stripes, a sloped
// red and white inner kerb, a deep blue banked track with a dashed white center line and a checkered
// start line, a raised outer kerb, a white barrier, an ice berm, then the snow apron out to the rim.
import { INFIELD, INFIELD2, TRACK, TRACK2, RED, WHITE, ICE, BERM2, SNOW, APRON, APRON2 } from "./palette.mjs";
import { main, paint, glow, wall, band, ringAt, strip, bankY, apronPt, V, UP, N, W, R, KH, DZ, FOOT } from "./shared.mjs";

export const START = 2; // loop segment where the start line begins (front straight)
const HALF = W / 2, TOP = bankY(HALF);
const kerb = (i) => (i % 2 ? RED : WHITE);
const out = (p) => V(p.x, 0, p.z - DZ).normalize().add(V(0, 0.6, 0));
const inward = (p) => V(-p.x, 0, DZ - p.z).normalize().add(V(0, 0.6, 0));

function infield() {
  const offs = [-R + 0.06, -0.84, -0.68, -0.54, -HALF - 0.12];
  const rings = offs.map((o) => ringAt(o, 0)), c = V(0, 0, DZ);
  for (let i = 0; i < N; i++) main.tri(c, rings[0][i], rings[0][(i + 1) % N], INFIELD[1], UP);
  for (let k = 0; k + 1 < rings.length; k++) strip(main, rings[k], rings[k + 1], () => (k % 2 ? INFIELD : INFIELD2)[1]);
}

function track() {
  // Inner kerb: a short riser, then a top sloping down onto the track edge.
  const k0 = ringAt(-HALF - 0.12, 0), k1 = ringAt(-HALF - 0.11, KH), k2 = ringAt(-HALF, bankY(-HALF));
  band(main, k0, k1, RED, inward, kerb);
  band(main, k1, k2, RED, () => UP, kerb);
  // Glowing ice edge line on the infield side of the inner kerb (reads at hero scale).
  strip(glow, ringAt(-HALF - 0.16, 0.004), ringAt(-HALF - 0.12, 0.004), () => ICE[0]);
  // Track strips; strip 2 is the center line (white dashes on even segments, in the paint soup).
  const offs = [-HALF, -0.18, -0.045, 0.045, 0.18, HALF], rings = offs.map((o) => ringAt(o, bankY(o)));
  for (let k = 0; k < 5; k++) {
    const start = (i) => i === START || i === START + 1;
    const white = (i) => (start(i) ? (k + i) % 2 === 0 : k === 2 && i % 2 === 0);
    const dark = (i) => (start(i) ? TRACK2[2] : (k % 2 ? TRACK : TRACK2)[1]);
    strip(main, rings[k], rings[k + 1], (i) => (white(i) ? null : dark(i)));
    strip(paint, rings[k], rings[k + 1], (i) => (white(i) ? WHITE[0] : null));
  }
  return rings[5];
}

// Outer kerb rises off the banked edge, then a white barrier with a red top, then the ice berm.
function outerEdge(edge) {
  const k1 = ringAt(HALF + 0.07, TOP + KH), b0 = ringAt(HALF + 0.075, TOP + KH + 0.07);
  const b1 = ringAt(HALF + 0.115, TOP + KH + 0.07), b2 = ringAt(HALF + 0.125, TOP + KH + 0.03);
  band(main, edge, k1, RED, () => UP, kerb);
  band(main, k1, b0, WHITE, inward);
  band(main, b0, b1, RED, () => UP);
  band(main, b1, b2, WHITE, out);
  const foot = ringAt(FOOT, 0);
  band(wall, b2, foot, ICE, out, (i) => (i % 4 < 2 ? ICE : BERM2));
  return foot;
}

// Narrow ice apron from the berm foot to a flat rim edge (a raised lip folded into slivers at the ends),
// in ice and mint facet pairs;
// returns the rim ring for the underside.
function apron(foot) {
  const at = (t, y) => Array.from({ length: N }, (_, i) => apronPt(i / N, t, y));
  const mid = at(0.5, 0), inner = at(0.88, 0), rim = at(1, 0);
  const pick = (k) => (i) => (Math.floor((i + k) / 2) % 2 ? APRON2 : APRON)[1];
  strip(main, foot, mid, pick(0));
  strip(main, mid, inner, pick(1));
  band(main, inner, rim, SNOW, out);
  return rim;
}

export function buildTop() {
  infield();
  return apron(outerEdge(track()));
}
