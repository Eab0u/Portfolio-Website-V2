// Ornaments: big faceted baubles (coral, garnet, violet, two glowing sun) hanging under branch tips that face the
// four preview views, each with an off-white cap and a short hanger, plus a glowing sun star on the spire.
import { BAUBLE_SUN, BAUBLE_CORAL, BAUBLE_GARNET, BAUBLE_VIOLET, CAP, STAR } from "./palette.mjs";
import { decor, glow, band, fan, ball, ringAround, V, UP } from "./shared.mjs";
import { TIPS, SPIRE_TOP } from "./tiers.mjs";

// [tier, target azimuth deg, radius]. Views look from 53, 143, 233 and 323 deg.
const PICKS = [[0, 60, 0.17], [0, 235, 0.17], [0, 320, 0.16], [0, 150, 0.16], [1, 110, 0.14], [1, 280, 0.14],
  [1, 20, 0.13], [2, 190, 0.12], [2, 50, 0.12]];
// Mostly coral, garnet and violet; only two glowing sun baubles.
const COLORS = [BAUBLE_CORAL, BAUBLE_VIOLET, BAUBLE_GARNET, BAUBLE_SUN, BAUBLE_CORAL, BAUBLE_VIOLET, BAUBLE_GARNET, BAUBLE_SUN, BAUBLE_CORAL];
const angDist = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

function bauble(tip, r, set) {
  const top = tip.clone().add(V(0, -0.05, 0)), c = top.clone().add(V(0, -0.07 - r, 0));
  ball(set === BAUBLE_SUN ? glow : decor, c, r, set, 1.05);
  const out = (p) => V().subVectors(p, c);
  const cap0 = ringAround(c.clone().add(V(0, r * 0.82, 0)), UP, r * 0.5, 6, 0.5);
  const cap1 = ringAround(c.clone().add(V(0, r * 1.12, 0)), UP, r * 0.42, 6, 0.5);
  band(decor, cap0, cap1, CAP, out);
  fan(decor, cap1, c.clone().add(V(0, r * 1.18, 0)), CAP, () => UP);
  // Hanger: a thin three-sided off-white stalk up to the branch tip.
  const h = ringAround(c.clone().add(V(0, r * 1.1, 0)), UP, 0.016, 3, 0);
  fan(decor, h, top.clone().add(V(0, 0.04, 0)), CAP, out);
}

function star(c, r) {
  // Six-point faceted star facing between views 0 and 3: a ring alternating long and short
  // points in the plane of `side` and up, coned to a front and a back apex.
  const n = V(1, 0, 0.15).normalize(), side = V().crossVectors(UP, n).normalize();
  const pts = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 2, rad = i % 2 ? r * 0.45 : r;
    return c.clone().addScaledVector(side, Math.cos(a) * rad).addScaledVector(UP, Math.sin(a) * rad);
  });
  [1, -1].forEach((sg) => fan(glow, pts, c.clone().addScaledVector(n, sg * r * 0.4), STAR, (p) => V().subVectors(p, c).addScaledVector(n, sg)));
}

export function buildOrnaments() {
  const used = new Set();
  PICKS.forEach(([ti, deg, r], i) => {
    const target = (deg * Math.PI) / 180;
    let best = null;
    for (const t of TIPS) if (t.tier === ti && !used.has(t) && (!best || angDist(t.a, target) < angDist(best.a, target))) best = t;
    used.add(best);
    bauble(best.p, r, COLORS[i]);
  });
  star(SPIRE_TOP.clone().add(V(0, 0.2, 0)), 0.26);
}
