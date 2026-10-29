// Small props: faceted rocks and lip chunks, mint vines, and the three groves around the
// clearing (boulder, mushrooms with glowing cap dots, tuft clumps).
import * as THREE from "three";
import { P, C, GRASS, STONE, VHI, MINT, CAP } from "./palette.mjs";
import { main, lamp, rr, rnd, rimR, heightAt, V } from "./shared.mjs";

// Faceted rock (sand boulder on top, chunk on the stone lip), sunk into its surface.
export function rock(c, s, sy, set) {
  const g = new THREE.IcosahedronGeometry(s, 0), p = g.attributes.position, jit = new Map(), pts = [];
  for (let i = 0; i < p.count; i++) {
    const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!jit.has(key)) jit.set(key, rr(0.82, 1.12));
    pts.push(V(p.getX(i), p.getY(i) * sy, p.getZ(i)).multiplyScalar(jit.get(key)).add(c));
  }
  for (let i = 0; i < pts.length; i += 3) main.lit(pts[i], pts[i + 1], pts[i + 2], set, V().subVectors(pts[i], c));
}
export function buildRockChunks() {
  for (let k = 0; k < 12; k++) {
    const a = k * 0.52 + rr(-0.12, 0.12), r = rimR(a) * 0.985;
    rock(V(Math.cos(a) * r, -0.6, Math.sin(a) * r), rr(0.1, 0.16), 0.8, k % 3 ? STONE : VHI);
  }
}

// Mint vines hanging from the earth band: two tapered segments with a slight outward bend.
export function buildVines() {
  for (let k = 0; k < 9; k++) {
    const a = k * 0.7 + 0.2 + rr(-0.1, 0.1), r = rimR(a) * 0.97, len = rr(0.55, 0.9);
    const b = V(Math.cos(a) * r, -0.32, Math.sin(a) * r), dir = V(Math.cos(a), 0, Math.sin(a));
    const tri3 = (ctr, rad) => [0, 1, 2].map((i) => V(ctr.x + Math.cos(a + i * 2.09) * rad, ctr.y, ctr.z + Math.sin(a + i * 2.09) * rad));
    const top = tri3(b, 0.075), mc = b.clone().addScaledVector(dir, 0.1), mid = tri3(mc.setY(b.y - len * 0.55), 0.05);
    const tip = b.clone().addScaledVector(dir, 0.08).setY(b.y - len);
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3, out = V().subVectors(mid[i], mc);
      main.lit(top[i], top[j], mid[j], MINT, out); main.lit(top[i], mid[j], mid[i], MINT, out);
      main.lit(mid[i], mid[j], tip, MINT, out);
    }
  }
}

export function pyramid(base, r, h, lean, color) {
  const tip = V(base.x + lean.x, base.y + h, base.z + lean.z), rot = rnd() * 6;
  const pts = [0, 1, 2].map((i) => V(base.x + Math.cos(rot + i * 2.09) * r, base.y, base.z + Math.sin(rot + i * 2.09) * r));
  for (let i = 0; i < 3; i++) main.tri(pts[i], pts[(i + 1) % 3], tip, color, V().subVectors(pts[i], base).add(V(0, 0.2, 0)));
}
// Mushroom: off-white stem, faceted coral cap, three glowing sun-yellow dots on the cap.
export function mushroom(x, z, s) {
  const y = heightAt(x, z) - 0.02, top = y + s * 1.5, stem = [], cap = [], rot = rnd() * 6;
  for (let i = 0; i < 6; i++) {
    const t = rot + (i / 6) * Math.PI * 2;
    stem.push([V(x + Math.cos(t) * s * 0.28, y, z + Math.sin(t) * s * 0.28), V(x + Math.cos(t) * s * 0.22, top, z + Math.sin(t) * s * 0.22)]);
    cap.push(V(x + Math.cos(t) * s, top - s * 0.05, z + Math.sin(t) * s));
  }
  const c = V(x, top, z), peak = V(x, top + s * 0.75, z), under = V(x, top - s * 0.15, z);
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6, out = V().subVectors(cap[i], c);
    main.lit(stem[i][0], stem[j][0], stem[j][1], STONE, out); main.lit(stem[i][0], stem[j][1], stem[i][1], STONE, out);
    main.lit(cap[i], cap[j], peak, CAP, out.clone().setY(0.6));
    main.tri(cap[i], cap[j], under, STONE[0], V(0, -1, 0));
  }
  for (let k = 0; k < 3; k++) {
    const t = rot + k * 2.1 + 0.5, d = V(Math.cos(t) * s * 0.55, s * 0.36, Math.sin(t) * s * 0.55).add(c), e = s * 0.2;
    lamp.tri(V(d.x - e, d.y, d.z), V(d.x + e, d.y, d.z - e), V(d.x, d.y + e * 1.4, d.z + e * 0.5), C(P.sun));
    lamp.tri(V(d.x - e, d.y, d.z), V(d.x, d.y + e * 1.4, d.z + e * 0.5), V(d.x + e * 0.2, d.y, d.z + e), C(P.sun));
    lamp.tri(V(d.x + e, d.y, d.z - e), V(d.x + e * 0.2, d.y, d.z + e), V(d.x, d.y + e * 1.4, d.z + e * 0.5), C(P.sun));
  }
}
// Three deliberate groups around the clearing: a boulder, big mushrooms, and a tuft clump each.
export function buildGroves() {
  [[2.45, 0.66], [5.0, 0.68], [0.55, 0.7]].forEach(([a, f], g) => {
    const [cx, cz] = [Math.cos(a) * rimR(a) * f, Math.sin(a) * rimR(a) * f], out = V(Math.cos(a), 0, Math.sin(a));
    const bx = cx + out.x * 0.32, bz = cz + out.z * 0.32, bs = [0.3, 0.27, 0.24][g];
    rock(V(bx, heightAt(bx, bz) + bs * 0.28, bz), bs, 0.72, STONE);
    [[0, 0, 0.21], [0.27, 0.15, 0.15], [-0.2, 0.22, 0.12]].forEach(([dx, dz, s]) => {
      const x = cx + dx * Math.cos(a) - dz * Math.sin(a), z = cz + dx * Math.sin(a) + dz * Math.cos(a);
      mushroom(x, z, s);
    });
    for (let t = 0; t < 7; t++) {
      const ang = a + (t - 3) * 0.13, rf = f + 0.1 + (t % 2) * 0.06;
      const x = Math.cos(ang) * rimR(ang) * rf, z = Math.sin(ang) * rimR(ang) * rf;
      const b = V(x, heightAt(x, z) - 0.01, z);
      for (let k = 0; k < 3; k++) {
        const la = k * 2.1 + t, h = rr(0.15, 0.24);
        pyramid(b, 0.045, h, V(Math.cos(la) * h * 0.45, 0, Math.sin(la) * h * 0.45), GRASS[k === 1 ? 0 : (t % 2 ? 2 : 1)]);
      }
    }
  });
}
