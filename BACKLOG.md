# Backlog

Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked (reason after it).
Each ticket is ONE small problem (about 30 to 50 changed lines). Take the top unchecked ticket. Reviewers add new tickets at the top.

## Foundation
- [ ] Add a `content/profile.ts` file with name, tagline, and links as placeholders, and use it in the hero text
- [ ] Add `src/lib/palette.ts` exporting the color tokens used in 3D scenes
- [ ] Add a `prefers-reduced-motion` hook and use it to slow the hero crystal rotation
- [ ] Add a basic loading fallback shown while the 3D canvas loads
- [ ] Add Open Graph metadata and a favicon (generated SVG)
- [ ] Add a `useWindowSize` hook for responsive camera distance
- [ ] Make the canvas pause rendering when the tab is hidden
- [ ] Add a skip-to-content link and landmark roles
- [ ] Set `dpr` and antialias based on device pixel ratio and a simple performance check
- [ ] Add smooth scrolling with Lenis in a small `SmoothScroll` component

## Hero scene
- [ ] Add a ring of 12 small octahedrons orbiting the hero crystal (instanced mesh)
- [ ] Give the hero crystal a slow breathing scale animation
- [ ] Add mouse parallax: camera drifts slightly toward the pointer
- [ ] Add a low-poly ground plane with a faceted grid look under the crystal
- [ ] Add a second smaller crystal with a different rotation speed
- [ ] Add fog to fade distant objects into the background color
- [ ] Add a point light that follows the pointer with a soft accent color
- [ ] Add a particle field of 300 tiny tetrahedrons drifting upward
- [ ] Add subtle bloom with `@react-three/postprocessing` (low intensity)
- [ ] Add a vignette effect to focus attention on the center
- [ ] Add a slow camera dolly-in on first load
- [ ] Color the hero crystal faces with a vertex-color gradient
- [ ] Add a thin wireframe shell around the hero crystal
- [ ] Add floating low-poly mountains in the background (procedural, 3 peaks)
- [ ] Add a slow day-to-night color shift on the background based on time

## Scroll experience
- [ ] Split the page into sections: hero, about, projects, contact (empty sections with ids)
- [ ] Add GSAP ScrollTrigger and link scroll progress to camera Y position
- [ ] Rotate the hero crystal based on scroll progress
- [ ] Fade the hero text out as the user scrolls down
- [ ] Add a scroll progress bar at the top edge
- [ ] Add section titles that slide in on scroll
- [ ] Move the camera along a curved path between sections
- [ ] Change the background color slightly per section
- [ ] Add a "scroll" hint with a small animated arrow
- [ ] Add section snap points for keyboard navigation

## About section
- [ ] Add the about text block with placeholder copy from `content/profile.ts`
- [ ] Add a low-poly floating shape next to the about text that reacts to hover
- [ ] Add a skills list (React, Three.js, TypeScript, AI agents) as floating tags
- [ ] Animate skill tags with a gentle bob using CSS only
- [ ] Add a small timeline component for education and work
- [ ] Add an "Adept Systems" highlight card in the about section
- [ ] Add a UMD mention with a low-poly turtle-style icon (procedural shapes)

## Projects section
- [ ] Add a `content/projects.ts` file with 3 placeholder projects
- [ ] Add a `ProjectCard` component with title, description, and links
- [ ] Render project cards in a responsive grid
- [ ] Make each card tilt in 3D on hover using CSS transforms
- [ ] Add a small 3D preview shape per project inside each card
- [ ] Add a filter bar for project tags
- [ ] Add a project detail route at `/projects/[slug]`
- [ ] Add a back link and keyboard focus styles on project pages
- [ ] Add project images as procedurally generated low-poly covers
- [ ] Add a "featured" badge style and sort featured projects first

## Contact and footer
- [ ] Add a contact section with email and social links from `content/profile.ts`
- [ ] Add a footer with the build date injected at build time
- [ ] Add a "Built by Claude, one commit at a time" credit with a link to the repo
- [ ] Add a live commit count from the GitHub public API (client side, cached)
- [ ] Add a copy-email button with a small confirmation animation
- [ ] Add a simple `404` page with a broken low-poly crystal

## Timeline and snapshots
- [ ] Add a `/timeline` route with a placeholder list
- [ ] Add `public/snapshots/index.json` with an empty array and a type for entries
- [ ] Render snapshot entries as cards on `/timeline`
- [ ] Add a 3D gallery layout for snapshot cards (flat planes in a row)
- [ ] Add camera movement between snapshot planes on scroll
- [ ] Show commits, lines added, and lines removed per week on each snapshot
- [ ] Link each snapshot to its frozen Vercel deployment URL
- [ ] Add an empty state for weeks with no snapshot yet
- [ ] Add a nav link to `/timeline` in the header

## Navigation and layout
- [ ] Add a minimal sticky header with anchor links
- [ ] Highlight the current section in the header based on scroll position
- [ ] Add a mobile menu with a simple open/close animation
- [ ] Add a cursor follower dot on desktop only
- [ ] Add a custom focus ring style that matches the palette
- [ ] Add responsive font sizes with `clamp()`
- [ ] Add a dark/light accent toggle that changes the 3D accent color

## 3D assets (procedural first, Blender script when needed)
- [ ] Add a procedural low-poly tree component (cone and cylinder stack)
- [ ] Add a procedural low-poly cloud component and drift a few across the sky
- [ ] Add a procedural low-poly planet with a faceted ring
- [ ] Add a procedural low-poly spaceship and fly it across the scene occasionally
- [ ] Try installing `bpy` in the sandbox and log whether headless Blender works in `.autopilot/log.md`
- [ ] If Blender works, add `tools/blender/crystal_cluster.py` and export `public/models/crystal-cluster.glb`
- [ ] Load a GLB with `useGLTF` and show it in the hero scene
- [ ] Add a gltf-transform script to compress GLBs (dev script only)
- [ ] Add a low-poly laptop model generated by a Blender or Three.js script
- [ ] Add a low-poly desk scene with the laptop for the about section

## Animation polish
- [ ] Add easing to the hero crystal float using a custom curve
- [ ] Add a one-time intro animation where the crystal assembles from shards
- [ ] Add hover glow on interactive 3D objects
- [ ] Add click ripples that push nearby particles away
- [ ] Add idle camera sway that stops when the user scrolls
- [ ] Add a subtle chromatic aberration pass at the screen edges
- [ ] Add a text scramble effect on the hero title (CSS and small JS)
- [ ] Add staggered fade-in for the hero text lines

## Performance and quality
- [ ] Add `next/dynamic` with a lightweight placeholder for below-the-fold 3D scenes
- [ ] Add an FPS monitor in dev mode only and lower quality if FPS drops
- [ ] Dispose of geometries and materials on unmount in scene components
- [ ] Add a Lighthouse CI config with performance budgets
- [ ] Add alt text and aria labels to all non-decorative elements
- [ ] Add a `noscript` fallback with a static message and links
- [ ] Memoize shared geometries and materials across scene components
- [ ] Add a unit test setup (Vitest) with one test for the content files
- [ ] Add a simple error boundary around the canvas

## Housekeeping
- [ ] Add a `.nvmrc` and `engines` field in `package.json`
- [ ] Add a `CONTRIBUTING.md` that explains the autopilot loop in 10 lines
- [ ] Add a README section with a project structure overview
- [ ] Add a README badge for the CI status
- [ ] Add a `sitemap.ts` and `robots.ts`
