// node scenes.mjs <url> <prefix> <w> <h> [motion] — one shot per [data-scene]; reduced motion unless "motion"
import { chromium } from "/home/e1yu/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core/index.mjs";
const [url, prefix, w, h, motion] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: motion ? "no-preference" : "reduce" });
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const n = await p.locator("[data-scene]").count();
for (let i = 0; i < n; i++) {
  await p.evaluate((i) => { const el = document.querySelectorAll("[data-scene]")[i]; scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: "instant" }); }, i);
  await p.waitForTimeout(motion ? 4000 : 700);
  await p.screenshot({ path: `${prefix}-${i}.png` });
}
console.log("scenes", n);
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await b.close();
