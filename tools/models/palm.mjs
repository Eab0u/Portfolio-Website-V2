// Palm tree prop: a curved faceted trunk with sand ridge shelves, seven broad folded fronds in
// three green values with sun midribs, three coral coconuts under the crown, on a sand mound
// with a foam ring, blue lagoon disc, starfish, a fallen coconut, pebbles and grass tufts.
// Base sits at y = 0, centered on x/z. Parts live in tools/models/palm/.
// Run from repo root: node tools/models/palm.mjs (GLB is uncompressed, no Draco here).
import { P, C } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { ground, foam, wood, leaves, nuts } from "./palm/shared.mjs";
import { buildGround, buildProps } from "./palm/base.mjs";
import { buildTrunk } from "./palm/trunk.mjs";
import { buildFronds } from "./palm/fronds.mjs";
import { buildCoconuts } from "./palm/coconuts.mjs";

// Build order is fixed: every part draws from one seeded random stream.
buildGround();
buildTrunk();
buildFronds();
buildCoconuts();
buildProps();

await writeGlb("public/models/palm.glb", "PalmTree", [
  { soup: ground, name: "Ground", material: material("GroundFlat", { roughness: 0.85 }) },
  { soup: foam, name: "Foam", material: material("FoamFlat", { roughness: 0.9, emissive: C(P.white), emissiveIntensity: 0.3 }) },
  { soup: wood, name: "Trunk", material: material("TrunkFlat", { roughness: 0.85, emissive: C(P.coral), emissiveIntensity: 0.12 }) },
  { soup: leaves, name: "Fronds", material: material("FrondFlat", { roughness: 0.8, emissive: C(P.grass), emissiveIntensity: 0.1 }) },
  { soup: nuts, name: "Coconuts", material: material("CoconutFlat", { roughness: 0.5, emissive: C(P.sun), emissiveIntensity: 0.3 }) },
]);
