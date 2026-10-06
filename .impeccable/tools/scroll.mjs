import { chromium } from "/home/e1yu/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core/index.mjs";
const b = await chromium.launch({ executablePath: process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--disable-webgl", "--disable-3d-apis"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.mouse.move(720, 450);
const y = () => p.evaluate(() => Math.round(scrollY));
const check = (label, got, want) => console.log(got === want ? "ok  " : "FAIL", label, got, "want", want);
// a trackpad swipe: a burst, then a decaying momentum tail that outlasts the glide
for (const d of [60, 90, 110, 100, 80, 64, 50, 40, 32, 26, 20, 16, 12, 10, 8, 6, 5, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1]) { await p.mouse.wheel(0, d); await p.waitForTimeout(40); }
await p.waitForTimeout(1100); check("one swipe = one scene", await y(), 900);
// two scenes (the room, the house), then the footer scrolls freely
const bottom = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
await p.mouse.wheel(0, 120); await p.waitForTimeout(1100); const free = await y(); console.log(free > 900 ? "ok  " : "FAIL", "past the last scene: free scroll", free, "> 900");
await p.keyboard.press("End"); await p.waitForTimeout(1100); check("end", await y(), bottom);
await p.mouse.wheel(0, -2000); await p.waitForTimeout(1100); check("back up lands on the last scene", await y(), 900);
await p.mouse.wheel(0, -120); await p.waitForTimeout(1100); check("step up", await y(), 0);
await p.keyboard.press("PageDown"); await p.waitForTimeout(1100); check("page down", await y(), 900);
await b.close();
const b2 = await chromium.launch({ executablePath: process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--disable-webgl", "--disable-3d-apis"] });
const q = await b2.newPage({ viewport: { width: 1440, height: 900 } });
await q.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" }); await q.waitForTimeout(800); await q.mouse.move(720, 450);
const y2 = () => q.evaluate(() => Math.round(scrollY));
for (const d of [4, 5, 6, 5]) { await q.mouse.wheel(0, d); await q.waitForTimeout(40); }
await q.waitForTimeout(900); console.log((await y2()) === 0 ? "ok  " : "FAIL", "a 20px nudge stays put", await y2());
await q.mouse.wheel(0, 120); await q.waitForTimeout(250); await q.waitForTimeout(200); await q.mouse.wheel(0, 120); await q.waitForTimeout(1000);
console.log((await y2()) === 900 ? "ok  " : "FAIL", "a second swipe mid-glide stops at the last scene", await y2());
await b2.close();
