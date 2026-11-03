// The perch: an off-white chamfered deck with a coral front lip, a garnet seat box (coral top bevels)
// with an ice cushion, coral edge strips and two sun bolts, a tilted garnet backrest between the rear posts with an ice
// stripe on both faces, two sun bolts on the back and an off-white top roll, and a mint whistle.
import { TRIM, CORAL, SEAT, ICE, MINT, SUN } from "./palette.mjs";
import { trim, cloth, stripe, glow, extrude, chamfer, rect, circle, tube, V, Z, UP, LEG_X, REAR_Z, DECK_Y, RAIL_Y } from "./shared.mjs";

const DECK_Z0 = -0.48, DECK_Z1 = 0.08, DECK_W = 0.4;
const SEAT_Z0 = -0.42, SEAT_Z1 = -0.12, SEAT_TOP = 1.56, SEAT_W = 0.27;

// A chamfered slab spanning x from -w to w; dz by dy profile centered at (y, z).
const slab = (soup, w, y, z, dz, dy, c, set, side = Z) =>
  extrude(soup, V(-w, y, z), V(w, y, z), chamfer(dz, dy, c), set, { side });

function deck() {
  const zc = (DECK_Z0 + DECK_Z1) / 2;
  slab(trim, DECK_W, DECK_Y, zc, DECK_Z1 - DECK_Z0, 0.06, 0.016, TRIM);
  // Coral lip along the deck front edge.
  slab(cloth, DECK_W + 0.01, DECK_Y - 0.004, DECK_Z1 - 0.01, 0.04, 0.05, 0.01, CORAL);
}

function seatBox() {
  const zc = (SEAT_Z0 + SEAT_Z1) / 2, y0 = DECK_Y + 0.03, h = SEAT_TOP - y0;
  slab(cloth, SEAT_W, y0 + h / 2, zc, SEAT_Z1 - SEAT_Z0, h, 0.025, SEAT);
  // Ice cushion, slightly proud at the front so it overhangs the box.
  slab(stripe, SEAT_W - 0.01, SEAT_TOP + 0.03, zc + 0.012, SEAT_Z1 - SEAT_Z0 + 0.01, 0.06, 0.022, ICE);
  // Thin coral bevel strips along the top and bottom edges of the box front.
  for (const y of [SEAT_TOP - 0.012, y0 + 0.012]) {
    extrude(cloth, V(-SEAT_W + 0.01, y, SEAT_Z1 + 0.002), V(SEAT_W - 0.01, y, SEAT_Z1 + 0.002), rect(0.022, 0.016), CORAL, { side: UP, caps: false });
  }
  // Two sun bolts on the box front.
  for (const s of [1, -1]) {
    const p = V(s * 0.17, y0 + h * 0.5, SEAT_Z1 - 0.004);
    extrude(glow, p, p.clone().add(V(0, 0, 0.022)), circle(0.024, 6), SUN, { caps: "b" });
  }
}

// Backrest: a coral panel leaning slightly back, ice stripes front and back, back bolts, an off-white top roll.
function backrest() {
  const b = V(0, SEAT_TOP + 0.08, REAR_Z + 0.03), t = V(0, 2.0, REAR_Z - 0.01);
  const up = V().subVectors(t, b).normalize(), mid = b.clone().lerp(t, 0.5), h = b.distanceTo(t);
  const w = LEG_X - 0.04, fwd = V(0, up.z, -up.y).negate(); // unit normal pointing toward +z (front)
  extrude(cloth, mid.clone().setX(-w), mid.clone().setX(w), chamfer(h, 0.06, 0.016), SEAT, { side: up });
  for (const d of [1, -1]) {
    const s = mid.clone().addScaledVector(up, 0.04).addScaledVector(fwd, 0.026 * d);
    extrude(stripe, s.clone().setX(-w + 0.02), s.clone().setX(w - 0.02), chamfer(0.08, 0.02, 0.006), ICE, { side: up });
  }
  // Two sun bolts on the back face, under the stripe.
  for (const x of [0.15, -0.15]) {
    const p = mid.clone().addScaledVector(up, -0.08).addScaledVector(fwd, -0.026).setX(x);
    extrude(glow, p, p.clone().addScaledVector(fwd, -0.022), circle(0.026, 6), SUN, { caps: "b" });
  }
  const top = t.clone().addScaledVector(up, 0.005);
  tube(trim, top.clone().setX(-w), top.clone().setX(w), 0.034, TRIM, { n: 6 });
}

// A small mint whistle hanging on an off-white cord from the right arm rail.
function whistle() {
  const x = LEG_X + 0.035, z = REAR_Z + 0.12, top = V(x, RAIL_Y - 0.03, z), y = RAIL_Y - 0.2;
  tube(trim, top, V(x, y + 0.02, z + 0.01), 0.008, TRIM, { n: 3, caps: false });
  extrude(stripe, V(x, y, z - 0.04), V(x, y, z + 0.05), chamfer(0.05, 0.04, 0.012), MINT, { side: UP });
  extrude(stripe, V(x, y + 0.01, z + 0.05), V(x, y + 0.01, z + 0.09), rect(0.022, 0.03), MINT, { side: UP });
}

export function buildSeat() {
  deck();
  seatBox();
  backrest();
  whistle();
}
