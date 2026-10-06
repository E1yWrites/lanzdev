// node cap.mjs <url> <out.png> <w> <h> [full] — reduced motion, so posters stay and entrances are settled.
import { chromium } from "/home/e1yu/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core/index.mjs";
const [url, out, w, h, full] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell" });
const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" });
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(800);
await p.screenshot({ path: out, fullPage: full === "full" });
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await b.close();
