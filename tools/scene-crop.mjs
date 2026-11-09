// Usage: node tools/scene-crop.mjs <outPrefix> [port] [fx fy fw fh]
// Shows the home scene at the REAL hero camera, the way visitors see it, so the critic judges
// a model at the size and angle it will actually have. Writes:
//   <outPrefix>-desktop.png (1280x800) and <outPrefix>-mobile.png (390x844), and when a crop is
//   given (fractions 0 to 1 of the frame) <outPrefix>-desktop-crop.png at 2x for small details.
// Needs a running server (npm run dev -- -p 3100) and playwright (npm i --no-save playwright).
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [prefix, port = "3100", ...crop] = process.argv.slice(2);
if (!prefix) {
  console.error("Usage: node tools/scene-crop.mjs <outPrefix> [port] [fx fy fw fh]");
  process.exit(1);
}
mkdirSync(dirname(prefix), { recursive: true });
const chrome = process.env.CHROME_PATH || ["/opt/google/chrome/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => existsSync(p));
const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : {}),
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

const shot = async (w, h, scale, out, clip) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(8000); // preloader (min 2.4 s) plus the camera ease-in
  await page.screenshot({ path: out, ...(clip ? { clip } : {}) });
  await page.close();
  console.log(`Saved ${out}`);
};

await shot(1280, 800, 1, `${prefix}-desktop.png`);
await shot(390, 844, 1, `${prefix}-mobile.png`);
if (crop.length === 4) {
  const [fx, fy, fw, fh] = crop.map(Number);
  await shot(1280, 800, 2, `${prefix}-desktop-crop.png`, { x: fx * 1280, y: fy * 800, width: fw * 1280, height: fh * 800 });
}
await browser.close();
