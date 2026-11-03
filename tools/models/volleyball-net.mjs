// Volleyball net prop: two chamfered blue posts with glowing sun caps, coral clamps and guy ropes to
// coral stakes, an open woven lattice of mint and ice bars drooping to a garnet cable under an off-white top tape, coral side tapes and
// banded antennas, on a long faceted sand pad with sand footings, ripples, pebbles and grass tufts.
// Base sits at y = 0, centered on x/z. Parts live in tools/models/volleyball-net/.
// Run from repo root: node tools/models/volleyball-net.mjs (GLB is uncompressed, no Draco here).
import { P, C } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { ground, posts, mesh, tape, trim, glow } from "./volleyball-net/shared.mjs";
import { buildPad, buildGroundProps } from "./volleyball-net/base.mjs";
import { buildPosts } from "./volleyball-net/posts.mjs";
import { buildNet } from "./volleyball-net/net.mjs";

// Build order is fixed: every part draws from one seeded random stream.
buildPad();
buildPosts();
buildNet();
buildGroundProps();

await writeGlb("public/models/volleyball-net.glb", "VolleyballNet", [
  { soup: ground, name: "Ground", material: material("SandFlat", { roughness: 0.85, emissive: C(P.coral), emissiveIntensity: 0.07 }) },
  { soup: posts, name: "Posts", material: material("PostFlat", { roughness: 0.6, emissive: C(P.blue), emissiveIntensity: 0.12 }) },
  { soup: mesh, name: "Net", material: material("NetFlat", { roughness: 0.7, emissive: C(P.mint), emissiveIntensity: 0.14 }) },
  { soup: tape, name: "Tapes", material: material("TapeFlat", { roughness: 0.7, emissive: C(P.coral), emissiveIntensity: 0.14 }) },
  { soup: trim, name: "Trim", material: material("TrimFlat", { roughness: 0.7, emissive: C(P.white), emissiveIntensity: 0.28 }) },
  { soup: glow, name: "Caps", material: material("CapFlat", { roughness: 0.5, emissive: C(P.sun), emissiveIntensity: 0.35 }) },
]);
