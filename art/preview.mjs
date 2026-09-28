// Quick stills for checking models: `node preview.mjs Parada Tala` → out/<id>.png
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { bundleProject, here } from "./bundle.mjs";

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const chromiumOptions = process.env.REMOTION_GL ? { gl: process.env.REMOTION_GL } : {};
const common = { browserExecutable, chromiumOptions, logLevel: "error" };
const out = path.join(here, "out");
mkdirSync(out, { recursive: true });
const serveUrl = await bundleProject();
for (const id of process.argv.slice(2)) {
  const [name, frame] = id.split("@");
  const composition = await selectComposition({ serveUrl, id: name, ...common });
  const file = path.join(out, `${id.replace("@", "-")}.png`);
  await renderStill({ serveUrl, composition, output: file, frame: frame ? Number(frame) : 0, ...common });
  console.log("✓", file);
}
