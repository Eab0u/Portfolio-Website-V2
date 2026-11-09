// Tall readable pieces that break the flat top: a stepped grandstand with a red roof behind the back
// straight, a low pit building and control tower at the back of the infield, and a start gantry.
import { CREAM, RED, BLUE, GARNET, GLASS, SUN } from "./palette.mjs";
import { main, lamp, glow, box, extrude, rect, stad, V, N, DZ, R, W, FOOT } from "./shared.mjs";
import { START } from "./top.mjs";

const alt = (a, b) => (i) => (i % 2 ? a : b);

// Grandstand: three seat tiers stepping up away from the track, a back wall, a sloped red roof on posts.
export function buildGrandstand() {
  const zf = DZ - R - FOOT - 0.03, zb = -1.8, w = 1.36;
  for (let k = 0; k < 3; k++) {
    const z0 = zf - k * 0.12, h = 0.11 * (k + 1);
    box(main, 0, -0.02, (z0 + zb) / 2, w, h + 0.02, z0 - zb, CREAM);
    box(main, 0, h, z0 - 0.04, w - 0.04, 0.035, 0.07, k % 2 ? BLUE : RED);
  }
  box(main, 0, -0.02, zb + 0.03, w + 0.04, 0.64, 0.06, CREAM);
  // Back face: a garnet band and blue fins so the wall is never one flat slab.
  box(main, 0, 0.4, zb - 0.004, w + 0.06, 0.07, 0.02, GARNET);
  for (const x of [-0.5, -0.17, 0.17, 0.5]) box(main, x, -0.02, zb - 0.01, 0.07, 0.6, 0.04, BLUE);
  extrude(main, V(0, 0.66, zb - 0.02), V(0, 0.52, zf + 0.02), rect(0.045, w + 0.12), RED, { pick: alt(GARNET, RED) });
  for (const x of [-0.62, 0, 0.62]) box(main, x, 0.1, zf + 0.06, 0.035, 0.44, 0.035, CREAM);
  // Pennants on the roof's back edge, red and white, streaming toward +x.
  [-0.6, -0.2, 0.2, 0.6].forEach((x, k) => {
    const y0 = 0.66, z = zb - 0.01;
    box(main, x, y0, z, 0.02, 0.24, 0.02, CREAM);
    const a = V(x, y0 + 0.24, z), b = V(x, y0 + 0.14, z), t = V(x + 0.16, y0 + 0.2, z), c = (k % 2 ? CREAM : RED)[1];
    main.tri(a, b, t, c, V(0, 0, 1)); main.tri(a, b, t, c, V(0, 0, -1));
  });
}

// Low pit building along the back of the infield (doors face the back straight), so the green
// infield and the front straight stay open: cream block, red roof slab, blue doors, and a control
// tower at the infield end with an ice glass cab, a garnet cap and a sun lamp.
export function buildPits() {
  const d = 0.2, zc = DZ - (R - W / 2 - 0.14) + 0.16;
  box(main, 0.1, -0.02, zc, 0.86, 0.15, d, CREAM);
  box(main, 0.1, 0.13, zc - 0.02, 0.94, 0.035, d + 0.08, RED);
  for (let k = 0; k < 4; k++) box(main, -0.2 + k * 0.2, 0.0, zc - d / 2, 0.14, 0.1, 0.016, BLUE);
  const tx = -0.56;
  box(main, tx, -0.02, zc, 0.16, 0.44, 0.16, CREAM);
  box(main, tx, 0.1, zc, 0.17, 0.04, 0.17, BLUE);
  box(glow, tx, 0.42, zc, 0.22, 0.1, 0.22, GLASS);
  box(main, tx, 0.52, zc, 0.26, 0.035, 0.26, GARNET);
  box(lamp, tx, 0.555, zc, 0.05, 0.05, 0.05, [SUN, SUN, SUN]);
}

// Start gantry straddling the start line: two cream posts, a red and garnet beam, sun lamps on both faces.
export function buildGantry() {
  const u = (START + 1) / N, p0 = stad(u, -W / 2 - 0.18), p1 = stad(u, W / 2 + 0.17), top = 0.6;
  box(main, p0.x, -0.02, p0.z, 0.05, top + 0.02, 0.05, CREAM);
  box(main, p1.x, -0.02, p1.z, 0.05, top + 0.02, 0.05, CREAM);
  const a = V(p0.x, top + 0.035, p0.z - 0.03), b = V(p1.x, top + 0.035, p1.z + 0.03);
  extrude(main, a, b, rect(0.09, 0.06), RED, { pick: alt(GARNET, RED) });
  for (let k = 0; k < 4; k++) {
    const t = 0.24 + k * 0.17, z = a.z + (b.z - a.z) * t;
    for (const s of [-1, 1]) box(lamp, a.x + s * 0.035, top + 0.01, z, 0.025, 0.05, 0.05, [SUN, SUN, SUN]);
  }
}
