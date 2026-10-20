# Autopilot procedures

Scheduled runs start fresh with no memory. Read `CLAUDE.md`, `.autopilot/state.json`, and `BACKLOG.md` first.

## Daily build run (6 AM ET)
1. If `PAUSE` exists in the repo root, log "paused" in `.autopilot/log.md` and stop.
2. `git pull origin main`. Set git author as in `CLAUDE.md`.
3. Read `.autopilot/state.json`.
   - If `today.date` is not today's date (America/New_York), roll N with a random integer from `roll_min` to `roll_max` (inclusive), and set `today = {date, rolled: N, made: 0}`.
   - Compute `allowed = min(rolled - made, weekly_cap - week_commits)`. If the week has changed (Monday start), reset `week_commits` to 0 first. If `allowed <= 0`, log and stop.
4. Repeat `allowed` times:
   a. Take the top unchecked ticket in `BACKLOG.md` that matches the "Current theme" line, or the top unchecked ticket if none match. If no unchecked tickets remain, write 6 new small tickets from `VISION.md` first (and commit them as `docs: refill backlog`), then continue. Mark the ticket `[~]` while working.
   b. Implement only that ticket.
   c. Check `git diff --shortstat`. If over about 60 changed lines (excluding lockfiles and `.glb`), revert with `git checkout -- . && git clean -fd`, split the ticket into smaller tickets in `BACKLOG.md`, and continue.
   d. Run `npm run check`. On failure, try one fix. If it still fails, revert, mark the ticket `[!]` with a one-line reason, and continue.
   e. Start the reviewer agent. Give it ONLY the ticket text and the output of `git diff`. It must reply `APPROVE` or `REJECT: reasons`. It checks: ticket scope, bugs, style rules in `CLAUDE.md`, accessibility, and performance.
   f. On REJECT, allow one revision, then re-review. A second reject means revert and mark the ticket `[!]`.
   g. On APPROVE, mark the ticket `[x]`, commit (message format in `CLAUDE.md`), `git push origin main`, and update `state.json` (`made`, `week_commits`).
5. Append a short entry to `.autopilot/log.md`: date, rolled N, commits made, tickets skipped, and any rate-limit stop. Commit log and state updates with the last commit or a final `chore: autopilot log` commit.
6. Stop immediately on any rate-limit or usage error. Log it. Do not try to catch up the next day.

## Weekly code review (Sunday 8 PM ET)
Review the whole repo as a skeptical senior engineer, using fresh context. Look at structure, dead code, bundle size, performance of the 3D scene, accessibility, and adherence to `CLAUDE.md`. Write findings to `reviews/YYYY-MM-DD-code.md` (max 1 page). Add up to 8 small, concrete tickets to the top of `BACKLOG.md`. Do not change source code.

Then plan next week. Read `VISION.md`, pick the theme (a district or interest) for the coming week, rotating through the interests and favoring unfinished districts. Update the "Current theme" line at the top of `BACKLOG.md` and write 6 to 8 original, small tickets for that theme at the top. Make them specific and visible. Flag any filler commits from the past week (renames or tiny tweaks with no visible or functional effect) in the review. Respect the IP rules in `VISION.md`.

## Weekly visual review (Sunday 10 PM ET)
Run the site locally (`npm run build && npm start`), capture screenshots with headless Playwright (software WebGL), and judge the visuals against `benchmarks/BRIEF.md` and `VISION.md`. Score 1 to 10 on: intro ritual, sense of a world, interaction delight, UI restraint, polish and performance, and low-poly consistency. Check that no brand logos or copied assets slipped in. Write `reviews/YYYY-MM-DD-visual.md` (max 1 page) and add up to 8 small tickets to the top of `BACKLOG.md`. Do not change source code.

## Adjusting speed
Edit `roll_min`, `roll_max`, and `weekly_cap` in `.autopilot/state.json` to control how fast the site grows.
