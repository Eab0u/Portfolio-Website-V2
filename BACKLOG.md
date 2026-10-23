# Backlog

Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked (reason after it).
Each ticket is ONE small problem (about 30 to 50 changed lines). Take the top unchecked ticket that fits the current theme. If none fit, take the top unchecked ticket. Reviewers add new tickets at the top.
Direction comes from `VISION.md` and `benchmarks/BRIEF.md`. Read both before planning new tickets.

**Current theme: Model tooling and first models**

## Model tooling (do these before any `(model)` ticket)
- [x] Add a `/dev/model-preview` route that loads a GLB from `?src=` on a plain night background with a warm sun light and a fill light
- [x] Add an `?angle=0..3` query param to `/dev/model-preview` for 4 preset camera angles
- [x] Add `tools/models/README.md` explaining the model workflow and how to run a generator script
- [x] Try installing `bpy` in the sandbox and log in `.autopilot/log.md` whether headless Blender works; if not, note the Node fallback

## First models (art must exist before small visual tickets can pass)
- [!] (model) Crystal cluster: 5 to 7 faceted crystals of different heights, mint and violet, one glowing core (artist critic rejected 3 times 2026-10-22: colors read as teal and navy under the preview fill light, core hidden from some angles, base clashed. Retry with strict mint and violet ramps, core raised above a ring of crystals, dark night-rock base, no pebbles)
- [ ] (model) Floating rock island: faceted rock underside, grass top in 3 greens, a few small trees

## Foundation (loader, settings, shared pieces)
- [ ] Use `content/profile.ts` (name and tagline) in the hero text instead of the hardcoded strings
- [x] Add `src/lib/palette.ts` with color tokens: dark navy base, one mint accent, and per-theme accents (blue and garnet, racing red, sand, ice, grass)
- [ ] Add a `useReducedMotion` hook and use it to slow the hero crystal rotation
- [ ] Pause canvas rendering when the tab is hidden
- [ ] Add a preloader overlay that shows a percent counter using drei `useProgress`
- [ ] Make the preloader end on a "Start" button that fades the overlay out
- [ ] Add a sound opt-in step after Start: "Enter" or "Enter (no music)", saved in state only
- [ ] Add a `SettingsContext` (quality, sound, reduced motion) with safe localStorage persistence (try/catch)
- [ ] Add a reusable `WindowPanel` component with a path-style title bar and a close button
- [ ] Add a settings button that opens a settings `WindowPanel`
- [ ] Add a controls help `WindowPanel` for mouse, touch, and keyboard
- [ ] Add a skip link and landmark roles
- [ ] Add Open Graph metadata and a generated SVG favicon
- [ ] Set canvas `dpr` from the quality setting

## 3D models (one per ticket, follow `ART_DIRECTION.md`, original and generic art only)
- [ ] (model) Generic open-wheel race car: bright body, contrasting wing and nose, visible wheels and a small cockpit detail
- [ ] (model) Low-poly tram: 2 coupled cars, rounded roof, window row, coral and ice colors, small pantograph
- [ ] (model) Stadium floodlight tower with a glowing lamp bank
- [ ] (model) Volleyball net with posts, referee stand, and a ball
- [ ] (model) Street-food stall: striped awning, counter, lanterns, steaming pot
- [ ] (model) Tire stack and barrier set (generic, no sponsor marks)
- [ ] (model) Ancient arch ruin with glowing glyph lines (generic sci-fi, no game symbols)
- [ ] (model) Pine and palm tree set in 3 sizes

## World base
- [ ] Add a procedural `Island` component: faceted top, tapered underside, flat shading
- [ ] Place a central hub island and 4 smaller islands in a loose ring
- [ ] Add a sky gradient background and distance fog
- [ ] Add a slow drifting cloud layer below the islands (instanced low-poly clouds)
- [ ] Add camera pointer parallax
- [ ] Add a slow camera dolly-in after Start
- [ ] Add 300 drifting low-poly particles (instanced tetrahedrons)
- [ ] Add subtle bloom with low intensity
- [ ] Add a vignette pass
- [ ] Add gentle bobbing to every island with different phases
- [ ] Add a day and night color shift tied to local time

## Navigation between districts
- [ ] Add island name labels using drei `Html`
- [ ] Focus the camera on an island when its label is clicked (GSAP tween)
- [ ] Add keyboard navigation between islands (left and right arrows)
- [ ] Add swipe navigation between islands on touch
- [ ] Add a small map panel listing islands with click-to-fly
- [ ] Add a "back to hub" button
- [ ] Add a low-poly hover vehicle component (procedural)
- [ ] Move the vehicle with WASD and arrow keys on an island (simple kinematic movement)
- [ ] Add boost on Shift with a particle trail
- [ ] Add on-screen touch joystick for the vehicle
- [ ] Add portal rings that fly the vehicle to another island
- [ ] Add a "stuck? respawn" button

## Portfolio content windows
- [ ] Add an About `WindowPanel` showing the bio, skills, and interests from `content/profile.ts`
- [ ] Add an Experience section to the About window from `content/experience.ts`
- [ ] Show experience entries on the `/timeline` route as a career strip above the snapshots
- [ ] Add a Projects `WindowPanel` listing project cards from `content/projects.ts` (hide link buttons when a link is null)
- [ ] Add a project detail view inside the Projects window
- [ ] Add a Contact `WindowPanel` with email and social links
- [ ] Add a Tools list (React, Three.js, TypeScript, AI agents) to About
- [ ] Add an "Adept Systems" highlight card to About
- [ ] Add a Credits `WindowPanel` with an attributions section
- [ ] Add a footer line: "Built by Claude, one commit at a time"
- [ ] Add a `404` page with a broken low-poly crystal

## Timeline and snapshots
- [ ] Add a `/timeline` route with a placeholder list
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
- [ ] Add a one-time intro animation where the hub island assembles from shards
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
- [ ] Load a finished GLB with `useGLTF` and place it on the hub island
- [ ] Add a gltf-transform script to Draco-compress GLBs (dev script only, may need a ticket-approved dev dependency)

## Housekeeping
- [ ] Add `.nvmrc` and an `engines` field in `package.json`
- [ ] Add a README structure overview
- [ ] Add a CI status badge to the README
- [ ] Add `sitemap.ts` and `robots.ts`
