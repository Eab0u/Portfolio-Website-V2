// Referee high chair prop: a blue frame and ladder, garnet seat, and a coral and ice sunshade on a sand disc.
// Base sits at y = 0, centered on x/z. Parts live in tools/models/referee-chair/.
// Run from repo root: node tools/models/referee-chair.mjs (GLB is uncompressed, no Draco here).
import { P, C } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { ground, frame, cloth, stripe, canopy, trim, glow } from "./referee-chair/shared.mjs";
import { buildMound, buildGroundProps } from "./referee-chair/base.mjs";
import { buildFrame } from "./referee-chair/frame.mjs";
import { buildSeat } from "./referee-chair/seat.mjs";
import { buildUmbrella } from "./referee-chair/umbrella.mjs";

// Build order is fixed: every part draws from one seeded random stream.
buildMound();
buildFrame();
buildSeat();
buildUmbrella();
buildGroundProps();

await writeGlb("public/models/referee-chair.glb", "RefereeChair", [
  { soup: ground, name: "Ground", material: material("SandFlat", { roughness: 0.85, emissive: C(P.coral), emissiveIntensity: 0.09 }) },
  { soup: frame, name: "Frame", material: material("FrameFlat", { roughness: 0.6, emissive: C(P.blue), emissiveIntensity: 0.12 }) },
  { soup: cloth, name: "Cloth", material: material("ClothFlat", { roughness: 0.75, emissive: C(P.coral), emissiveIntensity: 0.12 }) },
  { soup: canopy, name: "Canopy", material: material("CanopyFlat", { roughness: 0.75, emissive: C(P.coral), emissiveIntensity: 0.05 }) },
  { soup: stripe, name: "Stripes", material: material("StripeFlat", { roughness: 0.75, emissive: C(P.ice), emissiveIntensity: 0.12 }) },
  { soup: trim, name: "Trim", material: material("TrimFlat", { roughness: 0.7, emissive: C(P.white), emissiveIntensity: 0.3 }) },
  { soup: glow, name: "Caps", material: material("CapFlat", { roughness: 0.5, emissive: C(P.sun), emissiveIntensity: 0.35 }) },
]);
