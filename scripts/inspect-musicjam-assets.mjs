import path from "node:path";
import { createRequire } from "node:module";

const home = process.env.HOME || process.env.USERPROFILE;
const runtimeNodeModules = path.join(
  home,
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "node_modules",
  "@oai",
  "artifact-tool",
  "node_modules",
);
const require = createRequire(path.join(runtimeNodeModules, "resolver.cjs"));
const { loadImage } = require("skia-canvas");
const fs = require("node:fs");

const dir = path.resolve("assets", "musicjam");
for (const file of fs.readdirSync(dir).filter((name) => /\.(png|jpe?g)$/i.test(name)).sort()) {
  const image = await loadImage(path.join(dir, file));
  console.log(`${file}\t${image.width}x${image.height}`);
}
