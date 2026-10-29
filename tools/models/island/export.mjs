// Packs the island's three soups into named meshes and writes the GLB via the shared exporter.
import { P, C } from "../lib/palette.mjs";
import { material, writeGlb } from "../lib/export.mjs";
import { main, glow, lamp } from "./shared.mjs";

export const writeIslandGlb = (path) => writeGlb(path, "Island", [
  { soup: main, name: "IslandBody", material: material("IslandFlat") },
  { soup: glow, name: "IslandCrystals", material: material("CrystalGlow", { roughness: 0.4, emissive: C(P.mint), emissiveIntensity: 0.35 }) },
  { soup: lamp, name: "CapLights", material: material("CapGlow", { emissive: C(P.sun), emissiveIntensity: 1.2 }) },
]);
