// Pine color sets: three value steps (light, mid, dark) per family, all derived from palette tokens.
// Greens keep a green hue in shadow: the dark step is pulled toward sun before it drops in value,
// so the cool ice fill light cannot push the shaded side into teal.
import { P, C, mix } from "../lib/palette.mjs";

const green = (mid, lift = 0.3, k = 0.6) => {
  const m = C(mid);
  return [m.clone().lerp(C(P.sun), lift).multiplyScalar(1.1), m, m.clone().lerp(C(P.sun), 0.22).multiplyScalar(k)];
};
// Tier colors, bottom to top, each a clear hue step: blue-green that shades toward electric blue,
// true grass, grass-mint, light mint. Each tier has a lit half and a deeper half per branch so every
// branch reads as a folded ridge; dark steps keep their hue (no grey, no navy).
const darker = (set, k) => set.map((c) => c.clone().multiplyScalar(k));
export const TIER = [
  [mix(P.ice, P.grass, 0.35).lerp(C(P.blue), 0.15), mix(P.blue, P.grass, 0.45), mix(P.blue, P.violet, 0.15).multiplyScalar(0.8)],
  [mix(P.grass, P.sun, 0.2), C(P.grass), C(P.grass).lerp(C(P.sun), 0.15).multiplyScalar(0.62)],
  [mix(P.grass, P.mint, 0.5).lerp(C(P.white), 0.15), mix(P.grass, P.mint, 0.45), mix(P.grass, P.mint, 0.45).multiplyScalar(0.64)],
  [mix(P.mint, P.white, 0.35), C(P.mint), mix(P.mint, P.grass, 0.4).multiplyScalar(0.68)],
];
export const TIER_ALT = TIER.map((set) => darker(set, 0.84));
// Underside shadow band under every tier: the tier hue at low value.
export const UNDER = TIER.map(([, m, d]) => [m.clone().multiplyScalar(0.55), d.clone().multiplyScalar(0.7), d.clone().multiplyScalar(0.5)]);
// Frosted branch tips: off-white ice, deepening to electric blue on the shaded side.
export const FROST = [mix(P.ice, P.white, 0.3), C(P.ice), mix(P.ice, P.blue, 0.6)];
// Spire: light green with a frost point.
export const SPIRE = [mix(P.mint, P.white, 0.35), C(P.mint), mix(P.mint, P.grass, 0.4).multiplyScalar(0.68)];
// Round rock base: lavender stone, lit side toward off-white sand, shade toward navy-violet.
export const ROCK = [mix(P.violet, P.white, 0.3).lerp(C(P.sun), 0.06), C(P.violet), mix(P.violet, P.navy, 0.35)];
export const ROCK_ALT = [mix(P.violet, P.white, 0.4).lerp(C(P.sand), 0.12), mix(P.violet, P.blue, 0.3), mix(P.violet, P.navy, 0.5)];
export const RIM = [mix(P.violet, P.white, 0.55), mix(P.violet, P.white, 0.35), mix(P.violet, P.white, 0.1)];
// Soil: a warm needle bed of sand and coral.
export const SOIL = [mix(P.sand, P.sun, 0.25), mix(P.sand, P.coral, 0.25), mix(P.coral, P.garnet, 0.35)];
export const SOIL_ALT = [mix(P.sand, P.coral, 0.15), mix(P.coral, P.sand, 0.5), mix(P.coral, P.garnet, 0.5)];
// Bark: coral facets alternating with deeper coral-garnet facets.
export const BARK = [mix(P.coral, P.sun, 0.25), C(P.coral), mix(P.coral, P.garnet, 0.6)];
export const BARK_ALT = [C(P.coral), mix(P.coral, P.garnet, 0.5), C(P.garnet)];
// Ornaments: coral, garnet and violet baubles, two glowing sun ones, off-white caps; a sun star on the tip.
export const BAUBLE_SUN = [mix(P.sun, P.white, 0.35), C(P.sun), mix(P.sun, P.coral, 0.45)];
export const BAUBLE_CORAL = [mix(P.coral, P.white, 0.25), C(P.coral), mix(P.coral, P.garnet, 0.55)];
export const BAUBLE_GARNET = [mix(P.garnet, P.coral, 0.45), C(P.garnet), mix(P.garnet, P.violet, 0.35).multiplyScalar(0.8)];
export const BAUBLE_VIOLET = [mix(P.violet, P.white, 0.3), C(P.violet), mix(P.violet, P.navy, 0.3)];
export const CAP = [C(P.white), mix(P.white, P.sand, 0.3), mix(P.sand, P.coral, 0.3)];
export const STAR = [mix(P.sun, P.white, 0.25), C(P.sun), mix(P.sun, P.coral, 0.3)];
// Props: coral mushroom caps with off-white spots and stems, grass tufts.
export const MUSH = [mix(P.coral, P.sun, 0.25), C(P.coral), mix(P.coral, P.garnet, 0.5)];
export const STEM = [C(P.white), mix(P.white, P.sand, 0.4), mix(P.sand, P.coral, 0.35)];
export const TUFT = green(mix(P.grass, P.sun, 0.2));
