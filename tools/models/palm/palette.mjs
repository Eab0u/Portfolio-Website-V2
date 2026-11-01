// Palm color sets: three value steps (light, mid, dark) per family, all derived from palette tokens.
// Lit steps stay saturated and warm. Shadow steps drop in value and lean toward garnet, violet or
// blue instead of grey; greens stay pure green in shadow (the ice fill light adds the cool lean).
import { P, C, mix, steps } from "../lib/palette.mjs";

// Light step leans to sun, dark step keeps the hue at lower value.
const tone = (mid, k = 0.72) => [C(mid).lerp(C(P.sun), 0.18).multiplyScalar(1.12), C(mid), C(mid).multiplyScalar(k)];

// Trunk: sun-orange lit side, coral mid, saturated garnet-violet shadow; sand-yellow ridge shelves.
export const TRUNK = [mix(P.sun, P.coral, 0.35), mix(P.coral, P.sun, 0.2), mix(P.garnet, P.coral, 0.3).lerp(C(P.violet), 0.1)];
export const RIDGE = [mix(P.sun, P.white, 0.45), mix(P.sun, P.sand, 0.5), mix(P.sun, P.coral, 0.45)];
export const ROOT = [mix(P.coral, P.sand, 0.3), C(P.coral), mix(P.coral, P.garnet, 0.6)];
// Fronds in three values (yellow-green, grass, deep green). Each frond's two fold halves use a
// lighter and a deeper version of its set; cross bands alternate with a small value lift.
const FROND_MIDS = [mix(P.grass, P.sun, 0.3), C(P.grass), C(P.grass).multiplyScalar(0.74)];
export const FRONDS = FROND_MIDS.map((m) => tone(m));
export const HALF_LIGHT = FRONDS.map(([l, m]) => [l, mix(l, m, 0.5), m]);
export const HALF_DEEP = FRONDS.map(([l, m, d]) => [mix(l, m, 0.5), m, mix(m, d, 0.6)]);
export const bandLift = (set) => set.map((c) => c.clone().multiplyScalar(1.1));
// Undersides and leaf edges: frond mid into a navy-teal shadow, so the crown's underside never goes black.
const TEAL = mix(P.grass, P.navy, 0.45);
export const UNDER = FRONDS.map(([, m, d]) => [m, mix(d, TEAL, 0.4), mix(d, TEAL, 0.75)]);
// Bevel highlight strips on the fold and leaf rims (off-white green, like the crystal bands).
const RIM_HI = mix(mix(P.grass, P.sun, 0.45), P.white, 0.45);
export const RIM = [RIM_HI, mix(RIM_HI, P.grass, 0.3), mix(RIM_HI, P.grass, 0.6)];
// Midrib: chamfered sand strip (off-white on its lit bevel).
export const RIB = [mix(P.sand, P.white, 0.35), mix(P.sand, P.sun, 0.35), mix(P.sand, P.coral, 0.4)];
// Crown: sun-yellow bulb on a light-green frond-base collar.
export const BULB = [mix(P.sun, P.white, 0.3), C(P.sun), mix(P.sun, P.coral, 0.35)];
export const COLLAR = tone(mix(P.grass, P.sun, 0.25), 0.8);
export const MINT_RING = [mix(P.mint, P.white, 0.3), C(P.mint), mix(P.mint, P.grass, 0.4)];
// Coconuts: sun-yellow with a coral underside, dark-green caps and stems.
export const NUT = [mix(P.sun, P.white, 0.2), mix(P.sun, P.coral, 0.15), C(P.coral)];
export const STEM = tone(C(P.grass).multiplyScalar(0.5), 0.75);
export const NUT_BEVEL = [mix(P.sun, P.white, 0.6), mix(P.sun, P.white, 0.4), C(P.sun)];
// Ground: sand pushed toward sun, off-white foam with an ice tint, blue lagoon with ice ripples.
export const SAND = [mix(P.sand, P.sun, 0.3), mix(P.sand, P.coral, 0.1), mix(P.sand, P.coral, 0.55)];
export const SAND_ALT = [mix(P.sand, P.sun, 0.45), mix(P.sand, P.coral, 0.22), mix(P.coral, P.sand, 0.4)];
export const FOAM = [C(P.white), mix(P.white, P.ice, 0.15), mix(P.white, P.ice, 0.35)];
export const WATER = [mix(P.ice, P.blue, 0.55), mix(P.blue, P.ice, 0.15), mix(P.blue, P.violet, 0.35)];
export const WATER_ALT = [mix(P.ice, P.white, 0.1), mix(P.ice, P.blue, 0.4), mix(P.blue, P.violet, 0.2)];
export const DEEP = [mix(P.blue, P.violet, 0.2), mix(P.blue, P.violet, 0.4), mix(P.violet, P.navy, 0.4)];
export const VIOLET = steps(P.violet);
export const GRASS = tone(P.grass, 0.65);
export const STAR = [mix(P.coral, P.sun, 0.3), C(P.coral), mix(P.coral, P.garnet, 0.5)];
