# Art direction

The look: colorful, charming, faceted low-poly. Think a toy diorama lit by a warm sun at dusk, with glowing accents. Detailed enough to reward a close look, simple enough to read at a glance. Nothing grey, muddy, or default-material.

## Palette (use these tokens, do not invent random colors)
| Role | Hex |
|---|---|
| Night base (sky, shadows) | #0a0b10 to #1a1f3a |
| Mint (main accent) | #7cf0c8 |
| Electric blue | #2f6bff |
| Garnet | #c0194f |
| Sun yellow | #ffd23f |
| Coral | #ff6b57 |
| Violet | #8b5cff |
| Sand | #f2c98a |
| Grass | #3ddc84 |
| Ice | #9be7ff |
| Off-white (highlights) | #f4f1ea |

Rules: every object uses 1 dominant color, 1 or 2 supporting colors, and at most 1 glowing accent. Neighbor objects should contrast in hue or value. Shadows lean blue or violet, never pure black.

## Shading and form
- Flat shading everywhere. Faceted forms. Slight chamfers or bevels on hard edges so highlights catch them.
- Use 3 value steps per color (light, mid, dark) via vertex colors or separate materials, lit from one consistent sun direction (upper left, warm).
- Emissive accents (windows, crystals, lights) feed the bloom pass. Keep emissive areas small and intentional.
- Strong silhouette first. A model should be recognizable as a flat black shape.

## Detail budget (three scales)
1. **Primary:** the big readable shape.
2. **Secondary:** 3 to 6 distinct sub-parts (a wing, a window row, a roof, a fin) in a supporting color.
3. **Tertiary:** small touches (rivets, stripes, lights, trims, little props) that reward a close look.
A model that has only a primary shape is unfinished.

## Triangle and size budget
- Small props: 300 to 2,000 triangles. Hero pieces (car, stadium, hub): 2,000 to 12,000. Hard max 20,000.
- GLB under 500 KB, Draco compressed. Prefer instancing for repeated parts.

## Hard rejects
Grey default material, a single primitive with one color, muddy or low-contrast palette, z-fighting, visible gaps or inside-out faces, noisy random detail with no structure, smooth-shaded blobs, text or logos, anything that resembles a real brand, team crest, character, or vehicle.

## Motion feel
Eased, slightly bouncy, never linear. Small constant motion (bob, spin, pulse) on anything interactive. Respect reduced motion.

## Brand and IP
Original, generic art only. See `VISION.md`.

## Model workflow (for `(model)` tickets)
1. Write a short generator script in `tools/blender/` (Blender Python) or `tools/models/` (Node) that builds the model from named parts, using only palette colors.
2. Run it to produce a GLB in `public/models/`. Compress with Draco. Check size and triangle count.
3. Render a preview from 4 angles using the `/dev/model-preview` route and `tools/shot.mjs`.
4. The artist critic reviews the 4 images. Up to 2 revisions. If it still fails, mark the ticket `[!]` with the critic's notes and move on.
