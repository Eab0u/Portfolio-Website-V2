// Volleyball net color sets: three value steps (light, mid, dark) per family, all from palette tokens.
// Blue posts dominate, the mint and ice net and coral tapes support, the sun caps are the one glowing
// accent. Lit steps stay pure; only the darkest steps lean garnet or violet, never grey or brown.
import { P, C, mix } from "../lib/palette.mjs";

// Posts: electric blue with an ice-lifted lit side and a violet-navy shadow.
export const POST = [mix(P.blue, P.ice, 0.4), mix(P.blue, P.ice, 0.1), mix(P.blue, P.violet, 0.4)];
export const POST_RING = [mix(P.ice, P.white, 0.4), C(P.ice), mix(P.ice, P.violet, 0.45)];
// Net: deep mint vertical strands; rows alternate light ice and mid mint so the values step.
export const NET = [mix(P.mint, P.white, 0.12), C(P.mint), mix(P.mint, P.grass, 0.35).multiplyScalar(0.85)];
export const ROW_ICE = [mix(P.ice, P.white, 0.4), C(P.ice), mix(P.ice, P.mint, 0.3)];
export const ROW_MINT = [mix(P.mint, P.white, 0.4), mix(P.mint, P.white, 0.18), C(P.mint)];
// Off-white trim (top tape, cords, antenna bands): pure off-white, shading warm toward sand so the cool
// fill light never turns it grey.
export const TRIM = [C(P.white), mix(P.white, P.sand, 0.1), mix(P.white, P.sand, 0.3)];
// Garnet: the bottom cable and the tape edge line.
export const GARNET = [mix(P.garnet, P.coral, 0.35), C(P.garnet), mix(P.garnet, P.navy, 0.3)];
// Coral: bright lit side, coral mid, garnet shade (side tapes, clamps, stakes, crank).
export const CORAL = [mix(P.coral, P.sun, 0.25), C(P.coral), mix(P.coral, P.garnet, 0.6)];
export const CORAL_LIP = [mix(P.coral, P.white, 0.5), mix(P.coral, P.sun, 0.2), C(P.coral)];
// Sun yellow: glowing caps and collar bands, and the same set unlit for the winch drum and bolts.
export const SUN = [mix(P.sun, P.white, 0.35), C(P.sun), mix(P.sun, P.coral, 0.4)];
// Ground: warm sand facets, a coral-garnet skirt, light ripples, pebbles, grass, shell and starfish.
export const SAND = [mix(P.sand, P.sun, 0.3), mix(P.sand, P.coral, 0.1), mix(P.sand, P.coral, 0.5)];
export const SAND_ALT = [mix(P.sand, P.sun, 0.45), mix(P.sand, P.coral, 0.22), mix(P.coral, P.sand, 0.4)];
export const SKIRT = [mix(P.sand, P.coral, 0.35), mix(P.coral, P.sand, 0.45), mix(P.coral, P.garnet, 0.3)];
export const RIPPLE = [mix(P.sand, P.white, 0.4), mix(P.sand, P.coral, 0.3), mix(P.coral, P.sand, 0.45)];
export const LIP = [mix(P.sand, P.sun, 0.55), mix(P.sand, P.sun, 0.3), mix(P.coral, P.sand, 0.35)];
// Footings: light warm sand and off-white mound over a darker garnet-brown ring.
export const FOOT = [mix(P.sand, P.sun, 0.35), mix(P.sand, P.sun, 0.1), mix(P.sand, P.coral, 0.5)];
export const FOOT_RING = [mix(P.coral, P.sand, 0.4), mix(P.coral, P.garnet, 0.35), mix(P.garnet, P.coral, 0.3)];
export const PEBBLE = [mix(P.violet, P.white, 0.3), C(P.violet), mix(P.violet, P.navy, 0.35)];
export const GRASS = [mix(P.grass, P.sun, 0.25), C(P.grass), C(P.grass).multiplyScalar(0.68)];
export const SHELL = [mix(P.coral, P.white, 0.6), mix(P.coral, P.white, 0.35), mix(P.coral, P.violet, 0.35)];
export const STAR = [mix(P.coral, P.sun, 0.3), C(P.coral), mix(P.coral, P.garnet, 0.5)];
