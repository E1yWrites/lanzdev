import { Config } from "@remotion/cli/config";
// @ts-expect-error — plain ESM helper shared with render.mjs
import { webpackOverride } from "./bundle.mjs";

Config.overrideWebpackConfig(webpackOverride);
