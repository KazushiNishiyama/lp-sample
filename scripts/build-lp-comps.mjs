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

const W = 1600;
const H = 4800;
const paths = {
  assets: path.join(root, "assets", "musicjam"),
  heroes: path.join(root, "lp-comps", "heroes"),
  sections: path.join(root, "lp-comps", "sections"),
  full: path.join(root, "lp-comps", "full"),
};

const P = {
  ink: "#151922",
  navy: "#101826",
  paper: "#fbf7ef",
  cream: "#fff8ee",
  white: "#ffffff",
  pink: "#ff4f9a",
  cyan: "#16c7f3",
  yellow: "#ffd447",
  green: "#4ecb91",
  orange: "#ff7a3d",
  muted: "#657080",
  line: "rgba(21,25,34,.14)",
};

const works = [
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
  "pc_area05_5.jpg",
  "pc_area05_6.jpg",
  "pc_area05_7.jpg",
  "pc_area05_8.jpg",
  "pc_area05_9.jpg",
];

const variants = [
  {
    id: "01-mv-music",
    hero: "hero-01-mv-music.png",
    theme: "dark",
    accent: P.pink,
    accent2: P.cyan,
    kicker: "MV / MUSIC CREATIVE",
    title: "音と絵で、作品をつくる。",
    sub: "イラスト・音楽・動画制作に取り組める就労継続支援B型",
    tags: ["MV制作", "イラスト", "動画編集", "サムネイル制作"],
    proofTitle: "制作ジャンルを最初に見せ、興味から見学につなげる。",
  },
  {
    id: "02-works-gallery",
    hero: "hero-02-gallery.png",
    theme: "gallery",
    accent: P.cyan,
    accent2: P.yellow,
    kicker: "WORKS FIRST",
    title: "つくった作品が、自信になる。",
    sub: "未経験からでも、イラスト・音楽・動画づくりに取り組めます。",
    tags: ["Works Gallery", "利用者作品", "未経験OK", "制作ジャンル"],
    proofTitle: "実際の作品を主役にして、ここで作れる未来を見せる。",
  },
  {
    id: "03-support",
    hero: "hero-03-support.png",
    theme: "warm",
    accent: P.green,
    accent2: P.pink,
    kicker: "SUPPORT FIRST",
    title: "好きなことから、通える毎日へ。",
    sub: "心理支援スタッフが、制作と生活のペースをサポートします。",
    tags: ["心理支援", "未経験から少しずつ", "ひとりでも安心", "見学相談"],
    proofTitle: "不安を先に減らすことで、家族・支援者経由の問い合わせに効かせる。",
  },
  {
    id: "04-creator-school",
    hero: "hero-04-creator-school.png",
    theme: "clean",
    accent: P.pink,
    accent2: P.cyan,
    kicker: "CREATOR SCHOOL",
    title: "好きを、スキルに変える。",
    sub: "マンガ・イラスト・音楽・動画制作に特化したクリエイティブ型B型事業所",
    tags: ["プロの助言", "作品制作", "動画・音楽", "ポートフォリオ"],
    proofTitle: "福祉サイトではなく、通いたくなるクリエイティブスクールとして見せる。",
  },
  {
    id: "05-open-house",
    hero: "hero-05-open-house.png",
    theme: "campaign",
    accent: P.orange,
    accent2: P.cyan,
    kicker: "OPEN HOUSE",
    title: "3D & MUSIC JAM 説明会開催中",
    sub: "イラスト・音楽・動画制作を、見学で体験できます。",
    tags: ["説明会", "見学受付中", "九段下駅 徒歩1分", "制作体験"],
    proofTitle: "広告から来た人に、説明会参加の理由を一瞬で伝える。",
  },
  {
    id: "06-redesign",
    hero: "hero-06-redesign.png",
    theme: "compare",
    accent: P.cyan,
    accent2: P.pink,
    kicker: "LP REDESIGN",
    title: "伝わる順番を変えるだけで、見学したくなる。",
    sub: "Music Jamの強みを、作品・安心・見学導線に再編集。",
    tags: ["作品を先に見せる", "不安を消す", "CTAを固定", "スマホで見やすく"],
    proofTitle: "既存LPの素材を活かし、見せる順番と密度だけで乗り換え感を出す。",
  },
];

function font(size, weight = 700) {
  return `${weight} ${size}px "Yu Gothic", "YuGothic", "Meiryo", sans-serif`;
}

function roundRect(ctx, x, y, w, h, r) {
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
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
}

