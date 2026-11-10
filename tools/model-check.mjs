// Usage: node tools/model-check.mjs <name> <label> [port]
// Renders public/models/<name>.glb lit and unlit from all 4 angles into .autopilot/shots/<name>/,
// then prints numbers the builder can fail on BEFORE the critic sees the model: frame size,
// shadow saturation, grey share, hue drift caused by lighting, shadow to light value, satKept
// (color surviving the light), greyMid (lit grey mid-tones) and a per-surface unlit -> lit table.
// Needs a dev server (npm run dev -- -p 3100) and playwright (npm i --no-save playwright).
import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const [name, label, port = "3100"] = process.argv.slice(2);
if (!name || !label) {
  console.error("Usage: node tools/model-check.mjs <name> <label> [port]");
  process.exit(1);
}
const dir = `.autopilot/shots/${name}`;
mkdirSync(dir, { recursive: true });
const chrome = process.env.CHROME_PATH || ["/opt/google/chrome/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => existsSync(p));
const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : {}),
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const shoot = async (angle, unlit) => {
  await page.goto(`http://localhost:${port}/dev/model-preview?src=/models/${name}.glb&angle=${angle}${unlit ? "&unlit=1" : ""}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  const buf = await page.screenshot();
  writeFileSync(`${dir}/${label}-angle${angle}${unlit ? "-unlit" : ""}.png`, buf);
  return buf.toString("base64");
};

// Runs in the page: decode both PNGs, compare lit to unlit on the model's pixels.
const analyze = ([litB64, unlitB64]) => {
  const load = async (b64) => {
    const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const x = c.getContext("2d");
    x.drawImage(bmp, 0, 0);
    return x.getImageData(0, 0, bmp.width, bmp.height).data;
  };
  const hsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
    let h = 0;
    if (d) h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: h * 60, s: mx ? d / mx : 0, v: mx };
  };
  const dh = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
  return Promise.all([load(litB64), load(unlitB64)]).then(([L, U]) => {
    const px = [];
    const all = []; // every model pixel, near-black included, for the per-surface table
    for (let i = 0; i < U.length; i += 4) {
      if (Math.abs(U[i] - 10) + Math.abs(U[i + 1] - 11) + Math.abs(U[i + 2] - 16) < 14) continue;
      const l = hsv(L[i], L[i + 1], L[i + 2]);
      const u = hsv(U[i], U[i + 1], U[i + 2]);
      const p = { l, u, lc: [L[i], L[i + 1], L[i + 2]], uc: [U[i], U[i + 1], U[i + 2]] };
      all.push(p);
      if (l.v >= 0.18) px.push(p); // saturation is noise on near-black pixels, so the other metrics skip them
    }
    const total = U.length / 4;
    // Per-surface table: group model pixels by unlit color (8 levels per channel) and average lit versus unlit.
    const groups = new Map();
    for (const p of all) {
      const k = p.uc.map((v) => v >> 5).join(",");
      const g = groups.get(k) || { n: 0, u: [0, 0, 0], l: [0, 0, 0] };
      g.n++;
      for (let c = 0; c < 3; c++) { g.u[c] += p.uc[c]; g.l[c] += p.lc[c]; }
      groups.set(k, g);
    }
    const surfaces = [...groups.values()]
      .filter((g) => g.n / all.length >= 0.04)
      .sort((a, b) => b.n - a.n)
      .slice(0, 7)
      .map((g) => ({ share: g.n / all.length, unlit: g.u.map((v) => v / g.n), lit: g.l.map((v) => v / g.n) }));
    px.sort((a, b) => a.l.v - b.l.v);
    const n = Math.floor(px.length * 0.3);
    const shade = px.slice(0, n), light = px.slice(-n);
    const mean = (a, f) => a.reduce((t, p) => t + f(p), 0) / Math.max(1, a.length);
    const colorful = px.filter((p) => p.u.s > 0.25);
    const drift = mean(shade.filter((p) => p.l.s > 0.15 && p.u.s > 0.15), (p) => dh(p.l.h, p.u.h));
    const pinkShift = shade.filter((p) => p.l.h >= 290 && p.l.h <= 350 && !(p.u.h >= 290 && p.u.h <= 350)).length / Math.max(1, shade.length);
    return {
      surfaces,
      area: px.length / total,
      shadeSat: mean(shade, (p) => p.l.s),
      greyShare: shade.filter((p) => p.l.s < 0.2).length / Math.max(1, shade.length),
      drift,
      pinkShift,
      ratio: mean(shade, (p) => p.l.v) / Math.max(0.01, mean(light, (p) => p.l.v)),
      // Share of the whole model that is lit grey: low saturation at mid value (off-white parts that shading turned dull).
      greyMid: px.filter((p) => p.l.s < 0.15 && p.l.v > 0.3 && p.l.v < 0.85).length / Math.max(1, px.length),
      // How much of the albedo's color survives lighting, over pixels that are colorful unlit.
      satKeep: mean(colorful, (p) => p.l.s) / Math.max(0.01, mean(colorful, (p) => p.u.s)),
    };
  });
};

const SATKEEP = 0.8;
const fails = [];
for (let a = 0; a < 4; a++) {
  const lit = await shoot(a, false);
  const unlit = await shoot(a, true);
  const r = await page.evaluate(analyze, [lit, unlit]);
  const flags = [];
  if (r.area < 0.1) flags.push("model fills under 10% of the frame");
  if (r.shadeSat < 0.4) flags.push("shadows are dusty (saturation under 0.40)");
  if (r.greyShare > 0.13) flags.push("over 13% of shadow pixels are grey");
  if (r.drift > 16) flags.push("lighting shifts shadow hue by over 16 degrees: check emissive and fill light, not the palette");
  if (r.pinkShift > 0.12) flags.push("lighting turns over 12% of shadow pixels pink or mauve");
  if (r.satKeep < SATKEEP) flags.push("lighting washes out the albedo: colorful surfaces keep under " + (SATKEEP * 100) + "% of their saturation");
  if (r.greyMid > 0.1) flags.push("over 10% of the model is lit grey (low saturation mid-tones): give pale parts a cream, mint or ice tint, not neutral off-white");
  if (r.ratio < 0.22) flags.push("shadows are too dark against the light side");
  if (r.ratio > 0.85) flags.push("shadow and light sides are nearly the same value (flat)");
  console.log(`angle ${a}: frame ${(r.area * 100).toFixed(0)}%  shadowSat ${r.shadeSat.toFixed(2)}  grey ${(r.greyShare * 100).toFixed(0)}%  hueDrift ${r.drift.toFixed(0)}deg  pinkShift ${(r.pinkShift * 100).toFixed(0)}%  shadow/light ${r.ratio.toFixed(2)}  satKept ${(r.satKeep * 100).toFixed(0)}%  greyMid ${(r.greyMid * 100).toFixed(0)}%`);
  // Per-surface: a big surface whose color changes a lot once lit is a LIGHTING problem, fix it in the material (see README, Lighting).
  const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const hv = (c) => {
    const [r, g, b] = c.map((v) => v / 255);
    const mx = Math.max(r, g, b), d = mx - Math.min(r, g, b);
    let h = 0;
    if (d) h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: h * 60, s: mx ? d / mx : 0, v: mx };
  };
  for (const sf of r.surfaces) {
    const u = hv(sf.unlit), l = hv(sf.lit);
    const dh = Math.min(Math.abs(u.h - l.h), 360 - Math.abs(u.h - l.h));
    const bad = [];
    if (u.s > 0.25 && dh > 24) bad.push(`hue moves ${dh.toFixed(0)} degrees`);
    if (u.s > 0.25 && l.s < u.s * 0.55) bad.push("loses almost half its saturation");
    if (u.v > 0.4 && l.v < u.v * 0.42) bad.push("goes near black lit");
    console.log(`    surface ${(sf.share * 100).toFixed(0)}%  unlit ${hex(sf.unlit)} -> lit ${hex(sf.lit)}${bad.length ? "  <-- " + bad.join(", ") : ""}`);
    if (bad.length) flags.push(`surface ${hex(sf.unlit)} (${(sf.share * 100).toFixed(0)}% of the model) ${bad.join(", ")}`);
  }
  flags.forEach((f) => { console.log(`  FAIL: ${f}`); fails.push(`angle ${a}: ${f}`); });
}
await browser.close();
console.log(fails.length ? `CHECK: FAIL (${fails.length}). Fix these before the critic sees the model.` : "CHECK: PASS");
process.exitCode = fails.length ? 1 : 0;
