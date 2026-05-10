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

const DESIGN_W = 2200;
const SCALE = 2;
const W = DESIGN_W;
const ASSET_DIR = path.join(root, "assets", "musicjam");
const OUT_DIR = path.join(root, "lp-final-entertainment");
const SECTION_DIR = path.join(OUT_DIR, "sections");

const P = {
  ink: "#111321",
  navy: "#101626",
  night: "#070a14",
  white: "#ffffff",
  paper: "#fff7ef",
  cream: "#fff2d6",
  magenta: "#ff3f93",
  cyan: "#00c7f7",
  yellow: "#ffd12f",
  green: "#38d38a",
  orange: "#ff793d",
  purple: "#7652ff",
  muted: "#5e6678",
};

const imageCache = new Map();

async function image(file) {
  const full = path.join(ASSET_DIR, file);
  if (!imageCache.has(full)) imageCache.set(full, await loadImage(full));
  return imageCache.get(full);
}

function makePanel(height, fill = P.white) {
  const canvas = new Canvas(DESIGN_W * SCALE, height * SCALE);
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, W, height);
  return { canvas, ctx };
}

function font(size, weight = 700) {
  return `${weight} ${size}px "Yu Gothic", "YuGothic", "Meiryo", "Noto Sans JP", sans-serif`;
}

function text(ctx, value, x, y, opts = {}) {
  ctx.fillStyle = opts.fill ?? P.ink;
  ctx.font = font(opts.size ?? 32, opts.weight ?? 700);
  ctx.textAlign = opts.align ?? "left";
  ctx.textBaseline = opts.baseline ?? "top";
  const lineHeight = opts.lineHeight ?? Math.round((opts.size ?? 32) * 1.32);
  String(value)
    .split("\n")
    .forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
}

function wrapText(ctx, value, x, y, maxWidth, opts = {}) {
  ctx.fillStyle = opts.fill ?? P.ink;
  ctx.font = font(opts.size ?? 28, opts.weight ?? 500);
  ctx.textBaseline = "top";
  const lineHeight = opts.lineHeight ?? Math.round((opts.size ?? 28) * 1.55);
  let line = "";
  let yy = y;
  for (const char of String(value).split("")) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = char;
      yy += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) ctx.fillText(line, x, yy);
  return yy + lineHeight;
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

