// Renders every asset the site uses into ../public/art. `npm run render`.
// Optional env: REMOTION_BROWSER_EXECUTABLE (path to a Chrome headless shell),
// REMOTION_GL (e.g. "swangle" on machines without a GPU), ONLY (comma-separated ids).
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
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

// Films: composed at 1280×720 and rendered at 1.5× (1920×1080) so type and edges stay
// crisp, from near-lossless frames. H.264 + AAC first; the WebM (VP9 + Opus) is
// transcoded from that master rather than rendered twice.
const FILM_SCALE = 1.5;
const ffmpegDir = path.join(here, "node_modules", "@remotion", "compositor-linux-x64-gnu");
const ffmpeg = (args) =>
  execFileSync(existsSync(path.join(ffmpegDir, "ffmpeg")) ? path.join(ffmpegDir, "ffmpeg") : "ffmpeg", ["-y", "-loglevel", "error", ...args], {
    env: { ...process.env, LD_LIBRARY_PATH: ffmpegDir },
    stdio: "inherit",
  });

const film = async (id, name, posterFrame) => {
  const composition = await comp(id);
  await still(id, `films/${name}.jpg`, { imageFormat: "jpeg", jpegQuality: 88, frame: posterFrame, scale: FILM_SCALE });
  const mp4 = path.join(out, "films", `${name}.mp4`);
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 19,
    x264Preset: "slow",
    scale: FILM_SCALE,
    imageFormat: "jpeg",
    jpegQuality: 96,
    audioCodec: "aac",
    audioBitrate: "192k",
    outputLocation: mp4,
    ...common,
  });
  console.log("✓", `films/${name}.mp4`);
  ffmpeg(["-i", mp4, "-c:v", "libvpx-vp9", "-crf", "31", "-b:v", "0", "-row-mt", "1", "-c:a", "libopus", "-b:a", "128k", path.join(out, "films", `${name}.webm`)]);
  console.log("✓", `films/${name}.webm`);
};

// Transparent model renders: covers, and the first paint before WebGL.
if (want("Macropad")) await still("Macropad", "macropad.webp", { imageFormat: "webp" });
if (want("Parada")) await still("Parada", "parada.webp", { imageFormat: "webp" });
if (want("Tala")) await still("Tala", "tala.webp", { imageFormat: "webp" });
if (want("ShareImage")) await still("ShareImage", "og.jpg", { imageFormat: "jpeg", jpegQuality: 88 });
if (want("ParadaFilm")) await film("ParadaFilm", "parada", 40);
if (want("TalaFilm")) await film("TalaFilm", "tala", 45);
