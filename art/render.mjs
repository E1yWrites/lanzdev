// Renders every asset the site uses into ../public/art. `npm run render`.
// Optional env: REMOTION_BROWSER_EXECUTABLE (path to a Chrome headless shell),
// REMOTION_GL (e.g. "swangle" on machines without a GPU), ONLY (comma-separated ids).
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { bundleProject, here } from "./bundle.mjs";

const out = path.join(here, "..", "public", "art");
mkdirSync(path.join(out, "films"), { recursive: true });

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const chromiumOptions = process.env.REMOTION_GL ? { gl: process.env.REMOTION_GL } : {};
const common = { browserExecutable, chromiumOptions, logLevel: "error" };
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
const want = (id) => !only || only.has(id);

const serveUrl = await bundleProject();
const comp = (id) => selectComposition({ serveUrl, id, ...common });

const still = async (id, file, opts = {}) => {
  await renderStill({ serveUrl, composition: await comp(id), output: path.join(out, file), ...common, ...opts });
  console.log("✓", file);
};

const film = async (id, name, posterFrame) => {
  const composition = await comp(id);
  await still(id, `films/${name}.jpg`, { imageFormat: "jpeg", jpegQuality: 84, frame: posterFrame });
  await renderMedia({ serveUrl, composition, codec: "h264", crf: 26, x264Preset: "slow", outputLocation: path.join(out, "films", `${name}.mp4`), ...common });
  console.log("✓", `films/${name}.mp4`);
  await renderMedia({ serveUrl, composition, codec: "vp9", crf: 38, outputLocation: path.join(out, "films", `${name}.webm`), ...common });
  console.log("✓", `films/${name}.webm`);
};

// Transparent model renders: covers, and the first paint before WebGL.
if (want("Macropad")) await still("Macropad", "macropad.webp", { imageFormat: "webp" });
if (want("Parada")) await still("Parada", "parada.webp", { imageFormat: "webp" });
if (want("Tala")) await still("Tala", "tala.webp", { imageFormat: "webp" });
if (want("ShareImage")) await still("ShareImage", "og.jpg", { imageFormat: "jpeg", jpegQuality: 88 });
if (want("ParadaFilm")) await film("ParadaFilm", "parada", 40);
if (want("TalaFilm")) await film("TalaFilm", "tala", 45);
