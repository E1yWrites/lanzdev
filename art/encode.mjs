// Encodes a film master into the two files the site serves, in the most compatible
// form: limited ("TV") range BT.709 4:2:0, tagged, with standard profiles.
//
// Remotion renders from JPEG frames, which gives full-range BT.601 video ("yuvj420p").
// Phones play that happily, but some desktop hardware decoders (Windows especially)
// refuse or mis-handle it, so every film goes through this step.
//
//   node encode.mjs <master.mp4> <name>   →  ../public/art/films/<name>.{mp4,webm}
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const films = path.join(here, "..", "public", "art", "films");
const ffmpegDir = path.join(here, "node_modules", "@remotion", "compositor-linux-x64-gnu");

const ffmpeg = (args) =>
  execFileSync(existsSync(path.join(ffmpegDir, "ffmpeg")) ? path.join(ffmpegDir, "ffmpeg") : "ffmpeg", ["-y", "-loglevel", "error", ...args], {
    env: { ...process.env, LD_LIBRARY_PATH: ffmpegDir },
    stdio: "inherit",
  });

// full-range BT.601 in → limited-range BT.709 out
const VIDEO_FILTER = "scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p";
const COLOUR_TAGS = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];

export function encodeFilm(master, name) {
  // Work from a private copy, so re-encoding a file in place is safe.
  const tmp = mkdtempSync(path.join(os.tmpdir(), "film-"));
  const src = path.join(tmp, "master.mp4");
  copyFileSync(master, src);
  try {
    ffmpeg([
      "-i", src,
      "-vf", VIDEO_FILTER,
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-profile:v", "high", "-level:v", "4.1",
      ...COLOUR_TAGS,
      "-c:a", "aac", "-b:a", "192k",
      "-movflags", "+faststart",
      path.join(films, `${name}.mp4`),
    ]);
    console.log("✓", `films/${name}.mp4`);
    ffmpeg([
      "-i", src,
      "-vf", VIDEO_FILTER,
      "-c:v", "libvpx-vp9", "-profile:v", "0", "-crf", "31", "-b:v", "0", "-row-mt", "1",
      ...COLOUR_TAGS,
      "-c:a", "libopus", "-b:a", "128k",
      path.join(films, `${name}.webm`),
    ]);
    console.log("✓", `films/${name}.webm`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [master, name] = process.argv.slice(2);
  if (!master || !name) {
    console.error("usage: node encode.mjs <master.mp4> <name>");
    process.exit(1);
  }
  encodeFilm(path.resolve(master), name);
}
