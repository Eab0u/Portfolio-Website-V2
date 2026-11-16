// Generic faceless footballer: one chunky low-poly runner in mid-stride, a solid electric blue shirt
// with ice side panels and a sun hem, off-white shorts, sand skin, night violet hair, coral socks and
// headband, violet boots with coral toes on glowing sun soles, on a grass tuft base. No numbers, crests or real kits.
// Base sits at y = 0, the runner faces +x. Parts live in tools/models/player/.
// Run from repo root: node tools/models/player.mjs (GLB is uncompressed, no Draco here).
import { P, C, mix } from "./lib/palette.mjs";
import { material, writeGlb } from "./lib/export.mjs";
import { shirt, pale, skin, sock, dark, hair, glow, grass } from "./player/shared.mjs";
import { buildBase, buildTufts } from "./player/base.mjs";
import { PALE_SUN, SKIN_SUN } from "./player/palette.mjs";
import { buildLegs } from "./player/legs.mjs";
import { buildTorso } from "./player/torso.mjs";
import { buildHead } from "./player/head.mjs";

// Build order is fixed: every part draws from one seeded random stream.
pale.sunSteps = PALE_SUN;
skin.sunSteps = SKIN_SUN;
buildBase();
buildLegs();
buildTorso();
buildHead();
buildTufts();

await writeGlb("public/models/player.glb", "Footballer", [
  { soup: grass, name: "Grass", material: material("GrassFlat", { roughness: 0.85, emissive: C(P.grass), emissiveIntensity: 0.1 }) },
  { soup: shirt, name: "Shirt", material: material("ShirtFlat", { roughness: 0.7, emissive: C(P.blue), emissiveIntensity: 0.3 }) },
  { soup: pale.warm, name: "CreamSun", material: material("CreamSunFlat", { roughness: 0.8, emissive: C(P.white), emissiveIntensity: 0.35 }) },
  { soup: pale.cool, name: "CreamShade", material: material("CreamShadeFlat", { roughness: 0.8, emissive: mix(P.white, P.sand, 0.55), emissiveIntensity: 0.55 }) },
  { soup: skin.warm, name: "Skin", material: material("SkinFlat", { roughness: 0.8, emissive: mix(P.sand, P.coral, 0.5), emissiveIntensity: 0.42 }) },
  { soup: skin.cool, name: "SkinShade", material: material("SkinShadeFlat", { roughness: 0.8, emissive: mix(P.coral, P.white, 0.3), emissiveIntensity: 0.32 }) },
  { soup: sock, name: "Socks", material: material("SockFlat", { roughness: 0.8, emissive: mix(P.garnet, P.coral, 0.35).lerp(C(P.violet), 0.1), emissiveIntensity: 0.45 }) },
  { soup: dark, name: "Boots", material: material("BootFlat", { roughness: 0.6, emissive: C(P.violet), emissiveIntensity: 0.15 }) },
  { soup: hair, name: "Hair", material: material("HairFlat", { roughness: 0.6, emissive: C(P.violet), emissiveIntensity: 0.18 }) },
  { soup: glow, name: "Soles", material: material("SoleFlat", { roughness: 0.5, emissive: C(P.sun), emissiveIntensity: 0.35 }) },
]);
