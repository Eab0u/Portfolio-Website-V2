# Model generators

Each 3D model in `public/models/` is built by a deterministic script in this folder (Node) or in `tools/blender/` (Blender Python). Same script, same GLB.

## Workflow
1. Read `ART_DIRECTION.md` first. Use only palette colors, flat shading, and the three detail scales (primary, secondary, tertiary).
2. Write `tools/models/<name>.mjs`. Build the model from named parts, one function per part. No randomness unless it uses a fixed seed.
3. Run it from the repo root: `node tools/models/<name>.mjs`. It writes `public/models/<name>.glb`.
4. Check the budget: GLB under 500 KB (Draco compressed) and under 20k triangles. Small props should stay between 300 and 2,000 triangles.
5. Preview it: run `npm run dev` and open `/dev/model-preview?src=/models/<name>.glb&angle=0` (angles 0 to 3).
6. Take screenshots with `node tools/shot.mjs <url> <out.png>` (first run `npm i --no-save playwright`, see the header of `tools/shot.mjs`) and send them to the artist critic.

## Shared helpers (`tools/models/lib/`)
Every generator imports these instead of copying them: `rng.mjs` (seeded random numbers), `palette.mjs` (palette tokens and color helpers), `soup.mjs` (triangle soup with sun-shaded faces, one consistent sun), and `export.mjs` (Node GLB export). Put anything generic that a second model could use here, and keep model-specific parts in `tools/models/<name>/`. See `tools/models/island/` for an example.

## Rules
- Original, generic art only. No logos, crests, wordmarks, or lookalikes of real brands, characters, or vehicles.
- Commit the script and the GLB together, in one commit.
- If headless Blender is not available, use Node or procedural Three.js geometry instead. Do not block on it.
- Scripts that need a new dev dependency must have a ticket that allows it.
