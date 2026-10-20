# Backlog

Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked (reason after it).
Each ticket is ONE small problem (about 30 to 50 changed lines). Take the top unchecked ticket that fits the current theme. If none fit, take the top unchecked ticket. Reviewers add new tickets at the top.
Direction comes from `VISION.md` and `benchmarks/BRIEF.md`. Read both before planning new tickets.

**Current theme: Foundation and intro ritual**

## Foundation (loader, settings, shared pieces)
- [ ] Add `content/profile.ts` with name, tagline, and link placeholders, and use it in the hero text
- [ ] Add `src/lib/palette.ts` with color tokens: dark navy base, one mint accent, and per-theme accents (blue and garnet, racing red, sand, ice, grass)
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
- [ ] Add `content/projects.ts` with 3 placeholder projects
- [ ] Add an About `WindowPanel` with placeholder copy from `content/profile.ts`
- [ ] Add a Projects `WindowPanel` listing project cards
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

## 3D assets (procedural first, Blender script when needed)
- [ ] Try installing `bpy` in the sandbox and log whether headless Blender works in `.autopilot/log.md`
- [ ] If Blender works, add `tools/blender/crystal_cluster.py` and export `public/models/crystal-cluster.glb`
- [ ] Load a GLB with `useGLTF` and show it on the hub island
- [ ] Add a gltf-transform script to compress GLBs (dev script only)

## Housekeeping
- [ ] Add `.nvmrc` and an `engines` field in `package.json`
- [ ] Add a README structure overview
- [ ] Add a CI status badge to the README
- [ ] Add `sitemap.ts` and `robots.ts`