function strokeRound(ctx, x, y, w, h, r, stroke, width = 1) {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  roundRect(ctx, x, y, w, h, r);
  ctx.stroke();
}

function text(ctx, value, x, y, opts = {}) {
  ctx.fillStyle = opts.fill || P.ink;
  ctx.font = font(opts.size || 28, opts.weight || 700);
  ctx.textAlign = opts.align || "left";
  ctx.textBaseline = opts.baseline || "top";
  const lh = opts.lineHeight || Math.round((opts.size || 28) * 1.35);
  String(value)
    .split("\n")
    .forEach((line, index) => ctx.fillText(line, x, y + index * lh));
}

function wrapText(ctx, value, x, y, maxWidth, lineHeight, opts = {}) {
  ctx.fillStyle = opts.fill || P.ink;
  ctx.font = font(opts.size || 24, opts.weight || 500);
  ctx.textBaseline = "top";
  const words = String(value).split("");
  let line = "";
  let yy = y;
  for (const ch of words) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = ch;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

function drawCoverImage(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.width, h / image.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
}

function drawContainImage(ctx, image, x, y, w, h) {
  const scale = Math.min(w / image.width, h / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function overlay(ctx, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, W, H);
}

async function saveCanvas(canvas, file) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await canvas.toFile(file);
}

async function loadAssets() {
  const cache = new Map();
  async function img(file, group = "assets") {
    const p = group === "heroes" ? path.join(paths.heroes, file) : path.join(paths.assets, file);
    if (!cache.has(p)) cache.set(p, await loadImage(p));
    return cache.get(p);
  }
  return { img };
}

function createPanel(height, bg = P.white) {
  const canvas = new Canvas(W, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, height);
  return { canvas, ctx };
}

async function renderHero(v, assets) {
  const height = 960;
  const { canvas, ctx } = createPanel(height, v.theme === "dark" || v.theme === "gallery" ? P.navy : P.cream);
  const hero = await assets.img(v.hero, "heroes");
  drawCoverImage(ctx, hero, 0, 0, W, height);

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  const darkMode = v.theme === "dark" || v.theme === "gallery";
  grad.addColorStop(0, darkMode ? "rgba(10,15,24,.92)" : "rgba(255,248,238,.94)");
  grad.addColorStop(0.42, darkMode ? "rgba(10,15,24,.72)" : "rgba(255,248,238,.76)");
  grad.addColorStop(0.74, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, height);

  ctx.fillStyle = darkMode ? "rgba(16,24,38,.88)" : "rgba(255,255,255,.72)";
  ctx.fillRect(0, 0, W, 96);
  text(ctx, "3D & MUSIC JAM", 86, 34, { size: 28, fill: darkMode ? P.white : P.ink, weight: 900 });
  ["制作内容", "利用者作品", "安心サポート", "見学"].forEach((item, index) => {
    text(ctx, item, 910 + index * 132, 38, { size: 18, fill: darkMode ? "rgba(255,255,255,.76)" : P.muted, weight: 700 });
  });
  fillRound(ctx, 1368, 24, 146, 48, 8, v.accent);
  text(ctx, "見学予約", 1401, 37, { size: 18, fill: P.white, weight: 900 });

  ctx.fillStyle = v.accent;
  ctx.fillRect(86, 188, 90, 12);
  text(ctx, v.kicker, 86, 228, { size: 20, fill: v.accent2, weight: 900 });
  text(ctx, v.title, 86, 286, { size: v.id === "05-open-house" ? 68 : 76, fill: darkMode ? P.white : P.ink, weight: 900, lineHeight: 92 });
  wrapText(ctx, v.sub, 90, 482, 650, 42, { size: 27, fill: darkMode ? "rgba(255,255,255,.82)" : "#334155", weight: 700 });

  let x = 86;
  v.tags.forEach((tag) => {
    const w = Math.max(150, tag.length * 24 + 46);
    fillRound(ctx, x, 620, w, 54, 27, darkMode ? "rgba(255,255,255,.14)" : "rgba(21,25,34,.08)");
    strokeRound(ctx, x, 620, w, 54, 27, darkMode ? "rgba(255,255,255,.22)" : "rgba(21,25,34,.16)");
    text(ctx, tag, x + 24, 635, { size: 18, fill: darkMode ? P.white : P.ink, weight: 900 });
    x += w + 14;
  });

  fillRound(ctx, 86, 738, 246, 64, 10, v.accent);
  text(ctx, "見学・お問い合わせ", 119, 755, { size: 22, fill: P.white, weight: 900 });
  fillRound(ctx, 354, 738, 232, 64, 10, darkMode ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.78)");
  strokeRound(ctx, 354, 738, 232, 64, 10, darkMode ? "rgba(255,255,255,.24)" : "rgba(21,25,34,.16)");
  text(ctx, "利用者作品を見る", 389, 755, { size: 21, fill: darkMode ? P.white : P.ink, weight: 900 });
  return canvas;
}

async function renderWorks(v, assets) {
  const height = 980;
  const dark = v.theme === "gallery" || v.theme === "dark";
  const { canvas, ctx } = createPanel(height, dark ? P.navy : P.white);
  text(ctx, "利用者作品", 86, 88, { size: 60, fill: dark ? P.white : P.ink, weight: 900 });
  text(ctx, "既存LP掲載素材を使い、作品が生まれている事業所として最初に伝える。", 90, 168, {
    size: 24,
    fill: dark ? "rgba(255,255,255,.72)" : P.muted,
    weight: 700,
  });
  fillRound(ctx, 1230, 88, 230, 58, 10, v.accent);
  text(ctx, "Works Gallery", 1262, 105, { size: 22, fill: P.white, weight: 900 });

  const cols = 5;
  const gap = 22;
  const cardW = (W - 172 - gap * (cols - 1)) / cols;
  const cardH = 235;
  const selected = v.id === "02-works-gallery" ? works.slice(0, 15) : works.slice(2, 12);
  for (let i = 0; i < selected.length; i += 1) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = 86 + col * (cardW + gap);
    const y = 250 + row * (cardH + 54);
    fillRound(ctx, x, y, cardW, cardH, 14, dark ? "rgba(255,255,255,.08)" : P.cream);
    const image = await assets.img(selected[i]);
    ctx.save();
    roundRect(ctx, x, y, cardW, cardH, 14);
    ctx.clip();
    drawCoverImage(ctx, image, x, y, cardW, cardH);
    ctx.restore();
    text(ctx, ["Illustration", "Music Art", "Thumbnail", "Character", "Movie Still"][i % 5], x, y + cardH + 16, {
      size: 18,
      fill: dark ? "rgba(255,255,255,.82)" : P.ink,
      weight: 900,
    });
    ctx.fillStyle = v.accent;
    ctx.fillRect(x, y + cardH + 46, 54, 5);
  }
  return canvas;
}

