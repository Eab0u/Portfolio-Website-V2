# Backlog

Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked (reason after it).
Each ticket is ONE small problem (about 30 to 50 changed lines). Take the top unchecked ticket that fits the current theme. If none fit, take the top unchecked ticket. Reviewers add new tickets at the top.
Direction comes from `VISION.md` and `benchmarks/BRIEF.md`. Read both before planning new tickets.

**Current theme: World base, the floating archipelago**

## Review 2026-10-26 (visual review, do after Priority)
- [x] Camera parallax: ease the camera toward the pointer (max about 0.6 units, skip when reduced motion), in `Scene`
- [x] Hero crystal: set `metalness` to 0 and `roughness` to 0.6 so the mint matches the palette instead of going muddy
- [x] Mobile framing: scale the hero crystal and camera distance by viewport aspect so it is not cropped at 390 px wide
- [x] Replace the flat `#0a0b10` background with a two-stop vertical sky gradient (palette colors) behind the scene
- [x] Add a low cool rim light so the dark crystal faces read as color, not black
- [x] Add a minimal `src/app/icon.svg` favicon (original faceted gem) to remove the console 404
- [x] Add a stub `/timeline` page (title, one line, back link) so the route stops 404ing
- [x] Add a stub `/credits` page listing the stack and stating that all art is original

## Review 2026-10-27 (from code critic)
- [x] Weekly snapshot workflow: guard `git tag week-NN` so a re-run with no changes does not fail on an existing tag

## Review 2026-10-25 (code review fixes, small, do after Priority)
- [x] Preloader: finish on Canvas `onCreated` instead of the 4 s timeout when no assets load (drop the fake wait)
- [x] Hero crystal: stop `Float` bobbing when `useReducedMotion` is true
- [x] Add `role="img"` and an `aria-label` describing the 3D scene on the canvas wrapper in `SceneClient`
- [x] Add the footer credit "Built by Claude, one commit at a time." to `src/app/page.tsx`
- [ ] Update `VISION.md` intro ritual line: loader fades out by itself, no Start, no sound prompt
- [x] Guard the weekly snapshot commit in `.github/workflows/weekly-snapshot.yml` with `git diff --cached --quiet ||`

## Next week theme tickets: World base, the floating archipelago
- [x] Add a sky gradient background and distance fog to `Scene`
- [ ] Place 4 smaller islands in a loose ring around the hub, each with a different palette top color (Needs: Island model)
- [ ] Add gentle bobbing to each island with different phases (skip when reduced motion) (Needs: Island model)
- [x] Add 300 drifting low-poly particles as one instanced tetrahedron mesh

