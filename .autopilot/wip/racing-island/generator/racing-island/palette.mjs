// Racing island color sets: [light, mid, shadow] from ramp() on palette tokens, so shadows stay
// hue-shifted and saturated. RACING is the `racing` token from src/lib/palette.ts (a mood hue, no livery).
import { P, C, mix } from "../lib/palette.mjs";
import { ramp } from "../lib/shade.mjs";
export { P, C, mix };

export const RACING = "#ff2e3d";
// Value-only steps (same hue and saturation): the underside sits in shade at every angle, so any hue
// push in its steps shows up as a different island when the model turns.
const val = (c, dl) => C(c).offsetHSL(0, 0, dl);
const set = (c) => { const r = ramp(c); return [r.light, r.mid, r.shadow]; };

// Top: a saturated ice apron with mint facet steps (pale albedo greys out under the scene lights),
// an ice berm, a deep blue track, a mint-grass infield in mowing stripes.
// Sun-facing ice faces wash out, so these sets use the mix itself as the lit step (no lift) and a
// bluer mid, both ramp outputs.
const low = (c) => [ramp(c).mid, ramp(mix(c, P.blue, 0.25)).mid, ramp(c).shadow];
export const APRON = set(mix(P.ice, P.blue, 0.32));
export const APRON2 = set(mix(P.ice, P.mint, 0.55));
// Berm and icicles: mint-ice with a violet-ice shade step instead of a hot cyan one.
const ICEM = mix(P.ice, P.mint, 0.2);
export const ICE = [ramp(ICEM).mid, ramp(mix(ICEM, P.blue, 0.25)).mid, ramp(mix(ICEM, P.violet, 0.4)).mid];
// Violet-leaning asphalt, one step lighter than the blue berm so the ring separates from the wall at hero scale.
const ASPHALT = mix(P.blue, P.violet, 0.45);
export const TRACK = set(mix(ASPHALT, P.blue, 0.85));
export const TRACK2 = set(mix(mix(ASPHALT, P.blue, 0.85), P.navy, 0.1));
export const INFIELD = set(mix(P.grass, P.mint, 0.3));
export const INFIELD2 = set(mix(P.grass, P.mint, 0.65));
// Kerbs, barriers, buildings: racing red and off-white, with garnet and electric blue accents.
export const RED = set(RACING);
// Off-white lit faces with ice and ice-blue shade steps (ramp mids), so shaded walls land blue, not khaki.
export const WHITE = [C(P.white), ramp(mix(P.ice, P.white, 0.3)).mid, ramp(mix(P.ice, P.blue, 0.3)).mid];
// Structures: warm sand-cream (chroma that survives shading) with a blue-violet shade step, and mint masts.
// Lit step is the unlifted token (a lift would drain the chroma that keeps them off grey).
const SHADE = ramp(mix(P.ice, P.violet, 0.5)).mid;
export const CREAM = [ramp(mix(P.sand, P.white, 0.25)).mid, ramp(P.sand).mid, SHADE];
// Grandstand walls: the same sand-cream; the shade step leans peach because the ice fill light strips red
// (plain sand goes olive there), and it never matches the ice wall.
// The back wall faces away from the sun into the ice fill, so its shade step is a light peach-cream.
export const STAND = [CREAM[0], CREAM[1], C(mix(P.sand, P.coral, 0.4)).offsetHSL(0, 0.15, 0.03)];
export const CORAL = set(P.coral);
// Small accents: electric violet and sun yellow, value-only steps so none of them goes near-black navy.
export const VIOLETP = [val(P.violet, 0.08), C(P.violet), val(P.violet, -0.08)];
export const SUNS = [val(P.sun, 0.06), C(P.sun), mix(P.sun, P.coral, 0.3)];
export const MINT = [ramp(P.mint).mid, ramp(mix(P.mint, P.grass, 0.35)).mid, ramp(mix(P.mint, P.blue, 0.45)).mid];
export const BLUE = set(P.blue);
// Garnet keeps its own hue in shade (the ramp shadow leans magenta and goes near-black under the fill).
export const GARNET = [ramp(P.garnet).light, C(P.garnet), val(P.garnet, -0.04)];
// Underside, matching the hub island family: ice cliff band, sand stone lip, violet strata, coral tip.
// Ice wall: ONE mid-ice value with a warm light step and a violet shade step (as on the hub island).
const ICEMID = mix(P.ice, P.blue, 0.36);
// The rim bevel (SNOW, SNOW2) and the cliff share it, so the whole wall is one material from every angle.
// Steps are pre-shifted toward cyan and mint: the fill light adds blue on the faces that carry them.
export const CLIFF = [ramp(mix(P.ice, P.blue, 0.2)).mid, C(P.ice), mix(P.ice, P.mint, 0.35)];
export const SNOW = CLIFF;
export const SNOW2 = [CLIFF[1], CLIFF[0], CLIFF[2]];
export const BERM2 = CLIFF;
// One sand band with a violet-leaning shade (never orange or olive).
// Mixing sand toward violet drains chroma (grey under shade light), so the mix gets its saturation back.
// The ice fill light strips red, so every step keeps a peach lean (a pale or dull sand goes olive or brown there).
const SANDSH = mix(P.sand, P.coral, 0.3);
export const STONE = [mix(P.sand, P.coral, 0.08), mix(P.sand, P.coral, 0.2), SANDSH];
// One muted mid-violet close to the hub's strata; VHI is the same hue one value step up.
const VMID = mix(mix(P.violet, P.navy, 0.18), P.white, 0.08);
export const VHI = [val(VMID, 0.16), val(VMID, 0.07), val(VMID, -0.08)];
export const VIOLET = [val(VMID, 0.09), VMID, val(VMID, -0.14)];
// Spikes and tip stay one coral; the shade step stays near the token so lit shade lands coral, not brown-red.
export const SPIKE = [ramp(P.coral).light, ramp(P.coral).mid, mix(P.coral, P.navy, 0.06)];
export const TIP = SPIKE;
// Glow: sun lamps and ice crystals (mint root to white point, like the hub's crystals).
export const SUN = C(P.sun);
export const CRYSTAL = [mix(P.ice, P.mint, 0.4), C(P.ice), mix(P.ice, P.white, 0.5)];
export const GLASS = set(mix(P.ice, P.mint, 0.25));
// Upward ledges catch ice light, as on the hub island.
export const HI = new Map([[VHI, ramp(P.ice).light], [VIOLET, ramp(P.ice).mid], [STONE, mix(P.sand, P.coral, 0.1)]]);