async function renderProduction(v, assets) {
  const height = 800;
  const { canvas, ctx } = createPanel(height, P.paper);
  text(ctx, "制作できること", 86, 82, { size: 58, fill: P.ink, weight: 900 });
  wrapText(ctx, v.proofTitle, 90, 160, 880, 38, { size: 24, fill: "#334155", weight: 700 });

  const cards = [
    ["イラスト制作", "好きな世界観を作品にする", "pc_area03_p1_img.png"],
    ["音楽・MV", "音と絵を組み合わせる", "pc_area05_img1.jpg"],
    ["動画編集", "サムネイルや短尺動画へ展開", "pc_area05_img2.jpg"],
    ["LP・バナー画像", "活動成果を広報素材にする", "pc_area06_img.jpg"],
  ];
  for (let i = 0; i < cards.length; i += 1) {
    const [head, body, file] = cards[i];
    const x = 86 + i * 368;
    const y = 290;
    fillRound(ctx, x, y, 326, 386, 16, P.white);
    strokeRound(ctx, x, y, 326, 386, 16, "rgba(21,25,34,.12)");
    const img = await assets.img(file);
    ctx.save();
    roundRect(ctx, x + 20, y + 20, 286, 178, 12);
    ctx.clip();
    drawCoverImage(ctx, img, x + 20, y + 20, 286, 178);
    ctx.restore();
    ctx.fillStyle = [v.accent, v.accent2, P.yellow, P.green][i];
    ctx.fillRect(x + 20, y + 226, 62, 8);
    text(ctx, head, x + 20, y + 258, { size: 27, fill: P.ink, weight: 900 });
    wrapText(ctx, body, x + 22, y + 306, 266, 30, { size: 18, fill: P.muted, weight: 700 });
  }
  return canvas;
}

