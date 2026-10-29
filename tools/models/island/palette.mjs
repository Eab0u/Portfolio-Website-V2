// Island palette: tokens from ART_DIRECTION.md and three value steps per band (light, mid, dark).
import * as THREE from "three";

export const P = { navy: "#1a1f3a", mint: "#7cf0c8", blue: "#2f6bff", garnet: "#c0194f", sun: "#ffd23f", coral: "#ff6b57",
  violet: "#8b5cff", sand: "#f2c98a", grass: "#3ddc84", ice: "#9be7ff", white: "#f4f1ea" };
export const C = (h) => (h instanceof THREE.Color ? h.clone() : new THREE.Color(h));
export const mix = (a, b, t) => C(a).lerp(C(b), t);
// Three value steps of ONE hue: light (warm sun tint), mid (token), dark (same hue, lower value, cool lean).
export const steps = (hex, lift = 0.22) => [mix(hex, P.white, lift).lerp(C(P.sun), 0.08), C(hex), C(hex).multiplyScalar(0.92).lerp(C(P.violet), 0.14)];
export const GRASS = [mix(P.grass, P.sun, 0.2), C(P.grass), C(P.grass).multiplyScalar(0.62).lerp(C(P.blue), 0.06)];
export const EARTH = [mix(P.sand, P.coral, 0.35), mix(P.sand, P.coral, 0.65), mix(P.coral, P.violet, 0.22)];
export const STONE = [mix(P.sand, P.white, 0.45), C(P.sand), mix(P.sand, P.coral, 0.12)];
export const VHI = [mix(P.violet, P.coral, 0.2).lerp(C(P.white), 0.25), mix(P.violet, P.white, 0.2), mix(P.violet, P.blue, 0.2).lerp(C(P.navy), 0.12)];
export const VIOLET = [mix(P.violet, P.coral, 0.22).lerp(C(P.white), 0.12), C(P.violet), mix(P.violet, P.blue, 0.25).lerp(C(P.navy), 0.22)];
export const TIP = [mix(P.coral, P.sun, 0.22), C(P.coral), mix(P.coral, P.garnet, 0.55)];
export const MINT = steps(P.mint, 0.2);
export const ICE = mix(P.ice, P.violet, 0.3);
export const UP = new Map([[STONE, mix(P.sand, P.white, 0.55)], [VHI, ICE], [VIOLET, ICE], [GRASS, GRASS[0]]]);
// Crystal gradient: mint at the root, ice at the point.
export const CRYSTAL = [C(P.mint), mix(P.mint, P.ice, 0.45), C(P.ice)];
export const CAP = [mix(P.coral, P.sun, 0.2), C(P.coral), mix(P.coral, P.garnet, 0.45)];
