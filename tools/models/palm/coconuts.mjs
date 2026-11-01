// Three big sun-yellow coconuts (coral undersides) hanging below the frond bases, set in the frond
// gaps that face the views and pushed out past the trunk so at least two read from most views.
// Each has a dark-green cap on a light-yellow bevel ring, and a dark-green stem, facing up.
import { NUT, NUT_BEVEL, STEM } from "./palette.mjs";
import { nuts, leaves, ball, band, fan, ringAround, V } from "./shared.mjs";
import { TOP } from "./trunk.mjs";

// A coconut: faceted ball, light-yellow bevel ring, dark-green cap and stem along `ax`.
export function coconut(c, r, ax) {
  ball(nuts, c, r, NUT, 1.1);
  const out = (p) => V().subVectors(p, c);
  const bevel = ringAround(c.clone().addScaledVector(ax, r * 0.62), ax, r * 0.86, 6, 0.5);
  const cap = ringAround(c.clone().addScaledVector(ax, r * 0.86), ax, r * 0.66, 6, 0.5);
  band(nuts, bevel, cap, NUT_BEVEL, out);
  fan(leaves, cap, c.clone().addScaledVector(ax, r * 1.08), STEM, out);
  const stem = ringAround(c.clone().addScaledVector(ax, r * 1.0), ax, r * 0.2, 5, 0);
  fan(leaves, stem, c.clone().addScaledVector(ax, r * 1.6), STEM, out);
}

// Frond-gap azimuths facing views 0, 1-2 and 3 (deg), with small height offsets.
const NUTS = [[54, 0], [188, -0.05], [311, -0.02]];

export function buildCoconuts() {
  NUTS.forEach(([deg, dy]) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const ax = V(-c * 0.45, 1, -s * 0.45).normalize();
    coconut(V(TOP.x + c * 0.46, TOP.y - 0.34 + dy, TOP.z + s * 0.46), 0.24, ax);
  });
}
