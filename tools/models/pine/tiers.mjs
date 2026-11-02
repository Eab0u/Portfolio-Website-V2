// Four faceted tiers, each built from drooping branches rather than a smooth skirt: long branch
// points alternate with short notches, every branch has a raised ridge with a lit half and a deeper
// half, and tips droop by different amounts. Each tier steps in hard from the one below, flares at
// its hem and has a dark underside band. Colors go blue-green, grass, grass-mint, mint from the
// bottom up; ice frost caps only the sun-facing branch tips. The top tier tapers into a spire.
import { TIER, TIER_ALT, UNDER, FROST, SPIRE, BARK, BARK_ALT } from "./palette.mjs";
import { needles, frost, bark, quad, band, fan, ringAround, rr, V, UP } from "./shared.mjs";
import { SUN } from "../lib/soup.mjs";

// Per tier: [collar y, collar r, hem y, radius, branches, phase deg, droop].
const TIERS = [[2.05, 0.2, 1.42, 1.38, 10, 8, 0.12], [2.6, 0.16, 1.98, 1.02, 8, 30, 0.12],
  [3.08, 0.12, 2.5, 0.74, 7, 2, 0.1], [3.5, 0.06, 2.95, 0.48, 6, 22, 0.08]];
const SUN_AZ = Math.atan2(SUN.z, SUN.x);
const angDist = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
const FR = [0, 0.3, 0.6, 0.82, 1];
export const TIPS = [];
export let SPIRE_TOP = V();

function tier([cy, cr, hy, R, n, ph, droop], ti) {
  const cx = rr(-0.05, 0.05), cz = rr(-0.05, 0.05), cols = 2 * n, rows = FR.map(() => []);
  const axis = (y) => V(cx * (y - cy) / (hy - cy), y, cz * (y - cy) / (hy - cy));
  for (let j = 0; j < cols; j++) {
    const pt = j % 2 === 0, a = ((ph + (j / cols) * 360) * Math.PI) / 180 + (pt ? rr(-0.09, 0.09) : 0);
    const len = pt ? R * rr(0.9, 1.1) : R * rr(0.56, 0.64), dr = pt ? droop * rr(0.6, 1.3) : 0;
    const dir = V(Math.cos(a), 0, Math.sin(a));
    FR.forEach((t, k) => {
      const r = cr + (len - cr) * t, ridge = pt ? 0.1 * Math.sin(Math.PI * t) * R : -0.02 * t;
      const y = cy + (hy - cy) * Math.pow(t, 0.6) + ridge - dr * t * t * t + (pt ? 0 : 0.1 * t);
      rows[k].push(axis(y).addScaledVector(dir, r));
    });
    if (pt) TIPS.push({ p: rows[FR.length - 1][j].clone(), a, tier: ti });
  }
  const set = TIER[ti], alt = TIER_ALT[ti], under = UNDER[ti], c0 = axis(cy);
  const outOf = (p) => V().subVectors(p, axis(p.y)).add(V(0, 0.45, 0));
  for (let k = 0; k < FR.length - 1; k++) {
    for (let j = 0; j < cols; j++) {
      const j1 = (j + 1) % cols, a0 = rows[k][j], a1 = rows[k][j1], b0 = rows[k + 1][j], b1 = rows[k + 1][j1];
      const half = j % 2 ? alt : set;
      [[a0, a1, b1], [a0, b1, b0]].forEach(([p, q, r]) => {
        const cen = V().add(p).add(q).add(r).divideScalar(3), f = Math.hypot(cen.x - c0.x, cen.z - c0.z) / R;
        const ice = f > 0.8 && angDist(Math.atan2(cen.z - c0.z, cen.x - c0.x), SUN_AZ) < 0.95;
        (ice ? frost : needles).lit(p, q, r, ice ? FROST : half, outOf(cen));
      });
    }
  }
  fan(needles, rows[0], c0.clone().add(V(0, 0.03, 0)), set, () => UP);
  // Thickness: an edge band under the hem, then the underside closing to the trunk.
  const hem = rows[FR.length - 1], th = 0.12;
  const low = hem.map((p) => p.clone().add(V(0, -th, 0))), inner = ringAround(axis(hy + 0.18), UP, 0.3 * R, cols, 0);
  for (let j = 0; j < cols; j++) {
    const j1 = (j + 1) % cols, o = V().subVectors(hem[j], c0).setY(0);
    quad(needles, hem[j], hem[j1], low[j1], low[j], under, o);
  }
  band(needles, low, inner, under, () => V(0, -1, 0));
  fan(needles, inner, axis(hy + 0.36), under, () => V(0, -1, 0));
}

function trunk() {
  // A sturdy seven-sided trunk in coral and garnet facets, tall enough to show under the bottom tier.
  const r0 = ringAround(V(0, 0.44, 0), UP, 0.26, 7, 0.5), r1 = ringAround(V(0, 1.05, 0), UP, 0.2, 7, 0);
  const r2 = ringAround(V(0, 1.9, 0), UP, 0.15, 7, 0.5);
  const out = (p) => V(p.x, 0, p.z), pick = (i) => (i % 2 ? BARK_ALT : BARK);
  band(bark, r0, r1, BARK, out, pick);
  band(bark, r1, r2, BARK, out, pick);
  // Four root wedges spreading over the soil.
  [40, 130, 215, 300].forEach((deg) => {
    const a = (deg * Math.PI) / 180, d = V(Math.cos(a), 0, Math.sin(a)), s = V(-d.z, 0, d.x);
    const top = V(0, 0.78, 0).addScaledVector(d, 0.16), tip = V(0, 0.46, 0).addScaledVector(d, 0.52);
    const l = V(0, 0.46, 0).addScaledVector(d, 0.16).addScaledVector(s, 0.11), r = l.clone().addScaledVector(s, -0.22);
    bark.lit(top, l, tip, BARK, s.clone().add(V(0, 0.5, 0)));
    bark.lit(top, tip, r, BARK, s.clone().negate().add(V(0, 0.5, 0)));
  });
}

export function buildTiers() {
  trunk();
  TIERS.forEach((t, i) => tier(t, i));
  // Spire: a five-sided tapered tip rising from the top tier, frost on its point.
  const t = TIERS[3], base = ringAround(V(0, t[0] - 0.08, 0), UP, 0.12, 5, 0.3);
  const midR = ringAround(V(0.01, t[0] + 0.18, 0.01), UP, 0.07, 5, 0.3);
  SPIRE_TOP = V(0.02, t[0] + 0.42, 0.02);
  band(needles, base, midR, SPIRE, (p) => V(p.x, 0.3, p.z));
  fan(frost, midR, SPIRE_TOP, FROST, (p) => V(p.x, 0.3, p.z));
}
