// The glowing core: a chamfered hex bipyramid seated in the cluster center on a small mint
// ground patch, ringed by a collar of short mint petals so it reads as the glowing heart.
// Saturated mint body, hot near-white upper facets, and two small ice shards poking through.
import { CORE, CORE_TOP, MINT } from "./palette.mjs";
import { core, rock, band, fan, mound, V } from "./shared.mjs";
import { crystal } from "./spires.mjs";
import { TOP_Y } from "./base.mjs";

function gem(c, r, h, twist = 0) {
  const ring = (y, s) => Array.from({ length: 6 }, (_, i) => {
    const a = ((i + twist) / 6) * Math.PI * 2;
    return V(c.x + Math.cos(a) * r * s, c.y + y, c.z + Math.sin(a) * r * s);
  });
  const hi = ring(h * 0.22, 1), lo = ring(-h * 0.22, 1), out = (p) => V().subVectors(p, c);
  band(core, lo, hi, CORE, out);
  fan(core, hi, V(c.x, c.y + h, c.z), CORE_TOP, out);
  fan(core, lo, V(c.x, c.y - h, c.z), CORE, out);
}

export function buildCore() {
  mound(rock, V(0, TOP_Y + 0.07, 0), 0.34, 0.2, 0.03, MINT, 6, 0.5);
  gem(V(0, TOP_Y + 0.52, 0), 0.25, 0.46, 0.5);
  // Two small ice shards growing out through the core, on opposite sides.
  crystal(V(0.04, TOP_Y + 0.42, 0.04), V(1, 0.9, 0.6), 0.05, 0.36, "ice", { vein: "ice", sink: 0 });
  crystal(V(-0.04, TOP_Y + 0.4, -0.04), V(-0.8, 0.9, -1), 0.045, 0.32, "ice", { vein: "ice", sink: 0 });
  // Collar: six short petals leaning out from the core's lower point.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    crystal(V(c * 0.13, TOP_Y + 0.08, s * 0.13), V(c * 1.3, 1, s * 1.3), 0.05, 0.26, "core", { sink: 0.04 });
  }
}
