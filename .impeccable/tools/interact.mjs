import { chromium } from "/home/e1yu/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core/index.mjs";
const S = process.argv[2];
const b = await chromium.launch({ executablePath: process.env.HOME + "/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
const tops = await p.evaluate(() => Array.from(document.querySelectorAll("[data-scene]"), (s) => Math.round(s.getBoundingClientRect().top + scrollY)));
console.log("scene tops", tops);
await p.mouse.move(720, 450);
await p.mouse.wheel(0, 120);
await p.waitForTimeout(1200);
console.log("after one wheel", await p.evaluate(() => scrollY));
// momentum tail: small decaying deltas right after — must not step again
for (const d of [40, 30, 20, 12, 6]) { await p.mouse.wheel(0, d); await p.waitForTimeout(30); }
await p.waitForTimeout(1100);
console.log("after momentum", await p.evaluate(() => scrollY));
// hover door 02, wait for the live scene
await p.locator(".door-plate").nth(1).hover();
await p.waitForTimeout(6000);
console.log("open attr", await p.locator(".door-link").nth(1).getAttribute("data-open"));
await p.screenshot({ path: `${S}/hover.png` });
await p.locator(".door-plate").nth(0).click();
await p.waitForTimeout(300);
await p.screenshot({ path: `${S}/enter-mid.png` });
await p.waitForURL("**/projects/parada", { timeout: 15000 }).catch(() => {});
await p.waitForTimeout(1500);
console.log("url", p.url(), "overlay", await p.locator(".door-transition").count());
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no errors");
await b.close();
