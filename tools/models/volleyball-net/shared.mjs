// Volleyball-net-only soups (one per material), the seeded random stream and the shared layout.
// Generic helpers come from tools/models/lib/.
import { setSeed, rr } from "../lib/rng.mjs";
import { V, Soup } from "../lib/soup.mjs";
import { band, fan } from "../lib/rings.mjs";
import { ringAround, ball } from "../lib/shapes.mjs";
import { extrude, rect, chamfer, circle } from "../lib/extrude.mjs";
export { rr, V, band, fan, ringAround, ball, extrude, rect, chamfer, circle };

setSeed(20261105);
export const ground = new Soup();
export const posts = new Soup();
export const mesh = new Soup();
export const tape = new Soup();
export const glow = new Soup();
export const trim = new Soup();
export const UP = V(0, 1, 0);

// Layout: posts at x = +-POST_X on the long axis, net spans between them in the z = 0 plane.
export const POST_X = 1.32, POST_R = 0.075, POST_TOP = 2.08;
export const NET_X = 1.2, NET_BOT = 1.2, NET_TOP = 1.8, TAPE_H = 0.09;
// Catenary droop of the bottom cable: 0 at the posts, DROOP at the middle.
export const DROOP = 0.12;
const CA = 0.7, CL = Math.cosh(POST_X / CA);
export const droop = (x) => DROOP * Math.max(0, (CL - Math.cosh(x / CA)) / (CL - 1));
// Sand pad: an ellipse with semi-axes PAD_X by PAD_Z, height by elliptical radius.
export const PAD_X = 1.8, PAD_Z = 0.7;
const PROF = [[0, 0.23], [0.4, 0.22], [0.72, 0.2], [0.92, 0.17], [0.97, 0.14], [1.0, 0]];
export function sandY(x, z) {
  const r = Math.hypot(x / PAD_X, z / PAD_Z);
  for (let i = 1; i < PROF.length; i++) {
    const [r0, y0] = PROF[i - 1], [r1, y1] = PROF[i];
    if (r <= r1) return y0 + ((r - r0) / (r1 - r0)) * (y1 - y0);
  }
  return 0;
}
export const PROFILE = PROF;
