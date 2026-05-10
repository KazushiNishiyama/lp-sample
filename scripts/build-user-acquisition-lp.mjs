import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
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
const { Canvas, loadImage } = require("skia-canvas");

const W = 2000;
const ASSET_DIR = path.join(root, "assets", "musicjam");
const OUT_DIR = path.join(root, "lp-final");
const SECTION_DIR = path.join(OUT_DIR, "sections");
const HERO_PATH = path.join(OUT_DIR, "assets", "hero-user-acquisition.png");

const P = {
  ink: "#141824",
  navy: "#0f1724",
  blue: "#12b8ef",
  pink: "#ff4f97",
  yellow: "#ffd447",
  green: "#44c98a",
  orange: "#ff7948",
  paper: "#fbf7ef",
  cream: "#fff8ee",
  white: "#ffffff",
  muted: "#667085",
  line: "rgba(20,24,36,.14)",
};

const cache = new Map();

async function image(file, base = ASSET_DIR) {
  const full = path.join(base, file);
  if (!cache.has(full)) cache.set(full, await loadImage(full));
  return cache.get(full);
}

async function imagePath(full) {
  if (!cache.has(full)) cache.set(full, await loadImage(full));
  return cache.get(full);
}

function font(size, weight = 700) {
  return `${weight} ${size}px "Yu Gothic", "YuGothic", "Meiryo", sans-serif`;
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function roundPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function fillRound(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  roundPath(ctx, x, y, w, h, r);
  ctx.fill();
}

function strokeRound(ctx, x, y, w, h, r, stroke, width = 2) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  roundPath(ctx, x, y, w, h, r);
  ctx.stroke();
}

function text(ctx, value, x, y, opts = {}) {
  ctx.fillStyle = opts.fill ?? P.ink;
  ctx.font = font(opts.size ?? 32, opts.weight ?? 700);
  ctx.textBaseline = opts.baseline ?? "top";
  ctx.textAlign = opts.align ?? "left";
  const lineHeight = opts.lineHeight ?? Math.round((opts.size ?? 32) * 1.35);
  String(value)
    .split("\n")
    .forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}

