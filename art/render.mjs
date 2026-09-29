// Renders every asset the site uses into ../public/art. `npm run render`.
// Optional env: REMOTION_BROWSER_EXECUTABLE (path to a Chrome headless shell),
// REMOTION_GL (e.g. "swangle" on machines without a GPU), ONLY (comma-separated ids).
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { bundleProject, here } from "./bundle.mjs";
import { encodeFilm } from "./encode.mjs";

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

// Films: composed at 1280×720 and rendered at 1.5× (1920×1080) so type and edges stay
// crisp. Remotion renders a near-lossless master into out/; encode.mjs turns it into the
// served H.264 + AAC and VP9 + Opus files, in standard limited-range BT.709.
const FILM_SCALE = 1.5;
mkdirSync(path.join(here, "out"), { recursive: true });

const film = async (id, name, posterFrame) => {
  const composition = await comp(id);
  await still(id, `films/${name}.jpg`, { imageFormat: "jpeg", jpegQuality: 88, frame: posterFrame, scale: FILM_SCALE });
  const master = path.join(here, "out", `${name}.master.mp4`);
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 12,
    x264Preset: "slow",
    scale: FILM_SCALE,
    imageFormat: "jpeg",
    jpegQuality: 96,
    audioCodec: "aac",
    audioBitrate: "192k",
    outputLocation: master,
    ...common,
  });
  encodeFilm(master, name);
};

// Transparent model renders: covers, and the first paint before WebGL.
if (want("Macropad")) await still("Macropad", "macropad.webp", { imageFormat: "webp" });
if (want("Parada")) await still("Parada", "parada.webp", { imageFormat: "webp" });
if (want("Tala")) await still("Tala", "tala.webp", { imageFormat: "webp" });
if (want("ShareImage")) await still("ShareImage", "og.jpg", { imageFormat: "jpeg", jpegQuality: 88 });
if (want("ParadaFilm")) await film("ParadaFilm", "parada", 40);
if (want("TalaFilm")) await film("TalaFilm", "tala", 45);
