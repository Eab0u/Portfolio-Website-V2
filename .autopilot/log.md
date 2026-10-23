# Autopilot log

Newest entries at the bottom.

- 2026-10-20: scaffold created by hand. No daily runs yet.
- 2026-10-20 (test run): rolled 1, commits made 0. Ticket 'Use content/profile.ts in hero text' passed npm run check and the code critic (APPROVE) but the artist critic REJECTED (scores 6/5/2/6/3/4; notes were about the pre-existing plain icosahedron scene, not the text change). No revision was possible within ticket scope, so the source change was reverted and the ticket marked [!]. Screenshot capture worked. add_repo tool was not available in this session (repo was already cloned). No rate-limit stop. No deploy check needed (only a log commit pushed).
- 2026-10-21: rolled 2, commits made 2. (1) feat: dev model-preview route, code and artist critics APPROVE, deploy success. (2) feat: ?angle=0..3 presets for model-preview, code critic APPROVE (no screenshot, no model exists to render yet). No tickets skipped. No rate-limit stop. add_repo tool was not available (repo already cloned).
- 2026-10-21 (run started 22:38 ET): no plan today, the 2026-10-21 entry is already done (made 2 of 2). Nothing to do.
- 2026-10-22 (bpy check): `pip install bpy --break-system-packages` works in the sandbox (bpy 5.2.3 LTS, Python 3.13), and `import bpy` succeeds, so headless Blender generators in `tools/blender/` are usable. Node fallback is still allowed per CLAUDE.md.
