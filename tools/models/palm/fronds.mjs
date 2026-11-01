// Seven broad fronds fanning from the crown hub, each a different length and droop so the crown
// is not a dome. Each frond is a thick folded blade: a V-fold along a chamfered sand midrib, a
// lighter and a deeper half, alternating cross bands, off-white-green bevel strips on the fold and
// rims, serrated leaflet edges with real thickness, and a drooping, curled-under tip.
import { HALF_LIGHT, HALF_DEEP, UNDER, RIB, RIM, bandLift } from "./palette.mjs";
import { leaves, V } from "./shared.mjs";
import { BULB_C } from "./trunk.mjs";

const S = 12, UP = V(0, 1, 0), DOWN = V(0, -1, 0);
const quad = (a, b, c, d, set, out) => { leaves.lit(a, b, c, set, out); leaves.lit(a, c, d, set, out); };
const toward = (a, b, d) => a.clone().lerp(b, Math.min(0.35, d / Math.max(a.distanceTo(b), 1e-6)));

function frond(a, len, rise, droop, wide, v) {
  const dir = V(Math.cos(a), 0, Math.sin(a)), side = V().crossVectors(UP, dir).normalize();
  const root = BULB_C.clone().addScaledVector(dir, 0.08).addScaledVector(UP, -0.03);
  // Rises, droops, then the last stretch curls further under.
  const rib = (s) => root.clone().addScaledVector(dir, len * s * (1 - 0.18 * s ** 4))
    .addScaledVector(UP, rise * s - droop * s * s - 0.35 * s ** 5);
  // Wide from the start so neighbouring frond bases overlap into a closed crown.
  const width = (s) => Math.max(wide * Math.sin(Math.PI * Math.pow(s, 0.9)), s < 0.9 ? 0.08 : 0);
  const R = [], Rb = [], E = [[], []], Eb = [[], []], W = [];
  for (let j = 0; j <= S; j++) {
    const s = j / S, w = width(s) * (j % 2 ? 1.08 : 0.8), p = rib(s), drop = 0.45 * w + 0.15 * s * w;
    const th = 0.045 * (1 - 0.6 * s);
    R.push(p); Rb.push(p.clone().addScaledVector(UP, -th)); W.push(w);
    [1, -1].forEach((sg, k) => {
      const e = p.clone().addScaledVector(side, sg * w).addScaledVector(UP, -drop);
      E[k].push(e); Eb[k].push(e.clone().addScaledVector(UP, -th * 0.7));
    });
  }
  [HALF_LIGHT[v], HALF_DEEP[v]].forEach((half, k) => {
    // Each half: fold bevel strip, body, rim bevel strip (coplanar splits, no overlap).
    const Fi = R.map((r, j) => toward(r, E[k][j], 0.045)), Ri = R.map((r, j) => toward(E[k][j], r, 0.026));
    for (let j = 0; j < S; j++) {
      const top = j % 2 ? bandLift(half) : half, o = V().subVectors(E[k][j + 1], R[j + 1]);
      quad(R[j], R[j + 1], Fi[j + 1], Fi[j], RIM, UP);
      quad(Fi[j], Fi[j + 1], Ri[j + 1], Ri[j], top, UP);
      quad(Ri[j], Ri[j + 1], E[k][j + 1], E[k][j], RIM, UP);
      quad(Rb[j], Rb[j + 1], Eb[k][j + 1], Eb[k][j], UNDER[v], DOWN);
      quad(E[k][j], E[k][j + 1], Eb[k][j + 1], Eb[k][j], UNDER[v], o);
    }
  });
  // Midrib: a low chamfered strip (flat top, two bevels) along the fold, tapering with the blade.
  // It starts past the hub so back fronds show no rib slivers above the crown.
  const strip = (j) => {
    const k = Math.min(0.036 * (1 - 0.5 * (j / S)), 0.45 * W[j] + 0.012);
    const at = (o, y) => R[j].clone().addScaledVector(side, o).addScaledVector(UP, y);
    return [at(k * 1.7, 0.002), at(k * 0.6, 0.009), at(-k * 0.6, 0.009), at(-k * 1.7, 0.002)];
  };
  for (let j = 1; j < S - 1; j++) {
    const a0 = strip(j), a1 = strip(j + 1);
    for (let i = 0; i < 3; i++) quad(a0[i], a1[i], a1[i + 1], a0[i + 1], RIB, UP);
  }
}

// Fronds sit between the four preview view directions (53, 143, 233, 323 deg) so none hides the
// crown head-on. Per frond: [azimuth deg, length, rise, droop, width].
const FRONDS = [[345, 1.75, 0.8, 1.6, 0.4], [30, 1.3, 1.05, 1.35, 0.36], [78, 1.65, 0.7, 1.75, 0.42],
  [118, 1.4, 0.95, 1.4, 0.38], [168, 1.8, 0.75, 1.7, 0.42], [208, 1.25, 1.1, 1.3, 0.35], [278, 1.6, 0.85, 1.8, 0.4]];

export function buildFronds() {
  FRONDS.forEach(([deg, len, rise, droop, wide], i) => frond((deg * Math.PI) / 180, len, rise, droop, wide, i % 3));
}
