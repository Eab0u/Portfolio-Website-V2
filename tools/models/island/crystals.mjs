// Glowing mint-to-ice crystals: one cluster on the back mound, one trio in the lower rock.
import * as THREE from "three";
import { CRYSTAL } from "./palette.mjs";
import { glow, heightAt, HILL, V } from "./shared.mjs";

// A hexagonal crystal (prism + point) growing from base along dir, mint root to ice point.
export function crystal(base, dir, r, h, sinkDepth = 0.1) {
  const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), dir.clone().normalize());
  const at = (x, y, z) => V(x, y, z).applyQuaternion(q).add(base);
  const lo = [], hi = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    lo.push(at(Math.cos(a) * r, -sinkDepth, Math.sin(a) * r));
    hi.push(at(Math.cos(a) * r * 0.9, h * 0.7, Math.sin(a) * r * 0.9));
  }
  const tipP = at(0, h, 0), axis = at(0, h * 0.4, 0);
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6, out = V().addVectors(lo[i], hi[j]).multiplyScalar(0.5).sub(axis);
    glow.tri(lo[i], lo[j], hi[j], CRYSTAL[0], out); glow.tri(lo[i], hi[j], hi[i], CRYSTAL[i % 2], out);
    glow.tri(hi[i], hi[j], tipP, CRYSTAL[2], V().addVectors(hi[i], hi[j]).add(tipP).divideScalar(3).sub(axis));
  }
}
// One big cluster on the back mound, one tidy trio seated flush in the lower rock.
export function buildCrystals(rings) {
  const top = V(HILL.x, heightAt(HILL.x, HILL.z) - 0.03, HILL.z);
  crystal(top, V(0.1, 1, -0.15), 0.1, 0.62);
  [[-0.4, 0.35, 0.065, 0.36], [0.35, -0.3, 0.06, 0.3], [0.1, 0.45, 0.05, 0.24]].forEach(([dx, dz, r, h]) =>
    crystal(top.clone().add(V(dx * 0.3, -0.02, dz * 0.3)), V(dx, 1, dz), r, h));
  const p = rings[7][4], n = V(p.x, -Math.hypot(p.x, p.z) * 0.7, p.z).normalize();
  const base = V(p.x * 0.86, p.y - 0.03, p.z * 0.86), side = V(-n.z, 0, n.x).normalize();
  [[0, 0.09, 0.42], [0.1, 0.065, 0.3], [-0.1, 0.06, 0.26]].forEach(([o, r, h]) =>
    crystal(base.clone().addScaledVector(side, o), n.clone().addScaledVector(side, o * 2.5), r, h, 0.16));
}
