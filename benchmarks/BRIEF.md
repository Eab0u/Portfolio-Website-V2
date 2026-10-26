# Style brief: reference sites

Rahul likes these four sites and wants to match them stylistically. Use them for inspiration and scoring only. Never copy their code, layout, copy, models, textures, sounds, or fonts. Borrow the feel and build original work.

Evidence note: this brief was written from page text and metadata only. Colors, lighting, and camera behavior are NOT verified, so do not treat them as facts. Where a note is inferred, it says so.

## 1. bruno-simon.com (explore a 3D world by driving)
- The site IS a 3D world. You drive a small vehicle around to discover content instead of scrolling pages.
- Playful and full of secrets. Rewards curiosity: achievements, a timed circuit with a leaderboard, a community message board ("whispers").
- Small icon-driven overlay panels (map, controls, settings, achievements, help) sit on top of the world, each with a close button.
- Quality and renderer settings, sound toggle, a "stuck? respawn" button, controls for mouse, touch, and gamepad.
- Takeaways: exploration over scrolling, tiny delights, accessible controls on every device, a way to recover when lost, and an honest settings panel.

## 2. jordan-breton.com (polished immersive world)
- Starts with a preloader: "Initializing" with a percent counter that ends in "Start".
- First prompts: "Touch and move to look around" and "Tap here to explore". The camera responds to pointer or touch.
- Very small nav (Explore, About, Contact). Clean text sections for bio and contact over an immersive scene (inferred).
- Takeaways: a loading ritual that builds anticipation, minimal UI, pointer-driven camera, award-site level polish, and a clear call to action at the end.

## 3. susurrus.vercel.app (experimental, soft)
- Self-described experimental, non-commercial project for learning and creative expression.
- Theme color is a very light cream (#FFFDF0), which hints at a soft, warm palette (inferred, not confirmed).
- Takeaways: a quiet, curious tone; creative coding for its own sake; room for odd little experiments.

## 4. weisdevice.xyz (retro computer metaphor)
- Opens with a fake boot screen (path-style text, "Initializing OK"), then an enter gate where music is opt-in ("Enter (No Music)" or "Enter").
- The whole site is a desktop: folder icons, windows titled with file paths, "Read-only" labels, thumbnail views, light and dark toggle.
- Project pages open as windows. Includes an About with portrait, a Tools list, Contact icons, and a Legal and credits window with asset attributions.
- Takeaways: a strong metaphor carried through every detail, opt-in sound, a credits page that respects asset licenses, and personality in the small copy.

## What these four share (the target feel)
1. A ritual at the start (loader, boot screen, or intro prompt).
2. Explore by doing, not by reading a long page.
3. One strong metaphor or world, carried through every detail.
4. Small playful rewards and secrets.
5. Minimal, tasteful UI that never fights the 3D.
6. Sound is opt-in and easy to mute.
7. Works on touch, has clear controls, and recovers gracefully.
8. A credits and attributions page.

## Stack and technique notes (from folio-2025, a public MIT repo, studied for ideas only)
We borrow ideas, never code, models, textures, sounds, or fonts. Everything here is rebuilt in our own way for our own stack (Next.js, React Three Fiber, WebGL).
- **Tools worth adopting by ticket:** a rigid-body physics library (Rapier) for drivable and kickable things; glTF-Transform as a separate compression step after export; GSAP for camera moves; instancing for anything repeated.
- **Look:** one shared material for the whole world, with a soft shade ramp so faces turned from the sun go darker, a gentle fog tint, and one sun with soft shadows that moves slowly through a day cycle.
- **Post effects stay quiet:** bloom with a high threshold and low strength, and a cheap blur for depth. Never heavy.
- **Richness comes from stacking small systems** (wind sway, drifting clouds, trails, day and night, weather), each in its own small file.
- **Skipped on purpose:** WebGPU and node-based shaders. Our screenshot checks run on software WebGL, and our stack is React Three Fiber.

## How reviewers should score
Score the site 1 to 10 on: intro ritual, sense of a world, interaction delight, UI restraint, polish and performance, and consistency of the metaphor. Compare against the shared target feel above, not against any one site.
