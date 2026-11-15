# Portfolio Website V2

[![CI](https://github.com/Eab0u/Portfolio-Website-V2/actions/workflows/ci.yml/badge.svg)](https://github.com/Eab0u/Portfolio-Website-V2/actions/workflows/ci.yml)

A 3D portfolio that builds itself. A scheduled Claude agent makes a few small commits each day, a second agent reviews every one, and two reviewers audit the code and visuals each week.

**Live site:** https://rahulmi.org

## Stack
Next.js, TypeScript, Tailwind, React Three Fiber, drei, postprocessing, GSAP, Lenis. Hosted on Vercel.

## Structure
- `src/app`: routes and layout
- `src/components`: 3D scenes and UI
- `src/hooks`, `src/context`, `src/lib`: shared hooks, React context, palette and helpers
- `content/`: the only source of personal facts (profile, experience, projects)
- `public/models`: generated low-poly GLB models
- `tools/`: model generators, screenshot and snapshot scripts
- `BACKLOG.md`: the queue of small tickets
- `CLAUDE.md`: rules every commit must follow
- `AUTOPILOT.md`: the daily and weekly procedures
- `.autopilot/`: run state and log
- `.github/workflows`: CI and the weekly snapshot job
- `reviews/`: weekly code and visual reviews

## Develop
```bash
npm install
npm run dev
npm run check   # typecheck, lint, build
```

To pause the automation, add a file named `PAUSE` to the repo root.
