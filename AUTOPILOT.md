# Autopilot procedures

Scheduled runs start fresh with no memory. Read `CLAUDE.md`, `VISION.md`, `ART_DIRECTION.md`, `.autopilot/state.json`, and `BACKLOG.md` first.

## Ticket types
- `(code)` (the default, untagged): one small change, about 30 to 50 changed lines.
- `(model)`: build one 3D model that the vision needs. Follows the Model workflow below. Exempt from the line limit for the script and GLB, but held to `ART_DIRECTION.md`.
A model ticket counts as one commit. Do at most ONE model ticket per daily run.

## Reviewers
Reviews are done by separate subagents with fresh context. Each gets ONLY its rubric file, the ticket text, and its inputs. Never give them your own reasoning or a prior verdict.
- **Code critic** (`.autopilot/reviewers/code-critic.md`): input is the ticket and `git diff`. Always used.
- **Artist critic** (`.autopilot/reviewers/artist-critic.md`): input is the ticket and screenshots. Used whenever a change touches how something looks (not for pure text or data swaps), and always for `(model)` tickets. For `(code)` tickets it runs in **change mode**: it gets `before.png` and `latest.png`, judges only what the ticket changed, and approves if that change is good and the scene is not worse. Whole-scene scoring is for `(model)` tickets and the weekly visual review.
Run the reviewers on Sonnet. On REJECT, allow one revision and re-review. If the critic's fixes are about things the ticket did not touch, do not revise; re-review once with a reminder to stay in change mode. A second reject means revert and mark the ticket `[!]` with the critic's notes. Exception: `(model)` tickets and tickets that add a new visual object get up to 5 revisions, and the builder does the self-check from the Model workflow (look at its own previews and fix obvious problems) before the first critic review.

## Screenshots
Needs playwright: `npm i --no-save playwright` (do not commit it). `tools/shot.mjs` uses the system Chrome at `/opt/google/chrome/chrome` if present, because the sandbox blocks Playwright's own browser download.
1. `npm run build`, then `npm start &`, then wait until `http://localhost:3000` responds.
2. `node tools/shot.mjs http://localhost:3000 .autopilot/shots/latest.png`
3. Stop the server when finished. Screenshots in `.autopilot/shots/` are never committed.
If screenshots cannot be taken, say so in the log and fall back to the code critic only, but do not approve model tickets without preview images.

## Build run (nightly, with a weekly random plan)
One recurring scheduled task starts this run every night at about 10:40 PM ET, including weekends. Most nights it should do real work only on planned days. The randomness lives here, in the weekly plan stored in `.autopilot/state.json`: 4 to 7 random days per week (weekends included), 1 to 10 commits per planned day. A long run may pass midnight. `D` always means the America/New_York date when the run STARTED, even after midnight.
1. If `PAUSE` exists in the repo root, log "paused" in `.autopilot/log.md` and stop.
2. `git pull origin main`. Set git author as in `CLAUDE.md`.
3. Read `.autopilot/state.json`.
   - Let `M` be the Monday of the week containing `D`. If `week_start` is not `M`, roll a new plan for the week: pick `k` as a random integer from 4 to 7 (at most the number of days from `D` through Sunday), choose `k` distinct dates from `D` through that Sunday, and give each a random integer of commits from 1 to 10. Use `python3` with `random.SystemRandom()` so the choices are really random. Save `week_start = M`, `week_commits = 0`, and `plan = [{date, commits, status: "pending", made: 0}, ...]` in `state.json`, and commit it as `chore: roll weekly plan`. Never edit the plan again except to update `status` and `made`.
   - Find the plan entry whose `date` is `D`. If there is none, or its `status` is not `pending`, log "no plan today" in one line, push the log, and stop. Do not install packages or run anything else.
   - `allowed = min(entry.commits, weekly_cap - week_commits)`. If `allowed <= 0`, log and stop.
   - Do not START a new commit after 2:00 AM ET. If time runs out, stop and log how many were left.
