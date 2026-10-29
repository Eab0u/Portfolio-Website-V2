// Floating hub island. Fixed bands top to bottom: grass (beveled rim + drips), one earth
// band, one sand stone band with a lip, then violet strata with ice-lit ledges and a coral
// tip. Props: fused stalactites, rock chunks, mint vines, groves of boulders, mushrooms
// and tufts, glowing mint crystals. The center plateau stays clear for the tree set.
// Top surface sits at y = 0, centered on x/z. Parts live in tools/models/island/.
// Run from repo root: node tools/models/island.mjs -> public/models/island.glb
// The GLB is uncompressed (no Draco in the sandbox); see the compress:models ticket.
import { buildTop } from "./island/top.mjs";
import { buildRimAndUnderside, buildSpikes } from "./island/underside.mjs";
import { buildCrystals } from "./island/crystals.mjs";
import { buildRockChunks, buildVines, buildGroves } from "./island/props.mjs";
import { writeIslandGlb } from "./island/export.mjs";

// Build order is fixed: every part draws from one seeded random stream.
const rings = buildRimAndUnderside(buildTop());
buildSpikes(); buildCrystals(rings); buildRockChunks(); buildVines(); buildGroves();
await writeIslandGlb("public/models/island.glb");