async function renderSupport(v, assets) {
  const height = 860;
  const dark = v.theme === "support-dark";
  const { canvas, ctx } = createPanel(height, dark ? P.navy : P.white);
  const image = await assets.img("pc_area10_img.jpg");
  ctx.save();
  roundRect(ctx, 86, 92, 560, 440, 18);
  ctx.clip();
  drawCoverImage(ctx, image, 86, 92, 560, 440);
  ctx.restore();

  text(ctx, "安心して続けるための支援", 720, 104, { size: 54, fill: P.ink, weight: 900 });
  wrapText(ctx, "公認心理師・カウンセラーなどの支援体制を、制作活動と同じくらい前面に出す。派手な作品訴求だけでなく、家族や支援者が安心して問い合わせできる構成にする。", 724, 194, 700, 40, {
    size: 24,
    fill: "#334155",
    weight: 700,
  });

  const points = [
    ["未経験から少しずつ", "できることを一緒に探す"],
    ["心理支援スタッフ", "相談できる環境を見せる"],
    ["ひとりでも大丈夫", "不安を先に消す"],
    ["見学で確認", "雰囲気を体験できる"],
  ];
  points.forEach(([head, body], i) => {
    const x = 724 + (i % 2) * 360;
    const y = 390 + Math.floor(i / 2) * 132;
    fillRound(ctx, x, y, 316, 94, 12, P.cream);
    ctx.fillStyle = [v.accent, v.accent2, P.green, P.yellow][i];
    ctx.fillRect(x, y, 8, 94);
    text(ctx, head, x + 26, y + 18, { size: 24, fill: P.ink, weight: 900 });
    text(ctx, body, x + 28, y + 54, { size: 17, fill: P.muted, weight: 700 });
  });

  fillRound(ctx, 86, 620, 1428, 110, 18, P.navy);
  text(ctx, "見学前の不安を、作品づくりの期待に変える。", 132, 650, { size: 36, fill: P.white, weight: 900 });
  text(ctx, "Music Jamの強みであるクリエイティブと心理支援を、1つの導線にまとめる。", 136, 700, {
    size: 21,
    fill: "rgba(255,255,255,.74)",
    weight: 700,
  });
  return canvas;
}

async function renderCta(v) {
  const height = 640;
  const { canvas, ctx } = createPanel(height, P.navy);
  text(ctx, "まずは見学で、制作環境を見てください。", 86, 90, { size: 58, fill: P.white, weight: 900 });
  wrapText(ctx, "イラスト・音楽・動画制作に興味がある方へ。スタッフと相談しながら、自分のペースで作品づくりを始められます。", 90, 188, 980, 42, {
    size: 25,
    fill: "rgba(255,255,255,.78)",
    weight: 700,
  });
  fillRound(ctx, 90, 314, 300, 70, 12, v.accent);
  text(ctx, "見学・お問い合わせ", 128, 334, { size: 25, fill: P.white, weight: 900 });
  fillRound(ctx, 420, 314, 250, 70, 12, "rgba(255,255,255,.12)");
  strokeRound(ctx, 420, 314, 250, 70, 12, "rgba(255,255,255,.24)");
  text(ctx, "03-6264-8883", 455, 334, { size: 25, fill: P.white, weight: 900 });

  const facts = ["九段下駅 徒歩1分", "利用定員20名", "未経験歓迎", "心理支援スタッフ"];
  facts.forEach((fact, i) => {
    const x = 90 + i * 360;
    ctx.fillStyle = [v.accent, v.accent2, P.yellow, P.green][i];
    ctx.fillRect(x, 500, 64, 6);
    text(ctx, fact, x, 522, { size: 24, fill: P.white, weight: 900 });
  });
  return canvas;
}

async function renderVariant(v, assets) {
  const sectionDir = path.join(paths.sections, v.id);
  await fs.mkdir(sectionDir, { recursive: true });
  const panels = [
    ["01-hero.png", await renderHero(v, assets)],
    ["02-works.png", await renderWorks(v, assets)],
    ["03-production.png", await renderProduction(v, assets)],
    ["04-support.png", await renderSupport(v, assets)],
    ["05-cta.png", await renderCta(v)],
  ];
  for (const [name, canvas] of panels) {
    await saveCanvas(canvas, path.join(sectionDir, name));
  }

  const fullH = panels.reduce((sum, [, canvas]) => sum + canvas.height, 0);
  const final = new Canvas(W, fullH);
  const ctx = final.getContext("2d");
  let y = 0;
  for (const [, canvas] of panels) {
    ctx.drawImage(canvas, 0, y);
    y += canvas.height;
  }
  const out = path.join(paths.full, `${v.id}.png`);
  await saveCanvas(final, out);
  console.log(out);
}

await fs.mkdir(paths.sections, { recursive: true });
await fs.mkdir(paths.full, { recursive: true });
const assets = await loadAssets();
for (const variant of variants) {
  await renderVariant(variant, assets);
}
