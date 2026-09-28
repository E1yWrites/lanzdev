// Bundles the Remotion project. The shared models live in ../src/three and import
// three / @react-three/fiber / react — point those at this folder's node_modules so
// there is exactly one copy of each in the bundle.
import { bundle } from "@remotion/bundler";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const here = path.dirname(fileURLToPath(import.meta.url));
const dep = (name) => path.join(here, "node_modules", name);

export const webpackOverride = (config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      three: dep("three"),
      "@react-three/fiber": dep("@react-three/fiber"),
      react: dep("react"),
      "react-dom": dep("react-dom"),
    },
  },
});

export const bundleProject = () => bundle({ entryPoint: path.join(here, "src", "index.ts"), webpackOverride });
