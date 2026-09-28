import path from "node:path";
import { Config } from "@remotion/cli/config";

// Same alias as bundle.mjs (kept self-contained: the CLI loads this file as CommonJS).
// The shared models in ../src/three import three / fiber / react — point them at this
// folder's node_modules so the bundle holds exactly one copy of each.
const dep = (name: string) => path.join(process.cwd(), "node_modules", name);

Config.overrideWebpackConfig((config) => ({
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
}));
