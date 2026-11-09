// Hue-shifted shade ramps. Do not hand-pick shadow colors: light leans warm, shadow leans cool
// AND stays saturated. A plain "darker version" of a hue goes dusty (pink, mauve, grey-teal).
import { C, P } from "./palette.mjs";

// Move hue h toward target by t of the way, but never by more than `max` (1.0 = full wheel).
// The cap keeps coral from sliding to magenta and blue from sliding to violet.
const toward = (h, target, t, max) => {
  let d = target - h;
  if (d > 0.5) d -= 1;
  if (d < -0.5) d += 1;
  const step = Math.max(-max, Math.min(max, d * t));
  return (h + step + 1) % 1;
};

// Returns { light, mid, shadow } as THREE.Color. `mid` is the token itself.
export function ramp(hex) {
  const c = C(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  const warm = C(P.sun).getHSL({ h: 0, s: 0, l: 0 }).h;
  const cool = C(P.violet).getHSL({ h: 0, s: 0, l: 0 }).h;
  const light = C().setHSL(toward(hsl.h, warm, 0.1, 0.02), Math.min(1, hsl.s * 1.02), Math.min(0.86, hsl.l + 0.1));
  const shadow = C().setHSL(toward(hsl.h, cool, 0.14, 0.022), Math.min(1, Math.max(hsl.s * 1.1, 0.55)), Math.max(0.2, hsl.l * 0.72));
  return { light, mid: c, shadow };
}
