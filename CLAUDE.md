# Portfolio Website V2: project rules

A self-building 3D portfolio for Rahul (GitHub: Eab0u). Claude makes small commits on a schedule. Humans rarely touch the code, so these rules keep it clean.

## Stack
Next.js (App Router) + TypeScript + Tailwind, React Three Fiber, drei, postprocessing, GSAP, Lenis. Deployed on Vercel from `main`.

## Visual style
- Low-poly baseline: flat shading, faceted geometry, limited palette (see `:root` in `src/app/globals.css`).
- Moving, layered, and a bit complex: parallax, floating objects, particles, scroll-driven camera, reactive lighting.
- Performance matters: keep draw calls low, prefer instancing, respect `prefers-reduced-motion`, and never block first paint on heavy assets.
- Reference sites live in `benchmarks/` (if present). Use them for inspiration and scoring only. Never copy their code, layout, or assets.

## Commit rules (hard)
1. One small problem per commit. Target 30 to 50 changed lines. If a diff goes past about 60 lines (excluding lockfiles, generated files, and `.glb` assets), revert it and split the ticket.
2. No new dependencies unless the ticket says so.
3. No file over 200 lines. Split components instead.
4. Never mix refactors and features in one commit.
5. Every commit must pass `npm run check` (typecheck, lint, build) before it is pushed.
6. Every commit must be approved by a separate reviewer agent that sees only the ticket and the diff.
7. Never commit secrets, `.env` files, or personal data beyond what is in `content/`.
8. Commit author is the repo owner, so contributions count for them:
   `git config user.name "Eab0u"` and `git config user.email "75275340+Eab0u@users.noreply.github.com"`.
   End every commit message with `Co-Authored-By: Claude <noreply@anthropic.com>`.
9. Commit message format: `type: short description` (feat, fix, style, perf, docs, chore).

## 3D assets
- Prefer procedural geometry in code.
- For hand-built models, write a deterministic Blender Python script in `tools/blender/`, run it headless, and export a Draco-compressed GLB to `public/models/`. Keep each GLB under 500 KB and under 20k triangles.
- Assets and generator scripts are exempt from the line budget, but the script should stay short and readable.
- If headless Blender is unavailable in the sandbox, fall back to Three.js procedural geometry. Do not block on it.

## Autopilot
The daily and weekly procedures are in `AUTOPILOT.md`. State is in `.autopilot/state.json`. Work comes from `BACKLOG.md`. If a file named `PAUSE` exists in the repo root, do nothing and exit.
