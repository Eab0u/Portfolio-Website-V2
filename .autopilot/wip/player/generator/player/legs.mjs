// Legs in a running stride: cream shorts legs with a sand hem band, tapered six-sided sand thighs and
// shins with ball knees, coral socks with two cream bands, and chunky violet-navy boots with a heel
// collar, a lighter violet toe cap and a glowing sun sole.
import { CREAM, CREAM_HEM, SKIN, SOCK, BOOT, BOOT_TOE, SOLE } from "./palette.mjs";
import { pale, skin, sock, dark, glow, tube, extrude, chamfer, ball, V, Z, LEGS } from "./shared.mjs";

const at = (a, b, t) => a.clone().lerp(b, t);

function boot(ankle, toe) {
  const f = V().subVectors(toe, ankle).normalize(), down = V().crossVectors(f, Z).normalize();
  const heel = ankle.clone().addScaledVector(f, -0.07).addScaledVector(down, 0.02);
  const tip = toe.clone().addScaledVector(down, 0.02);
  // Body: a chamfered block, slimmer at the toe, with a lighter toe cap and a collar around the ankle.
  const body = extrude(dark, heel, at(heel, tip, 0.72), chamfer(0.17, 0.14, 0.04), BOOT, { side: Z, caps: "a", scaleB: 0.96 });
  extrude(dark, at(heel, tip, 0.72), tip, chamfer(0.164, 0.135, 0.04), BOOT_TOE, { side: Z, caps: "b", scaleB: 0.78 });
  tube(dark, ankle.clone().addScaledVector(down, -0.02), ankle.clone().addScaledVector(down, -0.075), 0.098, 0.094, BOOT, { n: 7 });
  // Sole: a sun slab under the whole boot, a touch wider than the body.
  const s0 = heel.clone().addScaledVector(down, 0.075).addScaledVector(f, 0.015), s1 = tip.clone().addScaledVector(down, 0.06).addScaledVector(f, 0.01);
  extrude(glow, s0, s1, chamfer(0.172, 0.036, 0.012), SOLE, { side: Z, scaleB: 0.8 });
  return body;
}

function leg({ hip, knee, ankle, toe }) {
  // Shorts leg with a hem band.
  const hem = at(hip, knee, 0.42);
  tube(pale, at(hip, knee, -0.08), hem, 0.15, 0.145, CREAM, { n: 8 });
  tube(pale, at(hip, knee, 0.37), at(hip, knee, 0.45), 0.158, 0.156, CREAM_HEM, { n: 8 });
  // Thigh and shin with a ball knee.
  tube(skin, at(hip, knee, 0.3), knee, 0.118, 0.1, SKIN, { n: 6 });
  ball(skin, knee, 0.094, SKIN);
  tube(skin, knee, at(knee, ankle, 0.45), 0.096, 0.086, SKIN, { n: 6 });
  // Sock from mid shin to the boot, with two cream bands near the top.
  tube(sock, at(knee, ankle, 0.42), ankle, 0.104, 0.09, SOCK, { n: 7 });
  tube(pale, at(knee, ankle, 0.44), at(knee, ankle, 0.52), 0.108, 0.107, CREAM, { n: 7 });
  tube(pale, at(knee, ankle, 0.6), at(knee, ankle, 0.65), 0.107, 0.106, CREAM, { n: 7 });
  boot(ankle, toe);
}

export function buildLegs() {
  leg(LEGS.left);
  leg(LEGS.right);
}
