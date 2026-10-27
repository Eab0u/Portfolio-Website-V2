# Portfolio Website V2: project rules

A self-building 3D portfolio for Rahul (GitHub: Eab0u). Claude makes small commits on a schedule. Humans rarely touch the code, so these rules keep it clean.

## Stack
Next.js (App Router) + TypeScript + Tailwind, React Three Fiber, drei, postprocessing, GSAP, Lenis. Deployed on Vercel from `main`.

## Direction
Read `VISION.md` (the creative brief and themes) and `benchmarks/BRIEF.md` (style targets from reference sites) before planning or reviewing. The site is an explorable low-poly world, not a long page.

## Visual style
- Low-poly baseline: flat shading, faceted geometry, limited palette (see `src/lib/palette.ts` once it exists, otherwise `:root` in `src/app/globals.css`).
- Moving, layered, and a bit complex: parallax, floating objects, particles, interactive toys, reactive lighting.
- Performance matters: keep draw calls low, prefer instancing, respect `prefers-reduced-motion`, never autoplay sound, and never block first paint on heavy assets.
- Reference sites are for inspiration and scoring only. Never copy their code, layout, copy, models, textures, sounds, or fonts.

## Brands and IP (hard rule)
Rahul's interests include real brands, teams, and games. Use their mood and colors only. Never use logos, crests, wordmarks, kit designs, official fonts, copyrighted characters, vehicles, maps, textures, models, or music. All 3D art is original and generic. Details are in `VISION.md`.

## Commit rules (hard)
1. One small problem per commit. Target 30 to 50 changed lines. If a diff goes past about 60 lines (excluding lockfiles, generated files, and `.glb` assets), revert it and split the ticket.
2. No new dependencies unless the ticket says so.
3. No file over 200 lines. Split components instead.
4. Never mix refactors and features in one commit.
5. Every commit must pass `npm run check` (typecheck, lint, build) before it is pushed.
6. Every commit must be approved by separate reviewer agents with fresh context: the code critic always, and the artist critic for anything rendered or any model. Rubrics are in `.autopilot/reviewers/`. Full procedure is in `AUTOPILOT.md`.
7. Never commit secrets, `.env` files, or personal data beyond what is in `content/`.
8. Commit author is the repo owner, so contributions count for them:
   `git config user.name "Eab0u"` and `git config user.email "75275340+Eab0u@users.noreply.github.com"`.
   End every commit message with `Co-Authored-By: Claude <noreply@anthropic.com>`.
9. Commit message format: `type: short description` (feat, fix, style, perf, docs, chore).

## Ticket types
- `(code)`: a small change, 30 to 50 lines. The default.
- `(model)`: build one 3D model the vision needs. At most three per daily run (a failed attempt counts). The generator script and GLB are exempt from the line limit but must pass the artist critic against `ART_DIRECTION.md` (colorful, detailed, faceted, never grey or ugly).

## 3D assets
- Prefer procedural geometry in code for simple pieces.
- For models, write a deterministic generator script (Blender Python in `tools/blender/`, or Node in `tools/models/`), run it headless, and export a Draco-compressed GLB to `public/models/`. Keep each GLB under 500 KB and under 20k triangles.
- If headless Blender is unavailable in the sandbox, fall back to Node or procedural Three.js geometry. Do not block on it.
- Never use real-brand shapes or logos (see Brands and IP).

## Personal info
All personal facts live in `content/` (`profile.ts`, `experience.ts`, `projects.ts`). Use only what is there. Never invent personal facts. Phone and email are intentionally not published.

## Autopilot
The daily and weekly procedures are in `AUTOPILOT.md`. State is in `.autopilot/state.json`. Work comes from `BACKLOG.md`. If a file named `PAUSE` exists in the repo root, do nothing and exit.
