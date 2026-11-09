// Racing island color sets: [light, mid, shadow] from ramp() on palette tokens, so shadows stay
// hue-shifted and saturated. RACING is the `racing` token from src/lib/palette.ts (a mood hue, no livery).
import { P, C, mix } from "../lib/palette.mjs";
import { ramp } from "../lib/shade.mjs";
export { P, C, mix };

export const RACING = "#ff2e3d";
const set = (c) => { const r = ramp(c); return [r.light, r.mid, r.shadow]; };

// Top: a saturated ice apron with mint facet steps (pale albedo greys out under the scene lights),
// an ice berm, a deep blue track, a mint-grass infield in mowing stripes.
// Sun-facing ice faces wash out, so these sets use the mix itself as the lit step (no lift) and a
// bluer mid, both ramp outputs.
const low = (c) => [ramp(c).mid, ramp(mix(c, P.blue, 0.25)).mid, ramp(c).shadow];
export const APRON = set(mix(P.ice, P.blue, 0.32));
export const APRON2 = set(mix(P.ice, P.mint, 0.55));
export const SNOW = low(mix(P.ice, P.blue, 0.2));
export const SNOW2 = low(mix(P.ice, P.blue, 0.4));
export const BERM2 = low(mix(P.ice, P.blue, 0.42));
export const ICE = low(mix(P.ice, P.mint, 0.2));
export const TRACK = set(mix(P.blue, P.navy, 0.45));
export const TRACK2 = set(mix(P.blue, P.navy, 0.58));
export const INFIELD = set(mix(P.grass, P.mint, 0.3));
export const INFIELD2 = set(mix(P.grass, P.mint, 0.65));
// Kerbs, barriers, buildings: racing red and off-white, with garnet and electric blue accents.
export const RED = set(RACING);
// Off-white lit faces with ice and ice-blue shade steps (ramp mids), so shaded walls land blue, not khaki.
export const WHITE = [C(P.white), ramp(mix(P.ice, P.white, 0.3)).mid, ramp(mix(P.ice, P.blue, 0.3)).mid];
export const BLUE = set(P.blue);
export const GARNET = set(P.garnet);
// Underside, matching the hub island family: ice cliff band, sand stone lip, violet strata, coral tip.
export const CLIFF = set(mix(P.ice, P.blue, 0.55));
export const STONE = set(mix(P.sand, P.coral, 0.25));
export const VHI = set(mix(P.violet, P.ice, 0.2));
export const VIOLET = set(P.violet);
// Spikes and tip stay one coral: the shade step comes from a coral-sand ramp, so it never turns garnet.
export const SPIKE = [ramp(P.coral).light, ramp(P.coral).mid, ramp(mix(P.coral, P.sand, 0.3)).shadow];
export const TIP = SPIKE;
// Glow: sun lamps and ice crystals (mint root to white point, like the hub's crystals).
export const SUN = C(P.sun);
export const CRYSTAL = [mix(P.ice, P.mint, 0.4), C(P.ice), mix(P.ice, P.white, 0.5)];
export const GLASS = set(mix(P.ice, P.mint, 0.25));
// Upward ledges catch ice light, as on the hub island.
export const HI = new Map([[VHI, ramp(P.ice).light], [VIOLET, ramp(P.ice).mid], [STONE, ramp(mix(P.sand, P.coral, 0.2)).light]]);
