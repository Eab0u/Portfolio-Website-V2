# Model generators

Each 3D model in `public/models/` is built by a deterministic script in this folder (Node) or in `tools/blender/` (Blender Python). Same script, same GLB.

## Workflow
1. Read `ART_DIRECTION.md` first. Use only palette colors, flat shading, and the three detail scales (primary, secondary, tertiary).
2. Write `tools/models/<name>.mjs`. Build the model from named parts, one function per part. No randomness unless it uses a fixed seed.
3. Run it from the repo root: `node tools/models/<name>.mjs`. It writes `public/models/<name>.glb`.
4. Check the budget: GLB under 1 MB (Draco when available) and under 20k triangles. Small props should stay between 300 and 2,000 triangles.
5. Preview it: run `npm run dev` and open `/dev/model-preview?src=/models/<name>.glb&angle=0` (angles 0 to 3).
6. Run `node tools/model-check.mjs <name> roundN` (preview server on port 3100). It renders lit and unlit images and prints numbers you must fix before a critic sees the model: frame size, shadow saturation, grey share, hue drift from lighting, pink shift, shadow to light value. Unlit preview: add `&unlit=1` to the preview URL.
7. Take screenshots with `node tools/shot.mjs <url> <out.png>` (first run `npm i --no-save playwright`, see the header of `tools/shot.mjs`) and send them to the artist critic.

## Shared helpers (`tools/models/lib/`)
Every generator imports these instead of copying them: `rng.mjs` (seeded random numbers), `palette.mjs` (palette tokens and color helpers), `soup.mjs` (triangle soup with sun-shaded faces, one consistent sun), `shade.mjs` (`ramp(hex)` returns light, mid and shadow colors with hue-shifted, saturated shadows; never hand-pick shadow hexes), `rings.mjs` (band and fan), and `export.mjs` (Node GLB export). Put anything generic that a second model could use here, and keep model-specific parts in `tools/models/<name>/`. See `tools/models/island/` for an example.

## Rules
- Original, generic art only. No logos, crests, wordmarks, or lookalikes of real brands, characters, or vehicles.
- Commit the script and the GLB together, in one commit.
- If headless Blender is not available, use Node or procedural Three.js geometry instead. Do not block on it.
- Scripts that need a new dev dependency must have a ticket that allows it.

## Lighting (read before you color anything)
The preview and the real scene share one set of lights, including a cool ice fill from behind and below. It strips red and adds blue on back and downward faces, so these colors dull or shift once lit: sand and peach (go olive or brown), violet (goes indigo), ice and cyan (go denim), garnet (goes near black), and off-white (goes grey). Neutral off-white has no color to hold, so use cream, mint or ice tints for pale parts.
Fix it in the material, never by changing the lights:
1. Put the affected color set in its own mesh (see `palm.mjs`: Foam, Trunk, Fronds and Coconuts each have a soft `emissive` tint, intensity 0.1 to 0.5, chosen to counter the fill, e.g. coral on the wood trunk).
2. Pre-compensate the albedo: nudge the hue away from what the fill adds (toward cyan or mint for ice, toward coral for sand), and keep the shade step light enough to stay saturated.
3. Check with `node tools/model-check.mjs <name> roundN`: the per-surface table prints each big surface as `unlit -> lit`, along with `satKept` (color surviving the light) and `greyMid` (lit grey mid-tones). A surface that is fine unlit but shifted lit is a lighting problem, so apply 1 and 2.
