// Renders every asset the site uses into ../public/art. `npm run render`.
// Optional env: REMOTION_BROWSER_EXECUTABLE (path to a Chrome headless shell),
// REMOTION_GL (e.g. "swangle" on machines without a GPU).
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "public", "art");
mkdirSync(out, { recursive: true });

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const chromiumOptions = process.env.REMOTION_GL ? { gl: process.env.REMOTION_GL } : {};
const common = { browserExecutable, chromiumOptions, logLevel: "error" };

const serveUrl = await bundle({ entryPoint: path.join(here, "src", "index.ts") });
const comp = (id) => selectComposition({ serveUrl, id, ...common });

const still = async (id, file, opts = {}) => {
  await renderStill({ serveUrl, composition: await comp(id), output: path.join(out, file), ...common, ...opts });
  console.log("✓", file);
};

await still("Parada", "parada.webp", { imageFormat: "webp" });
await still("Modpack", "modpack.webp", { imageFormat: "webp" });
await still("ShareImage", "og.jpg", { imageFormat: "jpeg", jpegQuality: 88 });
await still("Hero", "hero-poster.jpg", { imageFormat: "jpeg", jpegQuality: 86, frame: 0 });

const hero = await comp("Hero");
await renderMedia({ serveUrl, composition: hero, codec: "h264", crf: 23, outputLocation: path.join(out, "hero.mp4"), ...common });
console.log("✓ hero.mp4");
await renderMedia({ serveUrl, composition: hero, codec: "vp9", crf: 36, outputLocation: path.join(out, "hero.webm"), ...common });
console.log("✓ hero.webm");
