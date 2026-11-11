// Small props: light poles with glowing sun lenses, tyre stacks and cones on the apron and infield ends,
// faceted ice boulders, and glowing ice crystals (one cluster on top, one trio below).
import * as THREE from "three";
import { WHITE, CREAM, CORAL, MINT, RED, GARNET, SUNS, APRON2, CRYSTAL, SUN } from "./palette.mjs";
import { main, lamp, glow, box, extrude, circle, stad, apronPt, outAt, rr, V, UP } from "./shared.mjs";

// Light poles: a mint mast with a garnet collar, a garnet lamp housing facing the track,
// and a glowing sun lens on its front and underside.
const bar = (hw, hd) => [[hw, hd], [-hw, hd], [-hw, -hd], [hw, -hd]];
export function buildPoles() {
  const tops = [];
  [0.2, 0.3, 0.47, 0.68, 0.8, 0.95].forEach((u, k) => {
    const p = apronPt(u, k % 2 ? 0.5 : 0.42), h = 0.72;
    box(main, p.x, -0.02, p.z, 0.04, h, 0.04, k % 2 ? CREAM : MINT);
    tops.push(p.clone().setY(h - 0.06));
    box(main, p.x, 0.12, p.z, 0.06, 0.05, 0.06, GARNET);
    const n = outAt(u), side = V(-n.z, 0, n.x), at = (s, dn, y) => p.clone().addScaledVector(side, s).addScaledVector(n, dn).setY(y);
    extrude(main, at(-0.1, 0, h), at(0.1, 0, h), bar(0.04, 0.035), GARNET, { side: UP.clone() });
    extrude(lamp, at(-0.085, -0.036, h), at(0.085, -0.036, h), bar(0.03, 0.006), [SUN, SUN, SUN], { side: UP.clone() });
    extrude(lamp, at(-0.085, -0.01, h - 0.041), at(0.085, -0.01, h - 0.041), bar(0.006, 0.022), [SUN, SUN, SUN], { side: UP.clone() });
  });
  // Bunting: a sagging line of coral, off-white and sun pennants between two pairs of poles.
  [[0, 1], [3, 4]].forEach(([i, j]) => {
    const a = tops[i], b = tops[j];
    for (let s = 0; s < 7; s++) {
      const t = (s + 0.5) / 7, p = a.clone().lerp(b, t).setY(a.y - 0.12 * 4 * t * (1 - t)), q = a.clone().lerp(b, t + 0.09).setY(p.y);
      const tip = p.clone().lerp(q, 0.5).setY(p.y - 0.07), c = [CORAL, WHITE, CREAM][s % 3][1];
      main.tri(p, q, tip, c, V(0, 0, 1)); main.tri(p, q, tip, c, V(0, 0, -1));
    }
  });
}

// Tyre stacks: short octagonal drums, alternating red and sun yellow, in the infield ends and on the apron.
function tyres(c, high) {
  for (let k = 0; k < high; k++) extrude(main, V(c.x, k * 0.05, c.z), V(c.x, k * 0.05 + 0.048, c.z), circle(0.055, 8), k % 2 ? RED : SUNS);
}
// A small red cone with an off-white tip band.
function cone(c) {
  extrude(main, V(c.x, -0.01, c.z), V(c.x, 0.05, c.z), circle(0.034, 6), RED, { scaleB: 0.55, caps: "b" });
  extrude(main, V(c.x, 0.05, c.z), V(c.x, 0.08, c.z), circle(0.0187, 6), WHITE, { scaleB: 0.45, caps: "b" });
  extrude(main, V(c.x, 0.08, c.z), V(c.x, 0.1, c.z), circle(0.0084, 6), RED, { scaleB: 0.1, caps: "b" });
}
export function buildTyres() {
  [[0.31, -0.55], [0.36, -0.57], [0.81, -0.55], [0.86, -0.57]].forEach(([u, off]) => tyres(stad(u, off), 3));
  [[0.23, 0.5], [0.98, 0.5], [0.6, 0.85]].forEach(([u, t]) => tyres(apronPt(u, t), 2));
  [0.04, 0.08, 0.12, 0.16, 0.26, 0.35, 0.74, 0.86, 0.9].forEach((u, k) => cone(apronPt(u, k % 2 ? 0.45 : 0.6)));
}

// A faceted snow boulder sunk into the apron.
function boulder(c, s) {
  const g = new THREE.IcosahedronGeometry(s, 0), p = g.attributes.position, jit = new Map(), pts = [];
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!jit.has(key)) jit.set(key, rr(0.82, 1.12));
    pts.push(V(p.getX(i), p.getY(i) * 0.7, p.getZ(i)).multiplyScalar(jit.get(key)).add(c));
  }
  for (let i = 0; i < pts.length; i += 3) main.lit(pts[i], pts[i + 1], pts[i + 2], APRON2, V().subVectors(pts[i], c));
}

// Hexagonal crystal from base along dir, ice root to white point (the hub island's crystal shape).
function crystal(base, dir, r, h, sink = 0.08) {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  const at = (x, y, z) => V(x, y, z).applyQuaternion(q).add(base), lo = [], hi = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    lo.push(at(Math.cos(a) * r, -sink, Math.sin(a) * r)); hi.push(at(Math.cos(a) * r * 0.9, h * 0.7, Math.sin(a) * r * 0.9));
  }
  const tip = at(0, h, 0), axis = at(0, h * 0.4, 0);
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6, o = V().addVectors(lo[i], hi[j]).multiplyScalar(0.5).sub(axis);
    glow.tri(lo[i], lo[j], hi[j], CRYSTAL[0], o); glow.tri(lo[i], hi[j], hi[i], CRYSTAL[i % 2], o);
    glow.tri(hi[i], hi[j], tip, CRYSTAL[2], V().addVectors(hi[i], hi[j]).add(tip).divideScalar(3).sub(axis));
  }
}

export function buildDecor(rings) {
  [[0.06, 0.55, 0.06], [0.71, 0.6, 0.07], [0.92, 0.5, 0.06]].forEach(([u, t, s]) => boulder(apronPt(u, t).setY(0.02), s));
  const c = apronPt(0.4, 0.55);
  [[0, 0, 0.06, 0.32], [0.06, 0.04, 0.045, 0.22], [-0.05, 0.05, 0.04, 0.18]].forEach(([dx, dz, r, h]) =>
    crystal(c.clone().add(V(dx, 0, dz)), V(dx * 2, 1, dz * 2), r, h));
  const p = rings[7][5], n = V(p.x, -Math.hypot(p.x, p.z) * 0.7, p.z).normalize();
  const base = V(p.x * 0.86, p.y - 0.03, p.z * 0.86), side = V(-n.z, 0, n.x).normalize();
  [[0, 0.09, 0.42], [0.1, 0.065, 0.3], [-0.1, 0.06, 0.26]].forEach(([o, r, h]) =>
    crystal(base.clone().addScaledVector(side, o), n.clone().addScaledVector(side, o * 2.5), r, h, 0.16));
}
