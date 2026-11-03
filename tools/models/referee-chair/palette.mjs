// Referee chair color sets: three value steps (light, mid, dark) per family, all from palette tokens.
// The electric blue frame dominates, coral and ice support (seat, backrest, rungs, umbrella stripes), and
// the sun caps are the one glowing accent. Mid steps are the true tokens; dark steps lean garnet or blue.
import { P, C, mix } from "../lib/palette.mjs";

// Frame: electric blue with an ice-lifted lit side and a deep blue shade.
export const FRAME = [mix(P.blue, P.ice, 0.4), mix(P.blue, P.ice, 0.1), mix(P.blue, P.navy, 0.3)];
// Coral: seat box, backrest, rungs, deck lip. A light garnet shade (the lights already darken the back);
// upward faces get CORAL_TOP.
export const CORAL = [mix(P.coral, P.sun, 0.18), C(P.coral), mix(P.coral, P.garnet, 0.18)];
export const CORAL_TOP = mix(P.coral, P.sun, 0.32);
// Seat body (seat box, backrest): true garnet sides so shade stays saturated, coral top bevels (SEAT_TOP).
export const SEAT = [mix(P.garnet, P.coral, 0.45), C(P.garnet), C(P.garnet).multiplyScalar(0.92)];
export const SEAT_TOP = C(P.coral);
// Canopy coral: true coral in the sun, garnet in shade, a darker garnet underside.
// Canopy shade: a violet-garnet (garnet lifted by coral with a touch of violet), never dusty brown.
const CORAL_SHADE = mix(P.garnet, P.coral, 0.25).lerp(C(P.violet), 0.08).multiplyScalar(0.88);
export const CANOPY_CORAL = [C(P.coral), mix(P.coral, P.garnet, 0.22), CORAL_SHADE];
export const CORAL_UNDER = [mix(P.coral, P.garnet, 0.2), mix(P.coral, P.garnet, 0.4), CORAL_SHADE];
export const CORAL_RIM = [mix(P.coral, P.white, 0.4), mix(P.coral, P.sun, 0.25), C(P.coral)];
// Ice: true ice in the sun, the shade pushed toward electric blue (never teal-grey).
const ICE_SHADE = mix(P.ice, P.blue, 0.6).multiplyScalar(0.95);
export const ICE = [mix(P.ice, P.white, 0.06), mix(P.ice, P.blue, 0.12), ICE_SHADE];
export const ICE_UNDER = [mix(P.ice, P.blue, 0.1), mix(P.ice, P.blue, 0.3), ICE_SHADE];
export const ICE_RIM = [mix(P.ice, P.white, 0.5), mix(P.ice, P.white, 0.25), C(P.ice)];
// Off-white trim (deck, leg bands, rails, pole, ribs): shading warm toward sand so the cool fill never greys it.
export const TRIM = [C(P.white), mix(P.white, P.sand, 0.15), mix(P.white, P.sand, 0.4)];
// Mint: the pole band and the whistle, one small cool accent.
export const MINT = [mix(P.mint, P.white, 0.25), C(P.mint), mix(P.mint, P.blue, 0.25)];
// Sun yellow: glowing finials, rung caps and bolts.
export const SUN = [mix(P.sun, P.white, 0.35), C(P.sun), mix(P.sun, P.coral, 0.4)];
// Ground: light sand top (SAND_TOP on upward faces), a light lip, a warm coral-sand skirt, props.
export const SAND = [mix(P.sand, P.sun, 0.15), C(P.sand), mix(P.sand, P.coral, 0.35)];
export const SAND_ALT = [mix(P.sand, P.sun, 0.28), mix(P.sand, P.sun, 0.12), mix(P.sand, P.coral, 0.42)];
export const SAND_TOP = mix(P.sand, P.sun, 0.1);
export const SAND_ALT_TOP = mix(P.sand, P.sun, 0.24);
// Lip bevel: a light sand strip on the top edge, warm in every step.
export const LIP = [mix(P.sand, P.white, 0.3), mix(P.sand, P.white, 0.12), mix(P.sand, P.coral, 0.15)];
// Skirt: light terracotta from sand and coral (the lights darken it to about #c9774f), never a brick ring.
export const SKIRT = [mix(P.sand, P.coral, 0.35), mix(P.sand, P.coral, 0.5), mix(P.coral, P.sand, 0.4)];
export const SKIRT_ALT = [mix(P.sand, P.coral, 0.28), mix(P.sand, P.coral, 0.42), mix(P.sand, P.coral, 0.52)];
export const GRASS = [mix(P.grass, P.sun, 0.25), C(P.grass), mix(P.grass, P.blue, 0.25)];
export const SHELL = [mix(P.coral, P.white, 0.6), mix(P.coral, P.white, 0.35), mix(P.coral, P.garnet, 0.3)];
export const STAR = [mix(P.coral, P.sun, 0.3), C(P.coral), mix(P.coral, P.garnet, 0.45)];
