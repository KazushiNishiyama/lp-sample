import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "banners", "png");
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
const { Canvas } = require("skia-canvas");

const colors = {
  ink: "#151922",
  paper: "#fbf7ef",
  coral: "#f2674a",
  green: "#55c79a",
  blue: "#5878d9",
  yellow: "#f2c94c",
  muted: "#657080",
  tan: "#d9cec0",
};

function font(size, weight = 800) {
  return `${weight} ${size}px "Yu Gothic", "Meiryo", sans-serif`;
}

function text(ctx, value, x, y, size, fill = colors.ink, weight = 800) {
  ctx.fillStyle = fill;
  ctx.font = font(size, weight);
  ctx.fillText(value, x, y);
}

function draw1200(ctx) {
  ctx.fillStyle = colors.paper;
  ctx.fillRect(0, 0, 1200, 628);
  ctx.fillStyle = colors.ink;
  ctx.fillRect(64, 64, 434, 500);
  ctx.fillStyle = colors.green;
  ctx.fillRect(96, 98, 78, 30);
  text(ctx, "AIで", 96, 202, 62, "#fff", 900);
  text(ctx, "作品づくり", 96, 278, 62, "#fff", 900);
  text(ctx, "体験", 96, 352, 62, "#fff", 900);
  text(ctx, "イラスト・動画・LP制作を", 96, 422, 24, colors.yellow, 700);
  text(ctx, "未経験から", 96, 454, 24, colors.yellow, 700);
  ctx.fillStyle = colors.coral;
  ctx.fillRect(96, 492, 232, 52);
  text(ctx, "見学受付中", 124, 527, 24, "#fff", 900);

  ctx.fillStyle = "#fff";
  ctx.fillRect(560, 92, 520, 308);
  ctx.strokeStyle = "rgba(21,25,34,.16)";
  ctx.strokeRect(560, 92, 520, 308);
  ctx.fillStyle = colors.ink;
  ctx.fillRect(596, 128, 224, 40);
  ctx.fillStyle = colors.tan;
  ctx.fillRect(596, 188, 426, 16);
  ctx.fillRect(596, 222, 360, 16);
  ctx.fillStyle = colors.green;
  ctx.fillRect(596, 278, 154, 48);
  ctx.fillStyle = colors.yellow;
  ctx.beginPath();
  ctx.arc(998, 142, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.blue;
  ctx.fillRect(606, 438, 120, 84);
  ctx.fillStyle = colors.coral;
  ctx.fillRect(750, 438, 120, 84);
  ctx.fillStyle = colors.green;
  ctx.fillRect(894, 438, 120, 84);
  text(ctx, "3D & MUSIC JAM", 560, 556, 28, colors.ink, 900);
}

function draw1080(ctx) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = colors.paper;
  ctx.fillRect(86, 86, 908, 908);
  ctx.fillStyle = colors.yellow;
  ctx.beginPath();
  ctx.arc(838, 232, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.green;
  ctx.fillRect(150, 152, 166, 48);
  text(ctx, "好きを", 150, 322, 88, colors.ink, 900);
  text(ctx, "仕事に", 150, 432, 88, colors.ink, 900);
  text(ctx, "近づける", 150, 542, 88, colors.ink, 900);
  text(ctx, "AIでイラスト・動画・LP制作を体験", 154, 624, 34, colors.muted, 700);
  ctx.fillStyle = colors.ink;
  ctx.fillRect(150, 700, 780, 148);
  text(ctx, "AIクリエイティブ体験会", 194, 760, 38, "#fff", 900);
  text(ctx, "見学・体験受付中", 194, 815, 30, colors.yellow, 900);
  text(ctx, "3D & MUSIC JAM", 150, 924, 30, colors.ink, 900);
}

function draw728(ctx) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(0, 0, 728, 90);
  ctx.fillStyle = colors.green;
  ctx.fillRect(14, 14, 64, 62);
  text(ctx, "3D & MUSIC JAM", 96, 38, 18, colors.yellow, 900);
  text(ctx, "AIで作品づくり体験", 96, 66, 25, "#fff", 900);
  ctx.fillStyle = colors.coral;
  ctx.fillRect(542, 21, 150, 48);
  text(ctx, "見学受付中", 570, 53, 20, "#fff", 900);
}

async function render(name, width, height, draw) {
  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext("2d");
  draw(ctx);
  await canvas.toFile(path.join(outDir, name));
}

await fs.mkdir(outDir, { recursive: true });
await render("banner-ai-experience-1200x628.png", 1200, 628, draw1200);
await render("banner-ai-experience-1080x1080.png", 1080, 1080, draw1080);
await render("banner-ai-experience-728x90.png", 728, 90, draw728);
