// Pine-only soups (one per material) and the seeded random stream. Generic helpers come from
// tools/models/lib/ (band and fan from rings.mjs, ringAround and ball from shapes.mjs).
import { setSeed, rr } from "../lib/rng.mjs";
import { V, Soup } from "../lib/soup.mjs";
import { band, fan } from "../lib/rings.mjs";
import { ringAround, ball } from "../lib/shapes.mjs";
export { rr, V, band, fan, ringAround, ball };

setSeed(20261104);
export const rock = new Soup();
export const bark = new Soup();
export const needles = new Soup();
export const frost = new Soup();
export const decor = new Soup();
export const glow = new Soup();
export const UP = V(0, 1, 0);
export const quad = (soup, a, b, c, d, set, out) => { soup.lit(a, b, c, set, out); soup.lit(a, c, d, set, out); };