function cover(ctx, img, x, y, w, h, fx = 0.5, fy = 0.5) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = Math.max(0, Math.min(img.width - sw, img.width * fx - sw / 2));
  const sy = Math.max(0, Math.min(img.height - sh, img.height * fy - sh / 2));
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function contain(ctx, img, x, y, w, h) {
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawImageFrame(ctx, img, x, y, w, h, opts = {}) {
  const radius = opts.radius ?? 8;
  ctx.save();
  roundPath(ctx, x, y, w, h, radius);
  ctx.clip();
  if (opts.mode === "contain") {
    ctx.fillStyle = opts.fill ?? P.white;
    ctx.fillRect(x, y, w, h);
    contain(ctx, img, x, y, w, h);
  } else {
    cover(ctx, img, x, y, w, h, opts.fx ?? 0.5, opts.fy ?? 0.5);
  }
  ctx.restore();
  strokeRound(ctx, x, y, w, h, radius, opts.stroke ?? "rgba(255,255,255,.36)", opts.strokeWidth ?? 4);
}

function drawSlashes(ctx, fill, count, yBase, height, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fill;
  for (let i = 0; i < count; i += 1) {
    const x = -220 + i * 210;
    ctx.beginPath();
    ctx.moveTo(x, yBase + height);
    ctx.lineTo(x + 84, yBase + height);
    ctx.lineTo(x + 330, yBase);
    ctx.lineTo(x + 246, yBase);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawHalftone(ctx, x, y, cols, rows, color, step = 30) {
  ctx.fillStyle = color;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const r = 3 + ((col + row) % 4) * 1.6;
      ctx.beginPath();
      ctx.arc(x + col * step, y + row * step, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawWaveBars(ctx, x, y, w, h, colors) {
  const bars = 48;
  const gap = 7;
  const bw = (w - gap * (bars - 1)) / bars;
  for (let i = 0; i < bars; i += 1) {
    const t = i / (bars - 1);
    const barH = h * (0.24 + 0.68 * Math.abs(Math.sin(t * Math.PI * 5.2)));
    ctx.fillStyle = colors[i % colors.length];
    fillRound(ctx, x + i * (bw + gap), y + h - barH, bw, barH, 4, ctx.fillStyle);
  }
}

function drawSticker(ctx, value, x, y, w, fill, ink = P.white) {
  fillRound(ctx, x + 8, y + 8, w, 58, 8, "rgba(0,0,0,.26)");
  fillRound(ctx, x, y, w, 58, 8, fill);
  text(ctx, value, x + w / 2, y + 15, { size: 23, weight: 900, fill: ink, align: "center" });
}

function label(ctx, value, x, y, color, dark = false) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 96, 11);
  text(ctx, value, x, y + 32, { size: 22, weight: 900, fill: dark ? P.white : color });
}

function header(ctx, dark = true) {
  ctx.fillStyle = dark ? "rgba(7,10,20,.82)" : "rgba(255,255,255,.88)";
  ctx.fillRect(0, 0, W, 104);
  text(ctx, "3D & MUSIC JAM", 92, 36, { size: 30, weight: 900, fill: dark ? P.white : P.ink });
  ["作品", "できること", "安心サポート", "見学"].forEach((item, i) => {
    text(ctx, item, 1330 + i * 150, 40, {
      size: 20,
      weight: 800,
      fill: dark ? "rgba(255,255,255,.72)" : "#475467",
    });
  });
  fillRound(ctx, 1990, 25, 126, 52, 8, P.magenta);
  text(ctx, "相談する", 2016, 40, { size: 20, weight: 900, fill: P.white });
}

async function heroSection() {
  const { canvas, ctx } = makePanel(1300, P.night);
  const hero = await image("pc_area01_fv.jpg");
  cover(ctx, hero, 760, 0, 1440, 980, 0.63, 0.46);

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "rgba(7,10,20,.98)");
  grad.addColorStop(0.35, "rgba(16,22,38,.9)");
  grad.addColorStop(0.66, "rgba(16,22,38,.3)");
  grad.addColorStop(1, "rgba(7,10,20,.06)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 980);

  drawSlashes(ctx, P.magenta, 14, 915, 170, 0.96);
  drawSlashes(ctx, P.cyan, 12, 1050, 130, 0.92);
  drawHalftone(ctx, 1645, 180, 16, 14, "rgba(255,209,47,.38)", 24);
  drawWaveBars(ctx, 92, 1112, 760, 92, [P.magenta, P.cyan, P.yellow, P.green, P.orange]);

  header(ctx, true);
  label(ctx, "ENTERTAINMENT B-TYPE", 94, 190, P.cyan, true);
  text(ctx, "アニメ・音楽・イラストで\n“好き”を仕事の入口へ", 90, 290, {
    size: 86,
    lineHeight: 112,
    weight: 900,
    fill: P.white,
  });
  wrapText(
    ctx,
    "3D & MUSIC JAMは、アニメ・マンガ・ゲーム・ITに特化した次世代型エンタメ就労継続支援B型事業所。作品づくりを起点に、見学・体験・継続へつながる期待感を打ち出します。",
    96,
    565,
    770,
    { size: 32, lineHeight: 52, weight: 700, fill: "rgba(255,255,255,.82)" },
  );

  const chips = ["イラスト", "音楽制作", "動画編集", "3D", "MV", "ゲーム"];
  let chipX = 96;
  chips.forEach((chip, i) => {
    const width = [142, 164, 164, 92, 86, 118][i];
    fillRound(ctx, chipX, 760, width, 58, 8, "rgba(255,255,255,.11)");
    strokeRound(ctx, chipX, 760, width, 58, 8, "rgba(255,255,255,.26)", 2);
    text(ctx, chip, chipX + width / 2, 776, { size: 22, weight: 900, fill: P.white, align: "center" });
    chipX += width + 14;
  });

  fillRound(ctx, 96, 880, 270, 78, 8, P.magenta);
  text(ctx, "見学・相談する", 144, 903, { size: 28, weight: 900, fill: P.white });
  fillRound(ctx, 394, 880, 242, 78, 8, "rgba(255,255,255,.12)");
  strokeRound(ctx, 394, 880, 242, 78, 8, "rgba(255,255,255,.28)", 2);
  text(ctx, "作品を見る", 456, 903, { size: 28, weight: 900, fill: P.white });

  const works = [
    ["pc_area04_3.jpg", 1200, 820, 230, 230, -0.08],
    ["pc_area04_5.jpg", 1460, 770, 220, 220, 0.07],
    ["pc_area04_8.jpg", 1710, 825, 220, 220, -0.04],
    ["pc_area05_5.jpg", 1330, 1050, 280, 198, 0.04],
    ["pc_area05_8.jpg", 1640, 1080, 280, 198, -0.05],
  ];
  for (const [file, x, y, w, h, rot] of works) {
    const img = await image(file);
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rot);
    fillRound(ctx, -w / 2 - 16, -h / 2 - 16, w + 32, h + 32, 8, "rgba(255,255,255,.14)");
    drawImageFrame(ctx, img, -w / 2, -h / 2, w, h, { radius: 8, stroke: "rgba(255,255,255,.72)", strokeWidth: 6 });
    ctx.restore();
  }

  drawSticker(ctx, "利用者作品を主役に", 1168, 610, 300, P.yellow, P.ink);
  drawSticker(ctx, "音と絵が動くLP", 1496, 640, 250, P.cyan, P.ink);
  drawSticker(ctx, "派手に、でも読みやすく", 1770, 610, 304, P.magenta, P.white);
  return canvas;
}

const workFiles = [
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

async function worksSection() {
  const { canvas, ctx } = makePanel(1580, P.navy);
  const bg = ctx.createLinearGradient(0, 0, W, 1580);
  bg.addColorStop(0, "#12182b");
  bg.addColorStop(0.5, "#171022");
  bg.addColorStop(1, "#101626");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, 1580);
  drawSlashes(ctx, "rgba(0,199,247,.34)", 16, 50, 220, 1);
  drawSlashes(ctx, "rgba(255,63,147,.32)", 16, 1250, 210, 1);
  drawHalftone(ctx, 1600, 125, 20, 10, "rgba(56,211,138,.34)", 26);

  label(ctx, "WORKS FIRST", 96, 105, P.yellow, true);
  text(ctx, "利用者の作品を、LPの主役に。", 96, 196, { size: 72, weight: 900, fill: P.white });
  wrapText(
    ctx,
    "既存LPの素材に入っているイラスト・音楽まわりの写真をできるだけ多く使い、事業所の楽しさと制作感が最初に伝わる構成へ。サムネイルは無理に拡大せず、コラージュで量と熱量を見せます。",
    100,
    305,
    1320,
    { size: 30, lineHeight: 48, weight: 700, fill: "rgba(255,255,255,.76)" },
  );
  fillRound(ctx, 1600, 205, 390, 94, 8, P.magenta);
  text(ctx, "17 works\nfrom assets", 1795, 219, {
    size: 31,
    lineHeight: 36,
    weight: 900,
    fill: P.white,
    align: "center",
  });

  const sizes = [
    [360, 360],
    [250, 250],
    [250, 250],
    [250, 250],
    [250, 250],
    [360, 253],
    [360, 253],
    [360, 253],
    [250, 250],
    [250, 250],
    [250, 250],
    [250, 250],
    [360, 253],
    [360, 253],
    [360, 253],
    [250, 250],
    [250, 250],
  ];
  const coords = [
    [96, 502],
    [490, 502],
    [770, 502],
    [1050, 502],
    [1330, 502],
    [1610, 502],
    [490, 812],
    [880, 812],
    [1270, 812],
    [1550, 812],
    [1830, 812],
    [96, 902],
    [490, 1115],
    [880, 1115],
    [1270, 1115],
    [1660, 1115],
    [1940, 1115],
  ];
  for (let i = 0; i < workFiles.length; i += 1) {
    const img = await image(workFiles[i]);
    const [x, y] = coords[i];
    const [w, h] = sizes[i];
    fillRound(ctx, x - 12, y - 12, w + 24, h + 24, 8, ["rgba(255,63,147,.44)", "rgba(0,199,247,.38)", "rgba(255,209,47,.44)", "rgba(56,211,138,.34)"][i % 4]);
    drawImageFrame(ctx, img, x, y, w, h, { radius: 8, stroke: "rgba(255,255,255,.72)", strokeWidth: 5 });
  }

  const legends = [
    ["ILLUSTRATION", P.magenta],
    ["MUSIC / STUDIO", P.cyan],
    ["MOVIE / MV", P.yellow],
    ["PORTFOLIO", P.green],
  ];
  legends.forEach(([name, color], i) => {
    fillRound(ctx, 96 + i * 300, 1440, 246, 56, 8, "rgba(255,255,255,.08)");
    ctx.fillStyle = color;
    ctx.fillRect(116 + i * 300, 1459, 48, 8);
    text(ctx, name, 184 + i * 300, 1450, { size: 21, weight: 900, fill: P.white });
  });
  return canvas;
}

async function programsSection() {
  const { canvas, ctx } = makePanel(1280, P.paper);
  drawSlashes(ctx, "rgba(255,63,147,.16)", 15, 0, 180, 1);
  drawHalftone(ctx, 1640, 100, 18, 12, "rgba(0,199,247,.28)", 26);
  label(ctx, "CREATIVE MENU", 96, 96, P.magenta);
  text(ctx, "イラストも、音楽も、動画も。\n“作れること”を大きく見せる。", 96, 187, {
    size: 67,
    lineHeight: 88,
    weight: 900,
  });
  wrapText(
    ctx,
    "単なる支援サービスではなく、作品が生まれるエンタメ事業所として見せます。制作ジャンルを先に見せることで、見学前の期待値を上げます。",
    101,
    390,
    1180,
    { size: 29, lineHeight: 47, weight: 700, fill: "#374151" },
  );

  const cards = [
    ["イラスト", "キャラクター・世界観づくりを作品にする", "pc_area03_p1_img.png", P.magenta],
    ["音楽 / MV", "音と絵を組み合わせ、発信できる形へ", "pc_area05_img1.jpg", P.cyan],
    ["動画編集", "サムネイルや短尺動画など見せ方を磨く", "pc_area05_img2.jpg", P.yellow],
    ["3D / IT", "ゲーム・Vtuber・Web表現にも広げる", "pc_area02_1_img.jpg", P.green],
  ];

  for (let i = 0; i < cards.length; i += 1) {
    const [head, body, file, color] = cards[i];
    const x = 96 + i * 510;
    const y = 625;
    fillRound(ctx, x, y, 452, 470, 8, P.white);
    strokeRound(ctx, x, y, 452, 470, 8, "rgba(17,19,33,.14)", 2);
    const img = await image(file);
    drawImageFrame(ctx, img, x + 24, y + 24, 404, 252, { radius: 8, stroke: "rgba(17,19,33,.12)", strokeWidth: 2 });
    ctx.fillStyle = color;
    ctx.fillRect(x + 24, y + 315, 92, 9);
    text(ctx, head, x + 24, y + 350, { size: 38, weight: 900, fill: P.ink });
    wrapText(ctx, body, x + 27, y + 406, 378, { size: 24, lineHeight: 36, weight: 700, fill: P.muted });
  }

  fillRound(ctx, 96, 1145, 2008, 74, 8, P.navy);
  text(ctx, "見せ方の軸: “楽しい”だけで終わらせず、作品づくり・継続・相談導線まで1本につなげる。", 142, 1164, {
    size: 30,
    weight: 900,
    fill: P.white,
  });
  return canvas;
}

async function supportSection() {
  const { canvas, ctx } = makePanel(1220, P.white);
  label(ctx, "BEGINNER & SUPPORT", 96, 95, P.green);
  text(ctx, "未経験からでも、\n派手に始めて、着実に続ける。", 96, 186, {
    size: 66,
    lineHeight: 86,
    weight: 900,
  });
  wrapText(
    ctx,
    "エンタメ感を前面に出しながら、不安を減らす支援の見え方も残します。本人・家族・支援者が安心して問い合わせできるLPにします。",
    102,
    380,
    1060,
    { size: 29, lineHeight: 47, weight: 700, fill: "#374151" },
  );

  const staff = await image("pc_area10_img.jpg");
  drawImageFrame(ctx, staff, 1370, 115, 470, 560, { radius: 8, stroke: "rgba(17,19,33,.14)", strokeWidth: 3, fy: 0.38 });
  fillRound(ctx, 1265, 600, 690, 150, 8, P.navy);
  text(ctx, "見学前の不安を、先にほどく。", 1315, 633, { size: 37, weight: 900, fill: P.white });
  wrapText(ctx, "作業内容・雰囲気・通い方を、スタッフと確認しながら決められる導線にします。", 1318, 688, 560, {
    size: 23,
    lineHeight: 34,
    weight: 700,
    fill: "rgba(255,255,255,.76)",
  });

  const points = [
    ["01", "まずは見学だけでOK", "作業内容と雰囲気を見てから相談できる", "pc_area07_icon_1.png", P.magenta],
    ["02", "好きな入口から始める", "絵・音楽・動画など興味に近い制作へ", "pc_area07_icon_2.png", P.cyan],
    ["03", "スタッフが伴走", "ペースに合わせて小さく制作を進める", "pc_area07_icon_3.png", P.yellow],
    ["04", "作品として残す", "発表・ポートフォリオ化まで見据える", "pc_area07_icon_4.png", P.green],
  ];
  for (let i = 0; i < points.length; i += 1) {
    const [no, head, body, iconFile, color] = points[i];
    const x = 96 + (i % 2) * 595;
    const y = 595 + Math.floor(i / 2) * 255;
    fillRound(ctx, x, y, 540, 190, 8, P.paper);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 12, 190);
    const icon = await image(iconFile);
    contain(ctx, icon, x + 38, y + 38, 86, 86);
    text(ctx, no, x + 152, y + 34, { size: 27, weight: 900, fill: color });
    text(ctx, head, x + 152, y + 73, { size: 32, weight: 900, fill: P.ink });
    wrapText(ctx, body, x + 154, y + 124, 340, { size: 22, lineHeight: 32, weight: 700, fill: P.muted });
  }

  const qaImages = ["pc_area08_QA1.png", "pc_area08_QA2.png", "pc_area08_QA3.png"];
  for (let i = 0; i < qaImages.length; i += 1) {
    const img = await image(qaImages[i]);
    drawImageFrame(ctx, img, 1290 + i * 250, 825, 220, 138, {
      radius: 8,
      mode: "contain",
      fill: P.white,
      stroke: "rgba(17,19,33,.16)",
      strokeWidth: 2,
    });
  }
  text(ctx, "よくある不安もLP内で先回り", 1290, 998, { size: 31, weight: 900, fill: P.ink });
  wrapText(ctx, "コミュニケーション、作業内容、通所日数などの疑問に答える構成を後半に配置。", 1292, 1048, 650, {
    size: 23,
    lineHeight: 35,
    weight: 700,
    fill: P.muted,
  });
  return canvas;
}

async function flowFaqSection() {
  const { canvas, ctx } = makePanel(1280, P.navy);
  const bg = ctx.createLinearGradient(0, 0, W, 1280);
  bg.addColorStop(0, "#0e1425");
  bg.addColorStop(0.58, "#19152f");
  bg.addColorStop(1, "#09101c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, 1280);
  drawSlashes(ctx, "rgba(255,209,47,.24)", 16, 72, 160, 1);
  drawSlashes(ctx, "rgba(255,63,147,.28)", 16, 1070, 170, 1);

  label(ctx, "VISIT FLOW", 96, 96, P.cyan, true);
  text(ctx, "見学から制作まで、\n迷わず進める導線に。", 96, 188, {
    size: 68,
    lineHeight: 88,
    weight: 900,
    fill: P.white,
  });
  wrapText(
    ctx,
    "LPの後半は問い合わせ前の心理的ハードルを下げるため、体験の流れとFAQを短く明快に配置します。",
    102,
    390,
    1050,
    { size: 29, lineHeight: 46, weight: 700, fill: "rgba(255,255,255,.76)" },
  );

  const flow = [
    ["見学", "雰囲気を見る"],
    ["相談", "好きな制作を話す"],
    ["体験", "少し作ってみる"],
    ["継続", "作品として育てる"],
  ];
  flow.forEach(([head, body], i) => {
    const x = 105 + i * 500;
    fillRound(ctx, x, 590, 390, 178, 8, "rgba(255,255,255,.09)");
    strokeRound(ctx, x, 590, 390, 178, 8, "rgba(255,255,255,.18)", 2);
    text(ctx, String(i + 1).padStart(2, "0"), x + 38, 632, {
      size: 40,
      weight: 900,
      fill: [P.magenta, P.cyan, P.yellow, P.green][i],
    });
    text(ctx, head, x + 132, 628, { size: 44, weight: 900, fill: P.white });
    text(ctx, body, x + 134, 695, { size: 24, weight: 700, fill: "rgba(255,255,255,.68)" });
    if (i < flow.length - 1) {
      ctx.fillStyle = "rgba(255,255,255,.34)";
      ctx.fillRect(x + 412, 677, 56, 4);
    }
  });

  const faq = [
    ["Q. 自分に合う作業があるか不安です。", "A. 見学で制作内容と雰囲気を確認してから相談できます。"],
    ["Q. コミュニケーションが苦手でも大丈夫ですか？", "A. 一人で過ごす時間も含め、無理のない関わり方を相談できます。"],
    ["Q. 未経験でも始められますか？", "A. 絵・音楽・動画など、興味のある入口から少しずつ進めます。"],
  ];
  for (let i = 0; i < faq.length; i += 1) {
    const y = 900 + i * 108;
    fillRound(ctx, 96, y, 2008, 78, 8, i % 2 ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.11)");
    text(ctx, faq[i][0], 132, y + 21, { size: 26, weight: 900, fill: P.white });
    text(ctx, faq[i][1], 900, y + 24, { size: 24, weight: 700, fill: "rgba(255,255,255,.74)" });
  }
  return canvas;
}

async function ctaSection() {
  const { canvas, ctx } = makePanel(760, P.night);
  drawWaveBars(ctx, 1290, 110, 720, 130, [P.magenta, P.cyan, P.yellow, P.green, P.orange]);
  drawHalftone(ctx, 1500, 420, 22, 8, "rgba(255,63,147,.3)", 27);
  text(ctx, "まずは見学で、\n好きが動き出す場所を見てください。", 96, 90, {
    size: 66,
    lineHeight: 86,
    weight: 900,
    fill: P.white,
  });
  wrapText(
    ctx,
    "作品づくりに興味がある方、通い方に不安がある方、家族・支援者からの相談も受けやすいように、CTAはシンプルに強く配置します。",
    100,
    300,
    1100,
    { size: 29, lineHeight: 46, weight: 700, fill: "rgba(255,255,255,.76)" },
  );
  fillRound(ctx, 100, 470, 302, 82, 8, P.magenta);
  text(ctx, "見学・相談する", 152, 494, { size: 29, weight: 900, fill: P.white });
  fillRound(ctx, 432, 470, 282, 82, 8, "rgba(255,255,255,.12)");
  strokeRound(ctx, 432, 470, 282, 82, 8, "rgba(255,255,255,.25)", 2);
  text(ctx, "03-6264-8883", 474, 495, { size: 29, weight: 900, fill: P.white });

  const strip = ["pc_area04_1.jpg", "pc_area04_3.jpg", "pc_area04_5.jpg", "pc_area04_8.jpg", "pc_area05_5.jpg", "pc_area05_8.jpg"];
  for (let i = 0; i < strip.length; i += 1) {
    const img = await image(strip[i]);
    drawImageFrame(ctx, img, 1300 + i * 136, 332 + (i % 2) * 42, 118, 118, {
      radius: 8,
      stroke: "rgba(255,255,255,.62)",
      strokeWidth: 4,
    });
  }
  text(ctx, "3D & MUSIC JAM", 1300, 610, { size: 34, weight: 900, fill: P.white });
  text(ctx, "Entertainment Creative Support", 1302, 655, {
    size: 22,
    weight: 800,
    fill: "rgba(255,255,255,.62)",
  });
  return canvas;
}

async function save(canvas, file) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await canvas.toFile(file);
}

const sections = [
  ["01-hero.png", await heroSection()],
  ["02-works-gallery.png", await worksSection()],
  ["03-creative-menu.png", await programsSection()],
  ["04-beginner-support.png", await supportSection()],
  ["05-visit-flow-faq.png", await flowFaqSection()],
  ["06-cta.png", await ctaSection()],
];

await fs.mkdir(SECTION_DIR, { recursive: true });
for (const [name, canvas] of sections) {
  await save(canvas, path.join(SECTION_DIR, name));
}

const totalHeight = sections.reduce((sum, [, canvas]) => sum + canvas.height, 0);
const full = new Canvas(DESIGN_W * SCALE, totalHeight);
const ctx = full.getContext("2d");
let y = 0;
for (const [, canvas] of sections) {
  ctx.drawImage(canvas, 0, y);
  y += canvas.height;
}

const fullPath = path.join(OUT_DIR, "musicjam-entertainment-redesign.png");
await save(full, fullPath);

console.log(`sections: ${SECTION_DIR}`);
console.log(`full: ${fullPath}`);
