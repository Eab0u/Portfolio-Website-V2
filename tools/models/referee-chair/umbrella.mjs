// The sunshade: an off-white pole standing just outside the left rear post on two off-white brackets,
// with a mint band near the top, and a faceted canopy tipped toward the seat. Ten alternating coral and ice panels
// billow at the rim and drop pointed scallop flaps, a lighter bevel piping runs along the rim, off-white
// ribs ride the seams, and a sun finial tops it.
import { TRIM, MINT, CANOPY_CORAL, CORAL_UNDER, CORAL_RIM, ICE, ICE_UNDER, ICE_RIM, SUN } from "./palette.mjs";
import { canopy as shade, stripe, trim, glow, ball, extrude, circle, chamfer, tube, fan, V, LEG_X, POLE_X, POLE_Z, CANOPY_Y } from "./shared.mjs";

const N = 10, R_MID = 0.46, R_RIM = 0.9, DROP_MID = 0.13, DROP_RIM = 0.37, TILT = 0.17;
const APEX = V(POLE_X, CANOPY_Y, POLE_Z);
const cs = Math.cos(TILT), sn = Math.sin(TILT);
// Canopy-local (x, dy below apex, z) to world: tipped about the apex so the +x side leans over the seat.
const local = (x, y, z) => V(POLE_X + x * cs + y * sn, CANOPY_Y - x * sn + y * cs, POLE_Z + z);
const at = (r, a, dy) => local(Math.cos(a) * r, -dy, Math.sin(a) * r);
const AXIS = local(0, 1, 0).sub(APEX);

function pole() {
  tube(trim, V(POLE_X, 1.5, POLE_Z), APEX, 0.034, TRIM, { n: 6, caps: "a" });
  // Mint band near the top of the pole.
  extrude(stripe, V(POLE_X, CANOPY_Y - 0.6, POLE_Z), V(POLE_X, CANOPY_Y - 0.52, POLE_Z), circle(0.044, 6), MINT, { caps: "b" });
  // Two off-white brackets from the post to the pole, leaving a clear gap above the backrest roll.
  for (const y of [1.62, 1.95]) {
    extrude(trim, V(-LEG_X, y, POLE_Z), V(POLE_X - 0.03, y, POLE_Z), chamfer(0.06, 0.07, 0.014), TRIM, { side: V(0, 1, 0) });
  }
}

// Points of panel i: mid-ring pair, rim pair, billow point, and the hanging scallop tip.
function panelPoints(i) {
  const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, am = (a0 + a1) / 2;
  return {
    m0: at(R_MID, a0, DROP_MID), m1: at(R_MID, a1, DROP_MID), r0: at(R_RIM, a0, DROP_RIM), r1: at(R_RIM, a1, DROP_RIM),
    bil: at(R_RIM * 1.03, am, DROP_RIM - 0.05), tip: at(R_RIM * 1.02, am, DROP_RIM + 0.14),
  };
}

function canopy() {
  for (let i = 0; i < N; i++) {
    const { m0, m1, r0, r1, bil, tip } = panelPoints(i), ice = i % 2 === 1;
    const top = ice ? ICE : CANOPY_CORAL, under = ice ? ICE_UNDER : CORAL_UNDER, soup = ice ? stripe : shade;
    const out = (p) => V().subVectors(p, APEX).addScaledVector(AXIS, 0.6);
    const faces = [[APEX, m0, m1], [m0, r0, bil], [m0, bil, m1], [m1, bil, r1]];
    for (const [a, b, c] of faces) {
      const o = out(V().add(a).add(b).add(c).divideScalar(3));
      soup.lit(a, b, c, top, o);
      soup.lit(a, c, b, under, o.clone().negate());
    }
    // Scallop flap hanging from the rim, seen from both sides.
    const fo = V().subVectors(tip, APEX).addScaledVector(AXIS, 0.2);
    soup.lit(r0, bil, tip, top, fo); soup.lit(r0, tip, bil, under, fo.clone().negate());
    soup.lit(bil, r1, tip, top, fo); soup.lit(bil, tip, r1, under, fo.clone().negate());
    // Lighter bevel piping along the rim edge of the panel.
    const rim = ice ? ICE_RIM : CORAL_RIM;
    tube(soup, r0, bil, 0.017, rim, { n: 3, caps: false });
    tube(soup, bil, r1, 0.017, rim, { n: 3, caps: false });
  }
}

// Ribs on the seams (a hair above the cloth), each running past the rim into a short tapered tip.
function ribs() {
  const lift = AXIS.clone().multiplyScalar(0.014);
  for (let i = 0; i < N; i++) {
    const { m0, r0 } = panelPoints(i);
    const m = m0.clone().add(lift), tipEnd = r0.clone().lerp(m, -0.12).sub(lift);
    tube(trim, APEX.clone().add(lift), m, 0.016, TRIM, { n: 3, caps: false });
    tube(trim, m, tipEnd, 0.016, TRIM, { n: 3, caps: "b", scaleB: 0.6 });
  }
}

function finial() {
  const ring = Array.from({ length: 8 }, (_, k) => {
    const a = ((k + 0.5) / 8) * Math.PI * 2;
    return local(Math.cos(a) * 0.07, 0.01, Math.sin(a) * 0.07);
  });
  fan(trim, ring, local(0, 0.05, 0), TRIM, (p) => V().subVectors(p, APEX).addScaledVector(AXIS, 0.5));
  ball(glow, local(0, 0.1, 0), 0.06, SUN, 1.1);
}

export function buildUmbrella() {
  pole();
  canopy();
  ribs();
  finial();
}
