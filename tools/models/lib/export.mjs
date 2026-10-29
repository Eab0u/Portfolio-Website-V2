// GLB export in Node: FileReader polyfill, soup-to-mesh conversion, and the binary file write.
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { mkdirSync, writeFileSync } from "node:fs";

// Node polyfill so GLTFExporter can build a binary GLB.
globalThis.FileReader = class {
  _done(r) { this.result = r; this.onload?.({ target: this }); this.onloadend?.({ target: this }); }
  readAsArrayBuffer(b) { b.arrayBuffer().then((r) => this._done(r)); }
  readAsDataURL(b) {
    b.arrayBuffer().then((r) => this._done(`data:${b.type || "application/octet-stream"};base64,${Buffer.from(r).toString("base64")}`));
  }
};

export const material = (name, extra = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0, name, ...extra });

function toMesh(s, name, mat) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(s.pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(s.col, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat); m.name = name; return m;
}

// parts: [{ soup, name, material }]. Writes one binary GLB with a named group and returns the triangle count.
export async function writeGlb(path, groupName, parts) {
  const group = new THREE.Group(); group.name = groupName;
  for (const p of parts) group.add(toMesh(p.soup, p.name, p.material));
  const glb = await new GLTFExporter().parseAsync(group, { binary: true });
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, Buffer.from(glb));
  const tris = parts.reduce((n, p) => n + p.soup.tris, 0);
  console.log(`${path.slice(path.lastIndexOf("/") + 1)}: ${tris} triangles, ${(glb.byteLength / 1024).toFixed(1)} KB`);
  return tris;
}
