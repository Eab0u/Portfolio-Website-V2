// Electric blue frame: two thick straight rear legs that rise into the backrest posts, two leaning
// front legs that are the ladder rails, off-white bands for rhythm, alternating coral and ice plank
// rungs topped by a deep ice footrest step, glowing sun rung caps, one slim blue diagonal per side,
// off-white arm rails and a front safety bar, and sun finials on the post tops.
import { FRAME, TRIM, CORAL, ICE, SUN } from "./palette.mjs";
import { frame, cloth, trim, stripe, glow, ball, extrude, circle, chamfer, tube, V, Z, sandY, frontZ,
  LEG_X, LEG_R, REAR_Z, FOOT_Y, DECK_Y, RAIL_Y, POST_TOP } from "./shared.mjs";

const oct = (r) => circle(r, 8, 0.5);
const rear = (s, y) => V(s * LEG_X, y, REAR_Z);
const front = (s, y) => V(s * LEG_X, y, frontZ(y));
const RUNGS = [0.36, 0.64, 0.92, 1.14];

// A glowing finial: an off-white collar and a faceted sun ball on top of a post end.
function finial(top) {
  extrude(trim, top.clone().add(V(0, -0.02, 0)), top.clone().add(V(0, 0.02, 0)), circle(LEG_R * 1.3, 6), TRIM, { caps: "b" });
  ball(glow, top.clone().add(V(0, 0.06, 0)), LEG_R * 1.2, SUN, 0.9);
}

// An off-white band hugging a leg at height y (leg given as a point function of y).
function band(at, y) {
  extrude(trim, at(y - 0.035), at(y + 0.035), oct(LEG_R * 1.18), TRIM, { caps: "b" });
}

function legs() {
  for (const s of [1, -1]) {
    const r = (y) => rear(s, y), f = (y) => front(s, y);
    extrude(frame, r(sandY(s * LEG_X, REAR_Z) - 0.02), r(POST_TOP), oct(LEG_R), FRAME, { caps: false });
    extrude(frame, f(FOOT_Y - 0.03), f(RAIL_Y), oct(LEG_R), FRAME, { caps: false });
    finial(r(POST_TOP)); finial(f(RAIL_Y));
    band(r, 0.24); band(r, 1.62); band(f, 0.24); band(f, 1.6);
  }
}

// Plank rungs spanning the ladder rails, alternating coral and ice, with sun caps outside each rail.
function ladder() {
  RUNGS.forEach((y, i) => {
    const z = frontZ(y), foot = i === 3, w = foot ? LEG_X + 0.06 : LEG_X, dz = foot ? 0.03 : 0;
    const ice = i % 2 === 1 || foot;
    // The top step is the footrest: a deeper ice plank that sticks out past the rails.
    extrude(ice ? stripe : cloth, V(-w, y, z + dz), V(w, y, z + dz), chamfer(foot ? 0.17 : 0.11, 0.04, 0.012),
      ice ? ICE : CORAL, { side: Z });
    for (const s of [1, -1]) {
      const x0 = s * (LEG_X + LEG_R - 0.006), x1 = s * (LEG_X + LEG_R + 0.018);
      extrude(glow, V(x0, y, z), V(x1, y, z), circle(0.032, 6), SUN, { caps: "b" });
    }
  });
}

// One slim diagonal per side between rear leg and ladder rail, a back tie bar, and deck stringers.
function braces() {
  for (const s of [1, -1]) {
    const x = s * LEG_X;
    tube(frame, V(x, 0.3, REAR_Z), V(x, 1.1, frontZ(1.1)), 0.018, FRAME, { caps: false, n: 4 });
    tube(frame, rear(s, DECK_Y - 0.07), front(s, DECK_Y - 0.07), 0.028, FRAME, { caps: false });
  }
  tube(frame, V(-LEG_X, 0.7, REAR_Z), V(LEG_X, 0.7, REAR_Z), 0.02, FRAME, { caps: false, n: 4 });
}

// Off-white arm rails from the backrest posts to the ladder rail tops, and a front safety bar.
function rails() {
  for (const s of [1, -1]) tube(trim, rear(s, RAIL_Y - 0.03), front(s, RAIL_Y - 0.03), 0.028, TRIM, { caps: false });
  const y = DECK_Y + 0.24;
  tube(trim, V(-LEG_X, y, frontZ(y)), V(LEG_X, y, frontZ(y)), 0.026, TRIM, { caps: false });
}

export function buildFrame() {
  legs();
  ladder();
  braces();
  rails();
}
