# Vision

Rahul wants a portfolio that feels like a place, not a page. Visitors explore a living low-poly world and discover his work inside it. The site should look complex and full of moving parts, and it should keep getting better week after week. The agents decide what to build, using this file as the creative brief.

## Style targets
See `benchmarks/BRIEF.md`. In short: an intro ritual, a world you explore, playful secrets, minimal UI, opt-in sound, a credits page. Low-poly, flat-shaded, faceted look as the baseline.

## Interests (the themes)
Rahul's interests are the raw material for the world. Each one can become a district, a mini-game, an object, or an easter egg.
- **Football and FC Barcelona:** pitch, stadium, ball physics, passing and shooting mini-games, club-inspired colors (deep blue and garnet red).
- **Formula 1:** low-poly race circuit, generic open-wheel car, lap timer and leaderboard, pit lane, speed lines.
- **Volleyball:** sand or indoor court, net, ball arcs, serve and spike mini-game.
- **Destiny 2 (sci-fi mood only):** floating islands, glowing artifacts, light-beam skies, ancient ruins, a quiet space-fantasy atmosphere.
- **Minecraft (blocky mood only):** voxel terrain, block-building toy, day and night cycle, a mining quarry district.
- **Rocket League (car-football mood only):** a boosting toy car in a walled arena with a big ball.
- **FIFA (football-game mood only):** a quick match scoreboard, penalty shootout toy.

## Default concept (agents may evolve it, reviewers may change it)
A floating low-poly archipelago. Each island is a district themed on one interest, and each district holds one part of the portfolio (projects, about, timeline, contact). Visitors move a small vehicle or character between islands, or fly the camera on touch devices. Panels open over the world as small windows (a nod to the retro-OS idea in the benchmarks) for project details and settings.

## Portfolio content that must exist
- Hero and intro ritual (loader, then "Start", then sound opt-in).
- About, projects, and contact, driven by files in `content/` (placeholders until Rahul supplies real text).
- A `/timeline` page that shows the weekly snapshots of this site as it grew.
- Settings panel (quality, sound, reduced motion), controls help, and a credits page.
- A footer credit: "Built by Claude, one commit at a time."

## Rules for using the interests (important)
These are real brands and games. Take the mood and the colors, never the property.
- No logos, crests, wordmarks, kit designs, sponsor marks, or official fonts (including FC Barcelona, Formula 1, FIFA, Destiny, Minecraft, Rocket League, and any teams, drivers, players, or characters).
- No copyrighted characters, creatures, weapons, vehicles, maps, textures, models, or music from any game or sport.
- All 3D art is original, generic, and low-poly. A race car is a generic open-wheel car. A footballer is a generic faceless figure. A voxel block is just a colored cube.
- Plain text mentions of an interest in the About section are fine ("I love Formula 1").
- When unsure, make it more generic.

## Weekly themes
Each Sunday, the code reviewer picks one interest or district as next week's theme (rotate, do not repeat back to back unless a district is unfinished) and writes 6 to 8 tickets for it at the top of `BACKLOG.md`. The daily builder prefers tickets that match the current theme.

## Anti-goals
- No giant rewrites or one-commit mega features.
- No filler commits (renames, tiny color nudges) that change nothing visible or functional.
- No autoplaying sound.
- No heavy assets that hurt load time. Target a 3 second first interactive on a mid-range laptop.
- No fake testimonials, fake metrics, or invented personal facts. Use clearly marked placeholders.
