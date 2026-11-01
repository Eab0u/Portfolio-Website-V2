// Crystal cluster color sets: three deliberate value steps (light, mid, dark) per family.
// Lit sides get a slight warm sun tint; shadow steps stay lifted (blue-teal, mid violet).
// Neighbor mint sits a notch deeper than the core so the core pops by contrast.
import { P, C, mix } from "../lib/palette.mjs";

const warm = (hex) => C(hex).lerp(C(P.sun), 0.06);
export const MINT = [warm("#6fe0b8"), C("#4fcfa6"), C("#42bfae")];
export const VIOLET = [warm("#a07cff"), C(P.violet), C("#6e4ce6")];
// Band trims and bevels: coral, sun and ice veins, plus a brighter step of each body color.
export const RING = {
  mint: [C("#a8f5dd"), C(P.mint), C("#4fcfa6")],
  violet: [C("#d2bcff"), C("#b99cff"), C(P.violet)],
  coral: [mix(P.coral, P.sun, 0.3), C(P.coral), mix(P.coral, P.garnet, 0.3)],
  sun: [mix(P.sun, P.white, 0.3), C(P.sun), mix(P.sun, P.coral, 0.4)],
  ice: [mix(P.ice, P.white, 0.3), C(P.ice), mix(P.ice, P.blue, 0.2)],
  core: [C("#a8f5dd"), C(P.mint), C("#5fe0b4")],
};
export const GRASS = [mix(P.grass, P.sun, 0.2), C(P.grass), mix(P.grass, P.blue, 0.3).multiplyScalar(0.8)];
// Rock rim: one blue-violet family, with an off-white trim on the chamfered top edge.
export const ROCK = [C("#6a58d0"), C("#5a4cb8"), C("#4a3d9e")];
export const EDGE = [C(P.white), mix(P.white, P.violet, 0.15), mix(P.white, P.violet, 0.3)];
// Sand pushed toward sun on lit facets; warm coral-sand where crystals meet the ground.
export const SAND = [mix(P.sand, P.sun, 0.35), mix(P.sand, P.sun, 0.1), mix(P.sand, P.coral, 0.3)];
export const CONTACT = [mix(P.sand, P.coral, 0.45), mix(P.sand, P.coral, 0.6), mix(P.coral, P.garnet, 0.2)];
// Glowing core: saturated mint body, hot near-white upper facets, ice inner shards.
export const CORE = [C("#9ff7d8"), C(P.mint), C("#62e0b6")];
export const CORE_TOP = [C("#d8fdf0"), C("#a8f5dd"), C(P.mint)];
export const CORE_ICE = [mix(P.ice, P.white, 0.25), C(P.ice), mix(P.ice, P.mint, 0.3)];
// Collar petals around the core's foot.
export const COLLAR = [C(P.mint), C("#4fcfa6"), C("#42bfae")];
