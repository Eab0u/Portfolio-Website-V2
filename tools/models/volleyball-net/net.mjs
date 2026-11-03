// The net: a woven lattice hanging from a straight top tape and drooping along a catenary to a thick
// garnet bottom cable. Deep mint vertical strands run into the cable; horizontal rows alternate light
// ice and mid mint and share the droop, fading toward the taut top. A warm off-white chamfered top
// tape with a thin garnet edge line, coral side tapes, tie cords, and coral and off-white antennas.
import { NET, ROW_ICE, ROW_MINT, TRIM, GARNET, CORAL } from "./palette.mjs";
import { mesh, tape, trim, fan, extrude, rect, chamfer, circle, V, UP, POST_X, NET_X, NET_BOT, NET_TOP, TAPE_H, droop } from "./shared.mjs";

const COLS = 19, ROWS = 5, SEGS = 5, X = V(1, 0, 0);

// A polyline along x from x0 to x1 at height y(x), as overlapping straight extrusions.
function curve(soup, x0, x1, n, y, z, prof, set, side) {
  const pt = (k) => { const x = x0 + ((x1 - x0) * k) / n; return V(x, y(x), z); };
  for (let k = 0; k < n; k++) {
    const a = pt(k), b = pt(k + 1), d = V().subVectors(b, a).normalize().multiplyScalar(0.008);
    extrude(soup, k ? a.sub(d) : a, k < n - 1 ? b.add(d) : b, prof, set, { side, caps: false });
  }
}

function lattice() {
  const w = NET_X * 2, h = NET_TOP - NET_BOT;
  for (let i = 1; i < COLS; i++) {
    const x = -NET_X + (i / COLS) * w, z = i % 2 ? 0.004 : -0.004;
    extrude(mesh, V(x, NET_BOT - droop(x), z), V(x, NET_TOP, z), rect(0.036, 0.024), NET, { side: X, caps: false });
  }
  for (let j = 1; j < ROWS; j++) {
    const f = 1 - j / ROWS, y0 = NET_BOT + (j / ROWS) * h;
    curve(mesh, -NET_X, NET_X, SEGS, (x) => y0 - droop(x) * f, j % 2 ? 0.006 : -0.006, rect(0.026, 0.028), j % 2 ? ROW_ICE : ROW_MINT, UP);
  }
  // Thick garnet bottom cable, post to post along the catenary.
  curve(tape, -POST_X, POST_X, 6, (x) => NET_BOT - droop(x), 0, circle(0.024, 6), GARNET, UP);
}

function tapes() {
  const yc = NET_TOP + TAPE_H / 2 - 0.01;
  const t0 = V(-NET_X - 0.02, yc, 0), t1 = V(NET_X + 0.02, yc, 0);
  const { ra, rb } = extrude(trim, t0, t1, chamfer(TAPE_H, 0.05, 0.014), TRIM, { side: UP, caps: false });
  // Coral end caps on the tape.
  fan(tape, ra, t0, CORAL, () => V(-1, 0, 0)); fan(tape, rb, t1, CORAL, () => X);
  // Thin garnet edge line along the tape's lower edge, a hair proud of the tape faces.
  extrude(tape, V(-NET_X, yc - TAPE_H * 0.36, 0), V(NET_X, yc - TAPE_H * 0.36, 0), rect(0.012, 0.056), GARNET, { side: UP });
  for (const s of [1, -1]) {
    const x = s * (NET_X - 0.03);
    extrude(tape, V(x, NET_BOT - droop(x) - 0.03, 0), V(x, NET_TOP + 0.02, 0), chamfer(0.06, 0.04, 0.01), CORAL, { side: X });
    // Tie cord from the tape end into the post clamp.
    extrude(trim, V(s * NET_X, yc, 0), V(s * POST_X, yc, 0), circle(0.02, 6), TRIM, { caps: false });
  }
}

// Antenna: a chunky rod in alternating coral and off-white bands on the outer edge of each side tape.
function antenna(x) {
  const y0 = NET_BOT + 0.15, y1 = NET_TOP + 0.55, n = 6, z = 0.042;
  for (let k = 0; k < n; k++) {
    const a = y0 + ((y1 - y0) * k) / n, b = y0 + ((y1 - y0) * (k + 1)) / n;
    extrude(k % 2 ? trim : tape, V(x, a, z), V(x, b, z), circle(0.024, 6), k % 2 ? TRIM : CORAL, { caps: k === 0 ? "a" : k === n - 1 ? "b" : false });
  }
}

export function buildNet() {
  lattice();
  tapes();
  antenna(NET_X - 0.03); antenna(-(NET_X - 0.03));
}
