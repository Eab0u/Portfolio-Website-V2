// Racing island color sets: [light, mid, shadow] from ramp() on palette tokens, so shadows stay
// hue-shifted and saturated. RACING is the `racing` token from src/lib/palette.ts (a mood hue, no livery).
import { P, C, mix } from "../lib/palette.mjs";
import { ramp } from "../lib/shade.mjs";
export { P, C, mix };

export const RACING = "#ff2e3d";
const set = (c) => { const r = ramp(c); return [r.light, r.mid, r.shadow]; };

// Top: a saturated ice apron with mint facet steps (pale albedo greys out under the scene lights),
// an ice berm, a deep blue track, a mint-grass infield in mowing stripes.
export const APRON = set(mix(P.ice, P.blue, 0.32));
export const APRON2 = set(mix(P.ice, P.mint, 0.55));
// The ice wall (berm, rim bevel, cliff band) is ONE mid-ice family (about #6eafef): a warm light step,
// the mid, and a violet-leaning shade step, so it reads as one material from every angle.
const WALL_MID = mix(P.ice, P.blue, 0.35).lerp(C(P.navy), 0.08);
// The lit step leans mint at the same value (a value lift washes out under the sun light).
const wall = (m) => [mix(m, P.mint, 0.22), m, ramp(mix(m, P.violet, 0.35)).mid];
export const ICE = wall(WALL_MID);
export const BERM2 = wall(mix(WALL_MID, P.ice, 0.3));
export const SNOW = ICE;
export const SNOW2 = ICE;
// Track: a violet-leaning dark blue, one step lighter than the ice wall's shade so it reads as a ring.
export const TRACK = set(mix(P.blue, P.violet, 0.4).lerp(C(P.navy), 0.36));
export const TRACK2 = set(mix(P.blue, P.violet, 0.4).lerp(C(P.navy), 0.48));
export const INFIELD = set(mix(P.grass, P.mint, 0.3));
export const INFIELD2 = set(mix(P.grass, P.mint, 0.65));
// Kerbs, barriers, buildings: racing red and off-white, with garnet and electric blue accents.
export const RED = set(RACING);
// Off-white lit faces with ice and ice-blue shade steps (ramp mids), so shaded walls land blue, not khaki.
export const WHITE = [C(P.white), ramp(mix(P.ice, P.white, 0.3)).mid, ramp(mix(P.ice, P.blue, 0.3)).mid];
// Structures: a warm sand-cream that holds its hue when lit, with a saturated periwinkle shade step
// (a pale lavender shade drifts to grey under the ice fill light).
const CREAM_MID = mix(P.sand, P.white, 0.25);
export const CREAM = [ramp(CREAM_MID).light, CREAM_MID, ramp(mix(P.blue, P.ice, 0.45).lerp(C(P.violet), 0.15)).mid];
// Lamp housings: sun yellow, shading toward coral-orange (a plain yellow shadow goes olive).
export const SUNSET = [ramp(P.sun).light, C(P.sun), ramp(mix(P.sun, P.coral, 0.45)).mid];
export const BLUE = set(P.blue);
export const GARNET = set(P.garnet);
// Underside, matching the hub island family: ice cliff band, sand stone lip, violet strata, coral tip.
export const CLIFF = ICE;
export const STONE = set(mix(P.sand, P.coral, 0.25));
export const VHI = set(mix(P.violet, P.ice, 0.2));
export const VIOLET = set(P.violet);
// Spikes and tip are one coral: the shade step is the same coral hue, darker and a little less saturated
// (a ramp shadow of coral at full saturation turns red-orange, off palette).
const coralHsl = C(P.coral).getHSL({ h: 0, s: 0, l: 0 });
export const SPIKE = [ramp(P.coral).light, C(P.coral), C().setHSL(coralHsl.h, coralHsl.s * 0.9, coralHsl.l * 0.85)];
export const TIP = SPIKE;
// Glow: sun lamps and ice crystals (mint root to white point, like the hub's crystals).
export const SUN = C(P.sun);
export const CRYSTAL = [mix(P.ice, P.mint, 0.4), C(P.ice), mix(P.ice, P.white, 0.5)];
export const GLASS = set(mix(P.ice, P.mint, 0.25));
// Upward ledges catch ice light, as on the hub island.
export const HI = new Map([[VHI, ramp(P.ice).light], [VIOLET, ramp(P.ice).mid], [STONE, ramp(mix(P.sand, P.coral, 0.2)).light]]);
