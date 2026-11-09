// Racing island: a flat-topped floating ice island with an oval race track baked into the top. A wide
// deep blue banked track with red and white kerbs, a dashed center line and a checkered start line,
// a mint infield, a snow apron, then the hub island's family underside (ice cliff, stone lip, violet
// strata, coral tip). Tall pieces (grandstand, control tower, start gantry, light poles) break the
// silhouette so the track reads from a low camera. Top surface at y = 0, centered on x/z.
// Parts live in tools/models/racing-island/. Original, generic art: no real circuit, marks or liveries.
// Run from repo root: node tools/models/racing-island.mjs -> public/models/racing-island.glb (uncompressed).
import { P, C } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { main, paint, lamp, glow } from "./racing-island/shared.mjs";
import { buildTop } from "./racing-island/top.mjs";
import { buildUnderside, buildIcicles, buildSpikes } from "./racing-island/underside.mjs";
import { buildGrandstand, buildPits, buildGantry } from "./racing-island/buildings.mjs";
import { buildPoles, buildTyres, buildDecor } from "./racing-island/props.mjs";

// Build order is fixed: every part draws from one seeded random stream.
const rings = buildUnderside(buildTop());
buildIcicles(); buildSpikes();
buildGrandstand(); buildPits(); buildGantry();
buildPoles(); buildTyres(); buildDecor(rings);

await writeGlb("public/models/racing-island.glb", "RacingIsland", [
  { soup: main, name: "RacingIslandBody", material: material("RacingIslandFlat") },
  { soup: paint, name: "TrackPaint", material: material("PaintFlat", { roughness: 0.6, emissive: C(P.white), emissiveIntensity: 0.25 }) },
  { soup: glow, name: "IceGlow", material: material("IceGlow", { roughness: 0.4, emissive: C(P.ice), emissiveIntensity: 0.35 }) },
  { soup: lamp, name: "Lamps", material: material("LampGlow", { emissive: C(P.sun), emissiveIntensity: 1.2 }) },
]);