function wrapText(ctx, value, x, y, maxWidth, opts = {}) {
  ctx.fillStyle = opts.fill ?? P.ink;
  ctx.font = font(opts.size ?? 28, opts.weight ?? 500);
  ctx.textBaseline = "top";
  const lineHeight = opts.lineHeight ?? Math.round((opts.size ?? 28) * 1.55);
  let line = "";
  let yy = y;
  for (const char of String(value).split("")) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = char;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

function cover(ctx, img, x, y, w, h, focalX = 0.5, focalY = 0.5) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = Math.max(0, Math.min(img.width - sw, img.width * focalX - sw / 2));
  const sy = Math.max(0, Math.min(img.height - sh, img.height * focalY - sh / 2));
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function contain(ctx, img, x, y, w, h) {
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function panel(height, fill = P.white) {
  const canvas = new Canvas(W, height);
  const ctx = canvas.getContext("2d");
  rect(ctx, 0, 0, W, height, fill);
  return { canvas, ctx };
}

function header(ctx) {
  rect(ctx, 0, 0, W, 112, "rgba(255,255,255,.88)");
  text(ctx, "3D & MUSIC JAM", 96, 39, { size: 31, weight: 900 });
  ["利用者作品", "できること", "安心支援", "よくある不安"].forEach((item, i) => {
    text(ctx, item, 1070 + i * 158, 43, { size: 18, weight: 800, fill: "#475467" });
  });
  fillRound(ctx, 1782, 26, 142, 58, 10, P.pink);
  text(ctx, "見学予約", 1812, 43, { size: 19, weight: 900, fill: P.white });
}

function label(ctx, value, x, y, color) {
  rect(ctx, x, y, 72, 9, color);
  text(ctx, value, x, y + 30, { size: 20, weight: 900, fill: color });
}

async function save(canvas, name) {
  await fs.mkdir(path.dirname(name), { recursive: true });
  await canvas.toFile(name);
}

async function heroSection() {
  const { canvas, ctx } = panel(1120, P.cream);
  const hero = await imagePath(HERO_PATH);
  cover(ctx, hero, 0, 0, W, 1120, 0.62, 0.5);
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "rgba(255,248,238,.98)");
  grad.addColorStop(0.34, "rgba(255,248,238,.92)");
  grad.addColorStop(0.58, "rgba(255,248,238,.18)");
  grad.addColorStop(1, "rgba(255,248,238,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 1120);
  header(ctx);

  label(ctx, "CREATIVE SUPPORT", 96, 210, P.pink);
  text(ctx, "好きなことから、\n通う理由をつくる。", 96, 300, {
    size: 83,
    lineHeight: 110,
    weight: 900,
    fill: P.ink,
  });
  wrapText(
    ctx,
    "イラスト・音楽・動画制作に取り組める、クリエイティブ特化型の就労継続支援B型。未経験でも、スタッフと一緒に少しずつ作品づくりを始められます。",
    102,
    560,
    740,
    { size: 31, lineHeight: 50, weight: 700, fill: "#344054" },
  );

  const chips = ["未経験OK", "心理支援スタッフ", "九段下駅 徒歩1分", "イラスト・音楽・動画"];
  let x = 100;
  chips.forEach((chip, i) => {
    const width = [154, 238, 236, 270][i];
    fillRound(ctx, x, 748, width, 58, 29, "rgba(255,255,255,.78)");
    strokeRound(ctx, x, 748, width, 58, 29, "rgba(20,24,36,.12)", 1.5);
    text(ctx, chip, x + 26, 765, { size: 19, weight: 900, fill: P.ink });
    x += width + 16;
  });

  fillRound(ctx, 100, 870, 296, 78, 12, P.pink);
  text(ctx, "見学・お問い合わせ", 145, 893, { size: 27, weight: 900, fill: P.white });
  fillRound(ctx, 430, 870, 278, 78, 12, "rgba(255,255,255,.78)");
  strokeRound(ctx, 430, 870, 278, 78, 12, "rgba(20,24,36,.16)");
  text(ctx, "利用者作品を見る", 476, 893, { size: 26, weight: 900, fill: P.ink });
  return canvas;
}

async function worksSection() {
  const { canvas, ctx } = panel(1220, P.white);
  label(ctx, "WORKS", 96, 96, P.blue);
  text(ctx, "ここで生まれた作品", 96, 180, { size: 68, weight: 900 });
  wrapText(ctx, "現行サイトに掲載されている作品素材を主役にして、「自分も作れるかも」という期待を最初に作る。", 100, 275, 1120, {
    size: 27,
    weight: 700,
    fill: P.muted,
    lineHeight: 44,
  });
  fillRound(ctx, 1550, 182, 278, 68, 12, P.blue);
  text(ctx, "利用者作品", 1618, 202, { size: 27, weight: 900, fill: P.white });

  const files = [
    "pc_area04_1.jpg",
    "pc_area04_2.jpg",
    "pc_area04_3.jpg",
    "pc_area04_4.jpg",
    "pc_area04_5.jpg",
    "pc_area04_6.jpg",
    "pc_area04_7.jpg",
    "pc_area04_8.jpg",
    "pc_area05_1.jpg",
    "pc_area05_2.jpg",
    "pc_area05_3.jpg",
    "pc_area05_4.jpg",
  ];
  const names = ["イラスト", "キャラクター", "音楽イメージ", "MV素材", "サムネイル", "制作途中"];
  const cardW = 280;
  const cardH = 262;
  const gap = 29;
  for (let i = 0; i < files.length; i += 1) {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = 96 + col * (cardW + gap);
    const y = 408 + row * 372;
    fillRound(ctx, x, y, cardW, cardH, 18, P.paper);
    const img = await image(files[i]);
    ctx.save();
    roundPath(ctx, x, y, cardW, cardH, 18);
    ctx.clip();
    cover(ctx, img, x, y, cardW, cardH);
    ctx.restore();
    text(ctx, names[i % names.length], x, y + cardH + 22, { size: 22, weight: 900 });
    rect(ctx, x, y + cardH + 58, 74, 7, [P.pink, P.blue, P.yellow, P.green, P.orange, P.blue][i % 6]);
  }
  return canvas;
}

async function activitySection() {
  const { canvas, ctx } = panel(1020, P.paper);
  label(ctx, "ACTIVITY", 96, 96, P.pink);
  text(ctx, "できること", 96, 180, { size: 68, weight: 900 });
  wrapText(ctx, "一般的な作業ではなく、好きなジャンルから制作に入れることを明確にする。LP画像・バナー画像は将来の生産活動として自然に組み込める。", 100, 275, 1240, {
    size: 27,
    weight: 700,
    fill: "#344054",
    lineHeight: 44,
  });
  const cards = [
    ["イラスト", "キャラクターや世界観を作品にする", "pc_area03_p1_img.png", P.pink],
    ["音楽・MV", "音と絵を組み合わせて表現する", "pc_area05_img1.jpg", P.blue],
    ["動画編集", "サムネイルや短尺動画へ広げる", "pc_area05_img2.jpg", P.yellow],
    ["LP画像・バナー画像", "活動成果を広報素材に変える", "pc_area06_img.jpg", P.green],
  ];
  for (let i = 0; i < cards.length; i += 1) {
    const [head, body, file, accent] = cards[i];
    const x = 96 + i * 465;
    const y = 430;
    fillRound(ctx, x, y, 395, 445, 20, P.white);
    strokeRound(ctx, x, y, 395, 445, 20, "rgba(20,24,36,.12)");
    const img = await image(file);
    ctx.save();
    roundPath(ctx, x + 24, y + 24, 347, 218, 16);
    ctx.clip();
    cover(ctx, img, x + 24, y + 24, 347, 218);
    ctx.restore();
    rect(ctx, x + 24, y + 282, 80, 8, accent);
    text(ctx, head, x + 24, y + 324, { size: 32, weight: 900 });
    wrapText(ctx, body, x + 26, y + 374, 325, { size: 21, weight: 700, fill: P.muted, lineHeight: 33 });
  }
  return canvas;
}

function beginnerSection() {
  const { canvas, ctx } = panel(900, P.white);
  label(ctx, "BEGINNER OK", 96, 95, P.green);
  text(ctx, "未経験でも始められる理由", 96, 180, { size: 66, weight: 900 });
  const steps = [
    ["01", "最初は見るだけでもOK", "作業内容や雰囲気を見てから、自分に合う制作を選べる。"],
    ["02", "好きなジャンルから始める", "イラスト、音楽、動画など、興味のある入口を用意する。"],
    ["03", "スタッフが一緒に進める", "作品づくりの進め方を一人で抱え込ませない。"],
    ["04", "自分のペースで通える", "体調や環境を見ながら、継続できる形を相談する。"],
  ];
  for (let i = 0; i < steps.length; i += 1) {
    const [no, head, body] = steps[i];
    const x = 96 + (i % 2) * 900;
    const y = 340 + Math.floor(i / 2) * 230;
    fillRound(ctx, x, y, 790, 160, 18, P.cream);
    rect(ctx, x, y, 12, 160, [P.pink, P.blue, P.yellow, P.green][i]);
    text(ctx, no, x + 40, y + 35, { size: 42, weight: 900, fill: [P.pink, P.blue, P.yellow, P.green][i] });
    text(ctx, head, x + 150, y + 34, { size: 34, weight: 900 });
    wrapText(ctx, body, x + 152, y + 86, 570, { size: 23, weight: 700, fill: P.muted, lineHeight: 36 });
  }
  return canvas;
}

async function supportSection() {
  const { canvas, ctx } = panel(1040, P.paper);
  label(ctx, "SUPPORT", 96, 96, P.green);
  text(ctx, "安心して通える支援", 96, 180, { size: 68, weight: 900 });
  wrapText(ctx, "創作のワクワクだけでなく、家族や相談支援員が安心できる材料を同じくらい強く見せる。", 100, 275, 1120, {
    size: 27,
    weight: 700,
    fill: "#344054",
    lineHeight: 44,
  });

  const staff = await image("pc_area10_img.jpg");
  ctx.save();
  roundPath(ctx, 96, 410, 610, 470, 24);
  ctx.clip();
  cover(ctx, staff, 96, 410, 610, 470, 0.5, 0.35);
  ctx.restore();

  const qa = [
    ["自分にできる作業があるか不安", "まずは見学で作業内容と雰囲気を確認。"],
    ["コミュニケーションが苦手", "一人で過ごしても大丈夫な環境を伝える。"],
    ["何日通えるか不安", "体調や環境に合わせて通所日数を相談。"],
    ["心理面が不安", "心理支援スタッフの存在を明確に見せる。"],
  ];
  for (let i = 0; i < qa.length; i += 1) {
    const [head, body] = qa[i];
    const x = 790 + (i % 2) * 500;
    const y = 420 + Math.floor(i / 2) * 210;
    fillRound(ctx, x, y, 430, 150, 16, P.white);
    rect(ctx, x, y, 10, 150, [P.pink, P.blue, P.yellow, P.green][i]);
    text(ctx, head, x + 34, y + 32, { size: 26, weight: 900 });
    wrapText(ctx, body, x + 36, y + 78, 350, { size: 20, weight: 700, fill: P.muted, lineHeight: 31 });
  }
  fillRound(ctx, 790, 850, 930, 90, 16, P.navy);
  text(ctx, "「楽しそう」と「安心できそう」を同時に作る。", 836, 877, { size: 31, weight: 900, fill: P.white });
  return canvas;
}

function flowFaqSection() {
  const { canvas, ctx } = panel(1180, P.white);
  label(ctx, "VISIT IMAGE", 96, 96, P.blue);
  text(ctx, "来たら何をするのかが分かる", 96, 180, { size: 64, weight: 900 });
  const steps = [
    ["見学", "雰囲気を見る"],
    ["相談", "好きなことを話す"],
    ["体験", "小さく作ってみる"],
    ["継続", "作品として残す"],
  ];
  for (let i = 0; i < steps.length; i += 1) {
    const x = 130 + i * 455;
    fillRound(ctx, x, 360, 320, 150, 18, P.cream);
    text(ctx, String(i + 1).padStart(2, "0"), x + 28, 390, { size: 40, weight: 900, fill: [P.pink, P.blue, P.yellow, P.green][i] });
    text(ctx, steps[i][0], x + 116, 394, { size: 36, weight: 900 });
    text(ctx, steps[i][1], x + 118, 450, { size: 22, weight: 700, fill: P.muted });
    if (i < steps.length - 1) {
      rect(ctx, x + 344, 433, 64, 4, "rgba(20,24,36,.22)");
    }
  }

  text(ctx, "よくある不安", 96, 650, { size: 54, weight: 900 });
  const faqs = [
    ["Q. 自分に合う作業があるか心配です。", "A. まず見学で、作業内容や雰囲気を一緒に確認できます。"],
    ["Q. 人間関係や会話が苦手です。", "A. 一人で過ごしても大丈夫。心理職のスタッフもサポートします。"],
    ["Q. 未経験でも大丈夫ですか？", "A. 最初は見るだけ・触ってみるだけでもOK。少しずつ進めます。"],
  ];
  for (let i = 0; i < faqs.length; i += 1) {
    const y = 742 + i * 125;
    fillRound(ctx, 96, y, 1808, 92, 16, i % 2 === 0 ? P.paper : P.cream);
    text(ctx, faqs[i][0], 132, y + 22, { size: 27, weight: 900 });
    text(ctx, faqs[i][1], 770, y + 25, { size: 24, weight: 700, fill: "#344054" });
  }
  return canvas;
}

function ctaSection() {
  const { canvas, ctx } = panel(760, P.navy);
  text(ctx, "まずは見学で、制作環境を見てください。", 96, 105, { size: 64, weight: 900, fill: P.white });
  wrapText(ctx, "イラスト・音楽・動画制作に興味がある方へ。スタッフと相談しながら、自分のペースで作品づくりを始められます。", 100, 212, 1200, {
    size: 28,
    weight: 700,
    fill: "rgba(255,255,255,.78)",
    lineHeight: 44,
  });
  fillRound(ctx, 100, 370, 310, 82, 12, P.pink);
  text(ctx, "見学・お問い合わせ", 145, 394, { size: 28, weight: 900, fill: P.white });
  fillRound(ctx, 445, 370, 278, 82, 12, "rgba(255,255,255,.12)");
  strokeRound(ctx, 445, 370, 278, 82, 12, "rgba(255,255,255,.24)");
  text(ctx, "03-6264-8883", 488, 394, { size: 28, weight: 900, fill: P.white });

  const facts = ["九段下駅 徒歩1分", "利用定員20名", "未経験歓迎", "心理支援スタッフ"];
  facts.forEach((fact, i) => {
    const x = 100 + i * 455;
    rect(ctx, x, 604, 84, 7, [P.pink, P.blue, P.yellow, P.green][i]);
    text(ctx, fact, x, 635, { size: 28, weight: 900, fill: P.white });
  });
  return canvas;
}

const sections = [
  ["01-hero.png", await heroSection()],
  ["02-works.png", await worksSection()],
  ["03-activity.png", await activitySection()],
  ["04-beginner.png", beginnerSection()],
  ["05-support.png", await supportSection()],
  ["06-flow-faq.png", flowFaqSection()],
  ["07-cta.png", ctaSection()],
];

await fs.mkdir(SECTION_DIR, { recursive: true });
for (const [name, canvas] of sections) {
  await save(canvas, path.join(SECTION_DIR, name));
}

const totalH = sections.reduce((sum, [, canvas]) => sum + canvas.height, 0);
const final = new Canvas(W, totalH);
const ctx = final.getContext("2d");
let y = 0;
for (const [, canvas] of sections) {
  ctx.drawImage(canvas, 0, y);
  y += canvas.height;
}
const finalPath = path.join(OUT_DIR, "user-acquisition-lp.png");
await save(final, finalPath);
console.log(finalPath);