## Priority (do these first, in order)
- [x] Preloader timing: keep the overlay up for at least 2.4 s so the gem is actually seen (it now flashes for about half a second once the canvas is ready). Draw the gem in facet by facet over the first 1.2 s, then breathe. Reduced motion: show it static for 0.8 s.
- [x] Preloader exit: right now the gem fades over the finished scene and looks like a small gem floating inside the big crystal. Fade the gem out first (0.35 s), then fade the dark overlay away (0.9 s), and ease the camera in slightly during the fade.
- [!] (model) Add a procedural `Island` component (faceted top, tapered underside, flat shading, palette colors) and render one under the hero crystal (2026-10-26: artist critic rejected twice, scores about 6/5/3/6/4/4. Notes: island tip collides with the title text so reframe camera and group; top reads pale mint, use grass with 3 value steps and close the rim; underside near-black violet, lift to lit violet with a blue-dark shadow side; coral tip detached, make it a continuous inverted pyramid; add secondary props like sand rocks and small crystals. Retry with all of that in one pass; trees come from the tree set ticket, leave a clear spot for them; use Node procedural geometry; if rejected after 5 revisions, split into rock and top tickets; 2026-10-28 retry, 6 critic rounds, still rejected, last scores 7/7/7/6/7/6: Node generator with vertex-color GLB (about 1300 tris) was close; remaining notes: grass outer band muddy teal (want true #3ddc84 as the large ring and a clear 3-ring value step), sand rim reads beige or salmon not three clean #f2c98a steps, underside slabs still flat and dim, stalactites same value as body (make ice or light violet), props and crystals too small and desaturated at preview scale. Rejected in two runs now, stays [!] until the weekly review resets it)
- [!] (model) Crystal cluster (2026-10-23 retry rejected twice more: core read as flat off-white, base a single flat blue slab with no tiers or veins, mint drifted teal and mauve tint on some angles, detail only primary scale. Needs a bright mint-to-ice gradient core with an inner shell, 2 to 3 chamfered rock tiers with a glowing vein, satellite shards fused to big crystals, and a bloom pass in the preview): 5 to 7 faceted crystals of different heights, mint and violet, one glowing core (retry: artist critic rejected 3 times 2026-10-22: colors read as teal and navy under the preview fill light, core hidden from some angles, base clashed. Retry with strict mint and violet ramps, core raised above a ring of crystals, dark night-rock base, no pebbles; 2026-10-28 retry, 6 critic rounds, still rejected, last scores 8/7/6/7/7/7 (avg 7.0): Node generator with a second emissive material for the core, fins and vein was close. Remaining notes: tertiary detail thin (add thin band rings on more crystals, chipped notches on tiers, a fat flat-cut violet crystal, one very thin tall mint satellite), core should separate more from the ring (darken non-glow mint a step), shadow-side mint and violet steps still too dark in the neutral preview, vein should be wider and climb the chamfer. Rejected in several runs now, stays [!] until the weekly review resets it)
- [!] (model) Pine and palm tree set in 3 sizes (2026-10-28: rejected after 5 revisions, final artist scores avg 6.7, color=6 fit=6: wanted one grass hue in 3 value steps for pines, mint/grass fronds, richer trunks, fewer coconuts, frond thickness)
- [x] Redesign the preloader mark in `src/components/Preloader.tsx` (the current three CSS slivers look unfinished). Use one faceted gem drawn as inline SVG: an octahedron-style shape with 6 to 8 triangle facets in mint, violet, and ice from `src/lib/palette.ts`, a soft glow beneath, a slow breathing scale, and a facet-by-facet shimmer that runs around the gem. No text, no counter. On finish, the gem scales up slightly while the overlay fades. Respect `prefers-reduced-motion` (static gem). Keep it centered and sharp on mobile.
- [x] Fix `tools/snapshot.mjs` so the weekly snapshot shows the real site, not the loader: after load, wait until the preloader overlay (`[role="status"]`) is detached (up to 20 s), then wait 2.5 s more, then take the screenshot. If the overlay is still there after 20 s, exit with an error so the Action fails instead of committing a bad image.
- [x] Remove the Start button and the "Enter" / "Enter (no music)" step from `src/components/Preloader.tsx`. The overlay should fade out by itself when loading reaches 100%. No buttons, no sound prompt, sound stays off. Keep the percent counter for now. (The visitor should land straight in the world.)
- [x] Make the `/dev/model-preview` lights neutral so palette colors show true: warm white sun (`#fff4e0`), neutral fill (`#e8ecff`) at lower intensity, ambient up a little. The old orange sun and blue fill shifted mint toward teal and caused model rejections.
- [x] Replace the percent counter in the preloader with a small looping loading animation (a spinning faceted crystal made of CSS or a tiny R3F mesh, palette colors only). Keep the auto fade out.

## Model tooling (do these before any `(model)` ticket)
- [x] Add a `/dev/model-preview` route that loads a GLB from `?src=` on a plain night background with a warm sun light and a fill light
- [x] Add an `?angle=0..3` query param to `/dev/model-preview` for 4 preset camera angles
- [x] Add `tools/models/README.md` explaining the model workflow and how to run a generator script
- [x] Try installing `bpy` in the sandbox and log in `.autopilot/log.md` whether headless Blender works; if not, note the Node fallback

## First models (art must exist before small visual tickets can pass)

## Foundation (loader, settings, shared pieces)
- [x] Use `content/profile.ts` (name and tagline) in the hero text instead of the hardcoded strings
- [x] Add `src/lib/palette.ts` with color tokens: dark navy base, one mint accent, and per-theme accents (blue and garnet, racing red, sand, ice, grass)
- [x] Add a `useReducedMotion` hook and use it to slow the hero crystal rotation
- [x] Pause canvas rendering when the tab is hidden
- [x] Add a preloader overlay that shows a percent counter using drei `useProgress`
- [x] Make the preloader end on a "Start" button that fades the overlay out
- [x] Add a sound opt-in step after Start: "Enter" or "Enter (no music)", saved in state only
- [x] Add a `SettingsContext` (quality, sound, reduced motion) with safe localStorage persistence (try/catch)
- [ ] Add a user override for reduced motion in `SettingsContext` (null means follow OS; persist only when the visitor changes it) and start `reducedMotion` as true until synced
- [x] Add a reusable `WindowPanel` component with a path-style title bar and a close button
- [x] Add a settings button that opens a settings `WindowPanel` (Needs: WindowPanel)
- [x] Add a controls help `WindowPanel` for mouse, touch, and keyboard (Needs: WindowPanel)
- [x] Fix `WindowPanel` focus restore when switching panels (restore to the opener only if focus is still inside the panel or on body)
- [x] Open only one `WindowPanel` at a time: lift the open window id into shared state so opening help closes settings and the reverse
- [x] Add a skip link and landmark roles
- [x] Add Open Graph metadata and a generated SVG favicon
- [ ] Set canvas `dpr` from the quality setting

## 3D models (one per ticket, follow `ART_DIRECTION.md`, original and generic art only)
- [ ] (model) Generic open-wheel race car: bright body, contrasting wing and nose, visible wheels and a small cockpit detail
- [ ] (model) Low-poly tram: 2 coupled cars, rounded roof, window row, coral and ice colors, small pantograph
- [ ] (model) Stadium floodlight tower with a glowing lamp bank
- [ ] (model) Volleyball net with posts, referee stand, and a ball
- [ ] (model) Street-food stall: striped awning, counter, lanterns, steaming pot
- [ ] (model) Tire stack and barrier set (generic, no sponsor marks)
- [ ] (model) Ancient arch ruin with glowing glyph lines (generic sci-fi, no game symbols)

## World base
- [x] Add a sky gradient background and distance fog (done: sky gradient and fog shipped)
- [ ] Add a slow drifting cloud layer below the islands (instanced low-poly clouds)
- [x] Add camera pointer parallax (done: pointer parallax shipped)
- [ ] Add a slow camera dolly-in after the loader fades out
- [x] Add 300 drifting low-poly particles (instanced tetrahedrons)
- [ ] Add subtle bloom with low intensity
- [ ] Add a vignette pass
- [ ] Add a shared `LowPolyMaterial` (flat shaded) with a soft shade ramp so faces turned from the sun get darker, original code, palette colors only
- [ ] Add gentle wind sway to instanced grass tufts using a small vertex shader (original) (Needs: an island with instanced grass tufts)
- [ ] Add a day and night color shift tied to local time

## Navigation between districts
- [ ] Add island name labels using drei `Html` (Needs: island ring)
- [ ] Focus the camera on an island when its label is clicked (GSAP tween) (Needs: island ring)
- [ ] Add keyboard navigation between islands (left and right arrows) (Needs: island ring)
- [ ] Add swipe navigation between islands on touch (Needs: island ring)
- [ ] Add a small map panel listing islands with click-to-fly (Needs: island ring)
- [ ] Add a "back to hub" button
- [ ] Add physics: install `@react-three/rapier` (dependency approved for this ticket) and drop 5 faceted blocks onto the hub ground as a small physics toy
- [ ] Add a low-poly hover vehicle component (procedural)
- [ ] Move the vehicle with WASD and arrow keys on an island (simple kinematic movement)
- [ ] Add boost on Shift with a particle trail
- [ ] Add on-screen touch joystick for the vehicle
- [ ] Add portal rings that fly the vehicle to another island
- [ ] Add a "stuck? respawn" button

## Portfolio content windows
- [ ] Add an About `WindowPanel` showing the bio, skills, and interests from `content/profile.ts` (Needs: WindowPanel)
- [ ] Add an Experience section to the About window from `content/experience.ts`
- [ ] Show experience entries on the `/timeline` route as a career strip above the snapshots
- [ ] Add a Projects `WindowPanel` listing project cards from `content/projects.ts` (hide link buttons when a link is null) (Needs: WindowPanel)
- [ ] Add a project detail view inside the Projects window
- [ ] Add a Contact `WindowPanel` with email and social links (Needs: WindowPanel)
- [ ] Add a Tools list (React, Three.js, TypeScript, AI agents) to About
- [ ] Add an "Adept Systems" highlight card to About
- [ ] Add a Credits `WindowPanel` with an attributions section (Needs: WindowPanel)
- [x] Add a footer line: "Built by Claude, one commit at a time" (done: footer credit shipped)
- [ ] Add a `404` page with a broken low-poly crystal

## Timeline and snapshots
- [x] Add a `/timeline` route with a placeholder list (done: stub shipped)
- [ ] Add a snapshot entry type and a loader for `public/snapshots/index.json`
- [ ] Render snapshot entries as cards on `/timeline`
- [ ] Add an empty state for weeks with no snapshot yet
- [ ] Show commits, lines added, and lines removed on each card
- [ ] Add a 3D gallery layout for snapshot cards (flat planes in a row)
- [ ] Move the camera between snapshot planes on scroll
- [ ] Add a nav link to `/timeline` in the world UI

## Football district (blue and garnet mood, original art only)
- [ ] Add a procedural pitch island with stripe pattern and goals
- [ ] Add a low-poly ball that can be clicked to kick (simple arc animation)
- [ ] Add a goal detector and a score counter
- [ ] Add instanced stadium stands around the pitch
- [ ] Add glowing floodlights with soft bloom
- [ ] Add confetti burst on goal
- [ ] Add a penalty shootout toy (aim and shoot with the pointer)
- [ ] Add a generic faceless low-poly player figure that idles near the ball

## Racing district (generic circuit)
- [ ] Add a spline-based low-poly race circuit
- [ ] Add a generic open-wheel car that drives the circuit on a loop
- [ ] Add tire stacks and barriers as instanced meshes
- [ ] Add a lap timer and best lap saved in state
- [ ] Add speed lines when the car passes the camera
- [ ] Add a pit building with a small light gantry
- [ ] Let the player drive the car with WASD

## Volleyball district
- [ ] Add a sand court island with a net
- [ ] Add a ball serve animation on click
- [ ] Add a spike toy: timed click for a power meter
- [ ] Add a gentle sand ripple shader under the ball landing spot
- [ ] Add a rally counter

## Sci-fi ruins district (mood only)
- [ ] Add floating faceted ruins with arches
- [ ] Add a glowing artifact with bloom and slow rotation
- [ ] Add a vertical light beam and drifting shards
- [ ] Add a quiet sky change when the camera is near this island

## Voxel quarry district
- [ ] Add a voxel terrain using instanced cubes
- [ ] Add a block placement toy (click to add, shift click to remove)
- [ ] Add a simple day and night cycle for the quarry sun
- [ ] Add a tool belt of 4 plain colored block types

## Arena district (car and ball mood only)
- [ ] Add a walled arena with a generic boxy car
- [ ] Add a large ball with simple bounce physics (no new dependency)
- [ ] Add boost pads and a boost trail
- [ ] Add a goal counter

## Secrets and polish
- [ ] Add 7 hidden easter eggs, one per district, and a "secrets found" counter in settings
- [ ] Add a cursor follower dot on desktop only
- [ ] Add hover glow on interactive 3D objects
- [ ] Add a one-time intro animation where the hub island assembles from shards (Needs: Island model; replaces the preloader gem handoff)
- [ ] Add a text scramble effect on the hero title
- [ ] Add a subtle chromatic aberration pass
- [ ] Add idle camera sway that stops on interaction
- [ ] Add a light and dark accent toggle

## Performance and quality
- [ ] Add adaptive quality: lower `dpr` when FPS drops
- [ ] Dispose of geometries and materials on unmount in scene components
- [ ] Memoize shared geometries and materials
- [ ] Add a simple error boundary around the canvas with a text fallback
- [ ] Add a `noscript` fallback with links
- [ ] Add a Lighthouse CI config with performance budgets
- [ ] Add alt text and aria labels to all non-decorative elements
- [ ] Add a Vitest setup with one test for the content files

## Using models in the scene
- [ ] Load a finished GLB with `useGLTF` and place it on the hub island (Needs: a passed model and the Island)
- [ ] Add a `compress:models` npm script that runs glTF-Transform over `public/models/*.glb` (dev script only). Approved new devDependency for this ticket: `@gltf-transform/cli`

## Housekeeping
- [ ] Add `.nvmrc` and an `engines` field in `package.json`
- [ ] Add a README structure overview
- [ ] Add a CI status badge to the README
- [ ] Add `sitemap.ts` and `robots.ts`
