// Referee-chair-only soups (one per material), the seeded random stream and the shared layout.
// Generic helpers come from tools/models/lib/.
import { setSeed, rr } from "../lib/rng.mjs";
import { V, Soup } from "../lib/soup.mjs";
import { band, fan } from "../lib/rings.mjs";
import { ringAround, ball } from "../lib/shapes.mjs";
import { extrude, rect, chamfer, circle } from "../lib/extrude.mjs";
import { CORAL, CORAL_TOP, SEAT, SEAT_TOP, SAND, SAND_TOP, SAND_ALT, SAND_ALT_TOP } from "./palette.mjs";
export { rr, V, band, fan, ringAround, ball, extrude, rect, chamfer, circle };

setSeed(20261103);
// Upward faces of the sand and the coral seat parts get a lighter top step, so the sun catches them.
export const ground = new Soup(new Map([[SAND, SAND_TOP], [SAND_ALT, SAND_ALT_TOP]]));
export const frame = new Soup();
export const cloth = new Soup(new Map([[CORAL, CORAL_TOP], [SEAT, SEAT_TOP]]));
export const trim = new Soup();
export const stripe = new Soup();
export const canopy = new Soup();
export const glow = new Soup();
export const UP = V(0, 1, 0);
export const Z = V(0, 0, 1);

// Layout: the ladder faces +z. Rear legs stand straight at z = REAR_Z and rise into the backrest posts;
// the front legs are the ladder rails, leaning back from FRONT_Z at the foot to the deck front.
export const LEG_X = 0.34, LEG_R = 0.055, REAR_Z = -0.4, FRONT_Z = 0.42, FOOT_Y = 0.07;
export const DECK_Y = 1.3, RAIL_Y = 1.8, POST_TOP = 2.04;
const SLOPE = -FRONT_Z / (DECK_Y - FOOT_Y);
// z of the ladder rails at height y (they pass z = 0 at deck height).
export const frontZ = (y) => FRONT_Z + (y - FOOT_Y) * SLOPE;
// Umbrella: the pole stands just outside the left rear post on two brackets; the canopy apex sits at CANOPY_Y.
export const POLE_X = -LEG_X - 0.125, POLE_Z = REAR_Z, CANOPY_Y = 2.98;

// Sand mound: a small round footing of radius MOUND_R, height by radius.
export const MOUND_R = 0.8;
// A chunky disc: flat light top, a light flat lip ring and bevel, then a steep skirt down to y = 0.
export const PROFILE = [[0, 0.16], [0.5, 0.155], [0.84, 0.15], [0.93, 0.15], [0.97, 0.11], [1.0, 0]];
export function sandY(x, z) {
  const r = Math.hypot(x, z) / MOUND_R;
  for (let i = 1; i < PROFILE.length; i++) {
    const [r0, y0] = PROFILE[i - 1], [r1, y1] = PROFILE[i];
    if (r <= r1) return y0 + ((r - r0) / (r1 - r0)) * (y1 - y0);
  }
  return 0;
}

// A round rod from a to b with n sides.
export const tube = (soup, a, b, r, set, opts = {}) => extrude(soup, a, b, circle(r, opts.n ?? 6), set, opts);
