// Crystals in several profiles (prism, strip, stepped, chunky, double-terminated), with flat-cut
// or slanted tops, colored band trims, a bevelled tower, warm contact rings, small shards leaning
// on the big ones, and a ring of rim shards.
import * as THREE from "three";
import { MINT, VIOLET, COLLAR, RING, CORE_ICE, CONTACT } from "./palette.mjs";
import { mint, violet, core, rock, band, fan, mound, rr, V } from "./shared.mjs";
import { TOP_Y } from "./base.mjs";

const HUES = { mint: [mint, MINT], violet: [violet, VIOLET], core: [core, COLLAR], ice: [core, CORE_ICE] };
// Profiles as [height fraction, radius scale, "body" | "ring"] stations from base to apex.
const PROFILES = {
  prism: [[0.64, 0.96, "body"], [0.69, 0.84, "ring"], [0.85, 0.5, "body"]],
  strip: [[0.36, 1, "body"], [0.4, 0.9, "ring"], [0.66, 0.9, "body"], [0.7, 0.78, "ring"], [0.86, 0.46, "body"]],
  stepped: [[0.5, 1, "body"], [0.54, 0.8, "ring"], [0.72, 0.78, "body"], [0.76, 0.56, "ring"], [0.9, 0.3, "body"]],
  chunky: [[0.7, 1, "body"], [0.78, 0.82, "ring"], [0.9, 0.5, "body"]],
};

// One crystal grown from `base` along `dir`. `opts`: profile, sink depth, double point, vein
// (band color set), tip (sideways apex offset in radii), flat (flat-cut top), bevel (chamfered
// vertical edges in the bright step).
export function crystal(base, dir, r, h, hue, opts = {}) {
  const { profile = "prism", sink = 0.14, double = false, vein = hue, tip = 0, flat = false, bevel = false } = opts;
  const [soup, set] = HUES[hue];
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize()), qi = q.clone().invert();
  const at = (x, y, z) => V(x, y, z).applyQuaternion(q).add(base);
  const k = rr(0, 1), jit = Array.from({ length: 6 }, () => rr(0.88, 1.1));
  const corners = bevel ? [-0.07, 0.07] : [0];
  const ring = (y, s) => jit.flatMap((j, i) => corners.map((d) => {
    const a = ((i + k + d) / 6) * Math.PI * 2, rs = r * s * j * (bevel ? 0.97 : 1);
    return at(Math.cos(a) * rs, y, Math.sin(a) * rs);
  }));
  const out = (p) => { const ax = V().subVectors(p, base).applyQuaternion(qi); return V(ax.x, 0, ax.z).applyQuaternion(q); };
  const pick = (s) => (i) => (bevel && i % 2 === 0 ? RING[hue] : s);
  let prev = ring(-sink, 1), top = 0;
  if (double) fan(soup, prev, at(0, -sink - h * 0.18, 0), set, out);
  for (const [f, s, kind] of PROFILES[profile]) {
    if (flat && f > 0.8) break;
    const next = ring(h * f, s), bandSet = kind === "ring" ? RING[vein] : set;
    band(soup, prev, next, bandSet, out, kind === "ring" ? () => bandSet : pick(set));
    prev = next; top = h * f;
  }
  if (flat) fan(soup, prev, at(0, top + h * 0.04, 0), RING[hue], () => at(0, 1, 0).sub(base));
  else fan(soup, prev, at(r * tip, h, 0), set, out, pick(set));
}

const rad = (d) => (d * Math.PI) / 180;
// [azimuth deg, base radius, lean, radius, height, hue, opts, contact ring]. Tall ones sit between
// the four preview angles so the core stays in view; short ones face the cameras, below it.
const CLUSTER = [
  [188, 0.3, 0.32, 0.17, 1.5, "violet", { profile: "stepped", vein: "ice", bevel: true }, true],
  [98, 0.34, 0.42, 0.14, 1.2, "mint", { profile: "prism", tip: 0.45, vein: "coral" }, true],
  [8, 0.38, 0.55, 0.18, 0.72, "violet", { profile: "chunky", vein: "coral", flat: true }, true],
  [278, 0.32, 0.38, 0.15, 1.3, "mint", { profile: "strip", vein: "sun", flat: true }, true],
  [55, 0.54, 0.75, 0.09, 0.55, "mint", { vein: "sun", flat: true }, false],
  [148, 0.42, 2.2, 0.08, 0.4, "violet", { double: true, sink: -0.04 }, false],
  [235, 0.54, 0.65, 0.08, 0.5, "mint", {}, false],
];
// Small bevelled shards leaning on the big crystals: [azimuth of host, side offset deg, hue].
const LEANERS = [[188, 30, "mint"], [98, -28, "violet"], [278, 26, "violet"]];

export function buildCluster() {
  for (const [deg, d, lean, r, h, hue, opts, contact] of CLUSTER) {
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a), base = V(c * d, TOP_Y, s * d);
    if (contact) mound(rock, base, r * 2.1, r * 1.3, 0.03, CONTACT, 6, rr(0, 1));
    crystal(base, V(c * lean, 1, s * lean), r, h, hue, opts);
  }
  for (const [deg, off, hue] of LEANERS) {
    const a = rad(deg + off), c = Math.cos(a), s = Math.sin(a), toward = rad(deg);
    const dir = V(Math.cos(toward) - c * 0.6, 1.4, Math.sin(toward) - s * 0.6);
    crystal(V(c * 0.52, TOP_Y, s * 0.52), dir, 0.05, 0.32, hue, { vein: "ice", sink: 0.06 });
  }
}

// Small shards around the rim, alternating violet and mint, leaning well outward.
export function buildShards() {
  const hues = ["violet", "mint"];
  [12, 75, 128, 172, 215, 262, 300, 345].forEach((deg, i) => {
    const a = rad(deg + rr(-6, 6)), d = rr(0.56, 0.64), c = Math.cos(a), s = Math.sin(a);
    crystal(V(c * d, TOP_Y - 0.03, s * d), V(c * 0.9, 1, s * 0.9), rr(0.04, 0.06), rr(0.16, 0.3), hues[i % 2], { sink: 0.08 });
  });
}
