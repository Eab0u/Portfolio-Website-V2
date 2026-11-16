// Torso and arms: cream shorts with a waistband, a chunky blue shirt (flared hem, wide chest, sloped
// shoulders) with ice blue side panels, round shoulder caps, short sleeves with cream cuffs, a cream
// collar ring, a sun hem trim, a sand neck, and sand arms with ball elbows and fists, swinging against the legs.
import { SHIRT, PANEL, CREAM, CREAM_HEM, SKIN, HEM, HEM_BEVEL } from "./palette.mjs";
import { shirt, pale, skin, glow, loft, tube, extrude, chamfer, ball, V, Z, HIP, NECK, HEAD, ARMS } from "./shared.mjs";

const at = (a, b, t) => a.clone().lerp(b, t);
const axis = (t) => at(HIP, NECK, t);
const BODY = chamfer(0.5, 0.31, 0.08);

function shorts() {
  loft(pale, [axis(-0.1), axis(0.05), axis(0.2)], BODY, [1.0, 1.03, 1.0], CREAM, { caps: "a" });
  // Waistband peeking under the shirt hem.
  loft(pale, [axis(0.17), axis(0.22)], BODY, [1.04, 1.04], CREAM_HEM, { caps: false });
}

function body() {
  const T = [0.16, 0.22, 0.42, 0.72, 0.92, 1.0], S = [1.1, 1.08, 1.0, 1.14, 1.12, 0.55];
  // Side faces (3 and 7 of the chamfer profile) are the ice blue panels from hem to chest.
  const pick = (k, seg) => ((k === 3 || k === 7) && seg >= 1 && seg <= 3 ? PANEL : SHIRT);
  loft(shirt, T.map(axis), BODY, S, SHIRT, { pick, caps: "a" });
  // Sun-yellow hem trim a touch proud of the shirt, with a lighter bevel row on top.
  loft(glow, [axis(0.145), axis(0.19)], BODY, [1.125, 1.115], HEM, { caps: "a" });
  loft(glow, [axis(0.19), axis(0.21)], BODY, [1.115, 1.095], HEM_BEVEL, { caps: false });
  // Collar ring and neck.
  const up = V().subVectors(NECK, HIP).normalize();
  tube(pale, NECK.clone().addScaledVector(up, -0.03), NECK.clone().addScaledVector(up, 0.035), 0.142, 0.12, CREAM, { n: 8, k: 0 });
  tube(skin, NECK, at(NECK, HEAD, 0.6), 0.094, 0.084, SKIN, { n: 6 });
}

function arm({ sh, el, hand }) {
  ball(shirt, sh, 0.126, SHIRT, 0.95);
  tube(shirt, sh, at(sh, el, 0.48), 0.11, 0.101, SHIRT, { n: 7 });
  tube(pale, at(sh, el, 0.44), at(sh, el, 0.54), 0.113, 0.11, CREAM, { n: 7 });
  // Thin sun-yellow sleeve stripe just above the cuff.
  tube(glow, at(sh, el, 0.385), at(sh, el, 0.415), 0.108, 0.107, HEM, { n: 7, caps: false });
  tube(skin, at(sh, el, 0.45), el, 0.086, 0.078, SKIN, { n: 6 });
  ball(skin, el, 0.084, SKIN);
  // Forearm tapers from elbow to wrist.
  tube(skin, el, at(el, hand, 0.92), 0.084, 0.06, SKIN, { n: 6 });
  mitt(el, hand);
}

// A closed fist about 1.3x the wrist width: a short bevelled block, a little narrower at the knuckles, with a thumb facet.
function mitt(el, hand) {
  const d = V().subVectors(hand, el).normalize(), top = V().crossVectors(Z, d).normalize();
  const tip = hand.clone().addScaledVector(d, 0.08);
  extrude(skin, hand.clone().addScaledVector(d, -0.045), tip, chamfer(0.156, 0.15, 0.045), SKIN, { side: Z, scaleB: 0.8 });
  const t0 = hand.clone().addScaledVector(top, 0.05).addScaledVector(d, 0.012);
  tube(skin, t0, t0.clone().addScaledVector(d, 0.05).addScaledVector(top, 0.026), 0.035, 0.027, SKIN, { n: 4 });
}

export function buildTorso() {
  shorts();
  body();
  arm(ARMS.right);
  arm(ARMS.left);
}
