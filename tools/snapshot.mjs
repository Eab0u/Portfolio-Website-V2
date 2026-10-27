// Captures a weekly screenshot and appends an entry to public/snapshots/index.json.
// Run from the repo root while the production server is up on localhost:3000.
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const START = Date.UTC(2026, 9, 19); // Monday Oct 19, 2026 = week 1 start
const now = new Date();
const week = Math.floor((now.getTime() - 12 * 3600e3 - START) / (7 * 86400e3)) + 1;
const name = `week-${String(week).padStart(2, "0")}`;

const dir = "public/snapshots";
mkdirSync(dir, { recursive: true });
const indexPath = `${dir}/index.json`;
const entries = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")) : [];

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
// Wait for the preloader overlay to leave the DOM, or fail so no loader image is committed.
try {
  await page.waitForSelector('[role="status"]', { state: "detached", timeout: 20000 });
} catch {
  console.error("Preloader overlay still present after 20 s, refusing to take a snapshot.");
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(2500);
await page.screenshot({ path: `${dir}/${name}.png` });
await browser.close();

const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();
const since = "7 days ago";
const commits = Number(sh(`git log --since="${since}" --oneline | wc -l`));
let added = 0;
let removed = 0;
const stat = sh(`git log --since="${since}" --numstat --pretty=tformat: -- . ':!public/snapshots' ':!package-lock.json'`);
for (const line of stat.split("\n")) {
  const [a, r] = line.split("\t");
  if (/^\d+$/.test(a) && /^\d+$/.test(r)) {
    added += Number(a);
    removed += Number(r);
  }
}

const filtered = entries.filter((e) => e.week !== week);
filtered.push({
  week,
  date: now.toISOString().slice(0, 10),
  image: `/snapshots/${name}.png`,
  sha: sh("git rev-parse --short HEAD"),
  commits,
  added,
  removed,
  summary: "",
  deploymentUrl: null,
});
writeFileSync(indexPath, JSON.stringify(filtered, null, 2) + "\n");
console.log(`Saved ${name}: ${commits} commits, +${added} -${removed}`);
