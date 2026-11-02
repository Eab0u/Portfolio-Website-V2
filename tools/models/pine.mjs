// Pine tree prop: four faceted tiers of drooping, ridged branches (blue-green, grass, mint) with frosted ice
// tips, tapering into a spire with a glowing sun star, coral, garnet, violet and two sun baubles under
// the branch tips, on a round lavender rock with a sand and coral needle bed, mushrooms, pebbles and tufts.
// The rock base is centered on x/z around y = 0. Parts live in tools/models/pine/.
// Run from repo root: node tools/models/pine.mjs (GLB is uncompressed, no Draco here).
import { P, C } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { rock, bark, needles, frost, decor, glow } from "./pine/shared.mjs";
import { buildBase } from "./pine/base.mjs";
import { buildTiers } from "./pine/tiers.mjs";
import { buildOrnaments } from "./pine/ornaments.mjs";
import { buildProps } from "./pine/props.mjs";

// Build order is fixed: every part draws from one seeded random stream.
buildBase();
buildTiers();
buildOrnaments();
buildProps();

await writeGlb("public/models/pine.glb", "PineTree", [
  { soup: rock, name: "Rock", material: material("RockFlat", { roughness: 0.85 }) },
  { soup: bark, name: "Trunk", material: material("BarkFlat", { roughness: 0.85, emissive: C(P.coral), emissiveIntensity: 0.1 }) },
  { soup: needles, name: "Tiers", material: material("NeedleFlat", { roughness: 0.8, emissive: C(P.grass), emissiveIntensity: 0.08 }) },
  { soup: frost, name: "Frost", material: material("FrostFlat", { roughness: 0.6, emissive: C(P.ice), emissiveIntensity: 0.15 }) },
  { soup: decor, name: "Ornaments", material: material("OrnamentFlat", { roughness: 0.45 }) },
  { soup: glow, name: "Glow", material: material("GlowFlat", { roughness: 0.5, emissive: C(P.sun), emissiveIntensity: 0.35 }) },
]);
