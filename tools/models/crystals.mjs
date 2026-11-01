// Crystal cluster prop: seven chamfered crystals (mint and violet, in several profiles, two
// with coral veins) around one glowing mint core with a petal collar, rim shards, grass tufts,
// rock chunks and pebbles, on a blue-violet rock rim with an off-white trim and a sand top. Base sits at y = 0,
// centered on x/z. Parts live in tools/models/crystals/.
// Run from repo root: node tools/models/crystals.mjs (GLB is uncompressed, no Draco here).
import { P, C } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { rock, rim, mint, violet, core } from "./crystals/shared.mjs";
import { buildBase, buildPebbles } from "./crystals/base.mjs";
import { buildCluster, buildShards } from "./crystals/spires.mjs";
import { buildCore } from "./crystals/core.mjs";
import { buildTufts } from "./crystals/tufts.mjs";

// Build order is fixed: every part draws from one seeded random stream.
buildBase();
buildCluster();
buildShards();
buildPebbles();
buildCore();
buildTufts();

const gem = (name, hex, k, rough = 0.45) => material(name, { roughness: rough, emissive: C(hex), emissiveIntensity: k });
await writeGlb("public/models/crystals.glb", "CrystalCluster", [
  { soup: rock, name: "RockBase", material: material("RockFlat", { roughness: 0.9 }) },
  { soup: rim, name: "RockRim", material: material("RimFlat", { roughness: 0.9, emissive: C(P.violet), emissiveIntensity: 0.22 }) },
  { soup: mint, name: "MintCrystals", material: gem("MintCrystal", P.mint, 0.1) },
  { soup: violet, name: "VioletCrystals", material: gem("VioletCrystal", P.violet, 0.2) },
  { soup: core, name: "GlowCore", material: gem("CoreGlow", P.mint, 0.3, 1) },
]);