4. Repeat `allowed` times:
   a. Tickets under `## Priority` in `BACKLOG.md` come first, in order, whatever the theme. Otherwise take the top unchecked ticket in `BACKLOG.md` that matches the "Current theme" line, or the top unchecked ticket if none match. Skip `(model)` tickets after the first one this run. If no unchecked tickets remain, write 6 new small tickets from `VISION.md` first (commit as `docs: refill backlog`), then continue. Mark the ticket `[~]` while working.
   b. For rendered tickets, first take a baseline shot to `.autopilot/shots/before.png`. Implement only that ticket. For `(model)` tickets, follow the Model workflow.
   c. For `(code)` tickets, check `git diff --shortstat`. If over about 60 changed lines (excluding lockfiles and `.glb`), revert with `git checkout -- . && git clean -fd`, split the ticket into smaller tickets in `BACKLOG.md`, and continue.
   d. Run `npm run check`. On failure, try one fix. If it still fails, revert, mark the ticket `[!]` with a one-line reason, and continue.
   e. If the change touches anything rendered (`src/components`, `src/app`, `public/models`, palette, styles), take a screenshot (see Screenshots).
   f. Run the reviewers (see Reviewers). The artist critic also gets the screenshot.
   g. On approval, mark the ticket `[x]`, commit (format in `CLAUDE.md`), `git push origin main`, and update `state.json` (`week_commits`, and the plan entry's `made`).
   h. Deploy check: poll `gh api repos/Eab0u/Portfolio-Website-V2/commits/<sha>/status --jq .state` every 20 seconds for up to 5 minutes. If it becomes `failure` or `error`, run `git revert --no-edit <sha>`, push the revert, mark the ticket `[!]` with "deploy failed", log it, and STOP for the day. If it is still `pending` after 5 minutes, log that and continue.
5. Set the plan entry's `status` to `done` (or `partial` if you stopped early) and `made` to the number of commits. Append a short entry to `.autopilot/log.md`: date, planned N, commits made, tickets skipped, deploy results, and any rate-limit stop. Commit log and state updates with the last commit or a final `chore: autopilot log` commit.
6. Stop immediately on any rate-limit or usage error. Log it and mark the entry `partial`. Do not try to catch up on another day.

## Model workflow (for `(model)` tickets)
1. Read `ART_DIRECTION.md`. Write a short generator script in `tools/blender/` (Blender Python, headless) or `tools/models/` (Node), building the model from named parts using only palette colors.
2. Run it and export a Draco-compressed GLB to `public/models/`. Check the size (under 500 KB) and triangle count (within the budget in `ART_DIRECTION.md`). If headless Blender is not available, generate the geometry with Node or procedural Three.js instead. Do not block on it.
3. Make sure `/dev/model-preview` exists (see backlog). Take 4 screenshots with `?src=/models/<file>.glb&angle=0..3`.
4. Self-check first: open the 4 preview images yourself and compare them with `ART_DIRECTION.md`. Fix obvious problems (colors off the palette, hidden or clipped parts, flat or empty areas, a plain base, detail at only one scale) and re-render. Repeat up to 4 times, then run the artist critic on the 4 images and the code critic on the script. Up to 5 revisions. If it still fails, mark `[!]` with the notes and move on. A model ticket that has been rejected in two different runs stays `[!]` and is only reset by the weekly review, after the cause is fixed. If the critic's complaints are about color, check that the preview lighting is neutral before blaming the model.
5. Commit the script and GLB together.

## Weekly code review (Sunday 8 PM ET)
Use the code critic mindset (`.autopilot/reviewers/code-critic.md`) on the whole repo, with fresh context. Look at structure, dead code, bundle size, performance of the 3D scene, accessibility, and adherence to `CLAUDE.md`. Write findings to `reviews/YYYY-MM-DD-code.md` (max 1 page). Add up to 8 small, concrete tickets to the top of `BACKLOG.md`. Do not change source code.

Then plan next week. Read `VISION.md`, pick the theme (a district or interest) for the coming week, rotating through the interests and favoring unfinished districts. Update the "Current theme" line at the top of `BACKLOG.md` and write 6 to 8 original, small tickets for that theme at the top, including 1 or 2 `(model)` tickets. Make them specific and visible. Flag any filler commits from the past week in the review. Also compare this week's `plan` in `.autopilot/state.json` with what happened (check `.autopilot/log.md` and `git log`) and flag any planned day that was missed or partial at the top.

## Weekly visual review (Sunday 10 PM ET)
Act as the artist critic (`.autopilot/reviewers/artist-critic.md`) on the whole site. Run the site locally and take screenshots (see Screenshots), including `/timeline` and any other routes. Judge against `benchmarks/BRIEF.md`, `VISION.md`, and `ART_DIRECTION.md`. Score 1 to 10 on: intro ritual, sense of a world, interaction delight, UI restraint, polish and performance, and low-poly consistency. Check that no brand logos or copied assets slipped in. Write `reviews/YYYY-MM-DD-visual.md` (max 1 page) and add up to 8 small tickets to the top of `BACKLOG.md`. Do not change source code.

## Adjusting speed
Edit `weekly_cap` in `.autopilot/state.json` to cap how many commits a week can make. The days per week and commits per day are in the Build run section above and in `rules` in `state.json`.
