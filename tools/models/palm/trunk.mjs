// Curved faceted trunk: stacked seven-sided segments, each flaring into a light sand ridge shelf,
// rising from a coral root flare, leaning out and curving back to vertical under a crown collar and bulb.
import { TRUNK, RIDGE, ROOT, COLLAR, MINT_RING, BULB } from "./palette.mjs";
import { wood, leaves, nuts, band, fan, ringAround, ball, rr, V } from "./shared.mjs";

export const BASE_Y = 0.24, H = 2.45, SEGS = 9, SIDES = 7;
const LEAN = V(0.99, 0, 0.14), BEND = 0.7;
// Spine point and tangent at t in [0, 1]: leans out early, vertical at the top.
export const spine = (t) => V(LEAN.x * BEND * (2 * t - t * t), BASE_Y + H * t, LEAN.z * BEND * (2 * t - t * t));
const tangent = (t) => V(LEAN.x * BEND * (2 - 2 * t), H, LEAN.z * BEND * (2 - 2 * t));
const radius = (t) => 0.2 - 0.075 * t;
export const TOP = spine(1);
export const BULB_C = V(TOP.x, TOP.y + 0.44, TOP.z);

const outFrom = (t) => (p) => V().subVectors(p, spine(t));
const ringT = (t, s, jit) => ringAround(spine(t), tangent(t), radius(t) * s, SIDES, 0.5, jit);

export function buildTrunk() {
  // Root flare buried in the sand.
  const jit0 = Array.from({ length: SIDES }, () => rr(0.9, 1.1));
  const root = ringAround(V(0, BASE_Y - 0.12, 0), V(0, 1, 0), 0.34, SIDES, 0.5, jit0);
  let prev = ringT(0.03, 0.95, null);
  band(wood, root, prev, ROOT, outFrom(0));
  for (let i = 0; i < SEGS; i++) {
    const t0 = 0.03 + (i / SEGS) * 0.97, dt = 0.97 / SEGS, jit = Array.from({ length: SIDES }, () => rr(0.94, 1.06));
    const body = ringT(t0 + dt * 0.7, 1.04, jit), lip = ringT(t0 + dt * 0.86, 1.2, jit);
    const next = ringT(t0 + dt, 0.9, null);
    band(wood, prev, body, TRUNK, outFrom(t0 + dt * 0.4));
    band(wood, body, lip, TRUNK, outFrom(t0 + dt * 0.8));
    band(wood, lip, next, RIDGE, (p) => outFrom(t0 + dt)(p).add(V(0, 0.15, 0)));
    prev = next;
  }
  // Crown hub: a light-green collar flaring up from the last ridge, a mint ring where the fronds
  // attach, and a small sun-yellow bulb (smaller than the coconuts) on top.
  const mid = ringAround(V(TOP.x, TOP.y + 0.18, TOP.z), V(0, 1, 0), 0.15, SIDES, 0.5);
  const lip = ringAround(V(TOP.x, TOP.y + 0.32, TOP.z), V(0, 1, 0), 0.2, SIDES, 0);
  band(leaves, prev, mid, COLLAR, outFrom(1));
  band(leaves, mid, lip, COLLAR, outFrom(1), (i) => (i % 2 ? COLLAR : [COLLAR[0], COLLAR[0], COLLAR[1]]));
  const ring = ringAround(V(TOP.x, TOP.y + 0.42, TOP.z), V(0, 1, 0), 0.14, SIDES, 0.5);
  band(leaves, lip, ring, MINT_RING, (p) => outFrom(1)(p).add(V(0, 0.2, 0)));
  fan(leaves, ring, V(TOP.x, TOP.y + 0.44, TOP.z), MINT_RING, () => V(0, 1, 0));
  ball(nuts, BULB_C, 0.1, BULB, 1.2);
}
