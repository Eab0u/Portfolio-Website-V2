// GLB export in Node: FileReader polyfill, soup-to-mesh conversion, and the file write.
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { P, C } from "./palette.mjs";
import { main, glow, lamp } from "./shared.mjs";

// Node polyfill so GLTFExporter can build a binary GLB.
globalThis.FileReader = class {
  _done(r) { this.result = r; this.onload?.({ target: this }); this.onloadend?.({ target: this }); }
  readAsArrayBuffer(b) { b.arrayBuffer().then((r) => this._done(r)); }
  readAsDataURL(b) {
    b.arrayBuffer().then((r) => this._done(`data:${b.type || "application/octet-stream"};base64,${Buffer.from(r).toString("base64")}`));
  }
};

function toMesh(s, name, material) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s.pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(s.col, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, material); m.name = name; return m;
}

// Packs the three soups into named meshes and writes the binary GLB.
export async function writeIslandGlb(path) {
  const island = new THREE.Group(); island.name = "Island";
  const mat = (name, extra = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0, name, ...extra });
  island.add(toMesh(main, "IslandBody", mat("IslandFlat")));
  island.add(toMesh(glow, "IslandCrystals", mat("CrystalGlow", { roughness: 0.4, emissive: C(P.mint), emissiveIntensity: 0.35 })));
  island.add(toMesh(lamp, "CapLights", mat("CapGlow", { emissive: C(P.sun), emissiveIntensity: 1.2 })));
  const glb = await new GLTFExporter().parseAsync(island, { binary: true });
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, Buffer.from(glb));
  console.log(`island.glb: ${main.tris + glow.tris + lamp.tris} triangles, ${(glb.byteLength / 1024).toFixed(1)} KB`);
}
