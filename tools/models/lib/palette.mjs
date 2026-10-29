// Palette tokens from ART_DIRECTION.md and color helpers shared by all model generators.
import * as THREE from "three";

export const P = { navy: "#1a1f3a", mint: "#7cf0c8", blue: "#2f6bff", garnet: "#c0194f", sun: "#ffd23f", coral: "#ff6b57",
  violet: "#8b5cff", sand: "#f2c98a", grass: "#3ddc84", ice: "#9be7ff", white: "#f4f1ea" };
export const C = (h) => (h instanceof THREE.Color ? h.clone() : new THREE.Color(h));
export const mix = (a, b, t) => C(a).lerp(C(b), t);
// Three value steps of ONE hue: light (warm sun tint), mid (token), dark (same hue, lower value, cool lean).
export const steps = (hex, lift = 0.22) => [mix(hex, P.white, lift).lerp(C(P.sun), 0.08), C(hex), C(hex).multiplyScalar(0.92).lerp(C(P.violet), 0.14)];
