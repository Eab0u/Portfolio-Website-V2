// Footballer color sets: [light, mid, shadow] from ramp() in tools/models/lib/shade.mjs, never hand-picked
// shadows. Electric blue shirt dominates, cream shorts and sand skin support, coral socks and headband
// tie the figure together, and the sun boot soles are the one glowing accent. Albedos are pre-compensated
// for the cool ice fill: blue nudged toward ice, sand toward coral, pale parts tinted cream.
import { P, C, mix } from "../lib/palette.mjs";
import { ramp } from "../lib/shade.mjs";

const set = (c) => { const r = ramp(c); return [r.light, r.mid, r.shadow]; };
// ramp() with its light step swapped for a given color (ramp's light step turns blue lavender).
const setLit = (c, light) => { const r = ramp(c); return [C(light), r.mid, r.shadow]; };

// Shirt: blue nudged toward ice so the fill does not push it to indigo; side panels a lighter ice blue.
export const SHIRT = setLit(mix(P.blue, P.ice, 0.08), mix(P.blue, P.ice, 0.35));
export const PANEL = setLit(mix(P.blue, P.ice, 0.4), mix(P.ice, P.blue, 0.3));
// Off-white for shorts, collar, cuffs and sock bands: off-white in the sun and a light cream-lilac mid
// and shade, kept two value steps above the skin (a sand mid merged with the thighs into one tan mass).
const pale = (warm) => [mix(P.white, P.sun, warm), mix(P.white, P.violet, 0.05).lerp(C(P.sand), 0.2), mix(P.white, P.violet, 0.15).lerp(C(P.sand), 0.26)];
export const CREAM = pale(0);
export const CREAM_HEM = pale(0.12);
// Skin graded light -> mid -> slightly cooler dark, with a soft coral-rose only on underside planes
// (`under`). Dark and under live in the skin mesh's cool half (see SKIN_SUN).
export const SKIN = [ramp(mix(P.sand, P.coral, 0.18)).light, mix(P.sand, P.coral, 0.4), mix(P.sand, P.coral, 0.55).lerp(C(P.garnet), 0.08)];
// Warm coral-sand albedo: the ice fill under the limbs turns it coral-rose, not mauve.
SKIN.under = mix(P.coral, P.white, 0.2).lerp(C(P.garnet), 0.05).lerp(C(P.violet), 0.06);
// Socks: coral pre-shifted toward garnet-magenta in every step (plain coral lands brick under the fill).
export const SOCK = [mix(P.coral, P.garnet, 0.12).lerp(C(P.violet), 0.08).lerp(C(P.white), 0.1),
  mix(P.coral, P.garnet, 0.4).lerp(C(P.violet), 0.12), mix(P.garnet, P.coral, 0.12).lerp(C(P.violet), 0.07)];
// Headband: coral with a soft coral-pink shade, so no dark strip shows at the temple.
export const BAND = [mix(P.coral, P.white, 0.3), C(P.coral), mix(P.coral, P.garnet, 0.3)];
// Hair: saturated violet in light, deep blue-violet only in the darkest step; boots violet with coral toes.
export const HAIR = [mix(P.violet, P.white, 0.12), C(P.violet), C(P.violet).multiplyScalar(0.8)];
export const BOOT = set(mix(P.violet, P.navy, 0.3));
// Boot toe cap: a lighter violet, so each foot reads as three spots (pink sock, violet boot, sun sole).
export const BOOT_TOE = set(mix(P.violet, P.white, 0.2));
// Boot soles: the glowing sun accent.
export const SOLE = set(mix(P.sun, P.coral, 0.1));
// Grass base: three greens (light top, grass, deep skirt) and sun flowers.
export const GRASS_HI = set(mix(P.grass, P.sun, 0.3));
export const GRASS = set(C(P.grass));
// A low-contrast grass step for irregular turf patches.
export const GRASS_SOFT = set(mix(P.grass, P.sun, 0.12));
export const GRASS_DEEP = set(mix(P.grass, P.blue, 0.3).multiplyScalar(0.72));
export const FLOWER = set(C(P.sun));
// Shirt hem trim: a sun-yellow band with a lighter bevel row above it.
export const HEM = [mix(P.sun, P.white, 0.2), C(P.sun), mix(P.sun, P.coral, 0.35)];
export const HEM_BEVEL = [mix(P.sun, P.white, 0.5), mix(P.sun, P.white, 0.3), C(P.sun)];
// Sun steps of the pale sets: the cream mesh puts these faces in its warm half.
export const PALE_SUN = new Set([CREAM[0], CREAM_HEM[0]]);
// Light and mid skin steps go to the skin mesh's warm half, the rose shade to its cool half.
// Head skin: a narrow coral-sand ramp (no rose shade), so the face is not a patchwork; all warm half.
export const HEAD_SKIN = [mix(P.sand, P.coral, 0.3), mix(P.sand, P.coral, 0.38), mix(P.sand, P.coral, 0.48)];
// Cheek blush: a soft coral facet in the warm skin mesh.
export const BLUSH = Array(3).fill(mix(P.sand, P.coral, 0.62));
export const SKIN_SUN = new Set([SKIN[0], SKIN[1], ...HEAD_SKIN, BLUSH[0]]);
