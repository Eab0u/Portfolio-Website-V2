// Usage: node tools/shot.mjs <url> <out.png> [waitMs]
// Captures a screenshot with headless Chromium and software WebGL.
// Needs playwright: npm i --no-save playwright
// Uses a system Chrome if one exists (set CHROME_PATH to override). The sandbox often
// blocks Playwright's own browser download, so a system Chrome is the reliable path.
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [url, out, wait = "3500"] = process.argv.slice(2);
if (!url || !out) {
  console.error("Usage: node tools/shot.mjs <url> <out.png> [waitMs]");
  process.exit(1);
}

mkdirSync(dirname(out), { recursive: true });
const systemChrome =
  process.env.CHROME_PATH ||
  ["/opt/google/chrome/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => existsSync(p));

const browser = await chromium.launch({
  ...(systemChrome ? { executablePath: systemChrome } : {}),
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(wait));
await page.screenshot({ path: out });
await browser.close();
if (errors.length) console.log("Page errors:\n" + errors.slice(0, 5).join("\n"));
console.log(`Saved ${out}`);
