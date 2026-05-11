import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, "Slide", "ai-business-workflow-image2");
const assetDir = path.join(outDir, "assets");
const assetPath = path.join(assetDir, "image2-business-workflow.png");
const home = process.env.HOME || process.env.USERPROFILE || process.cwd();
const sourceAsset = path.join(
  home,
  ".codex",
  "generated_images",
  "019e14c3-572e-7442-9c67-cd9a1396691f",
  "ig_0b5ae21bb53b8910016a014454d1c08191a2b70f8d2ed8c743.png",
);

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

const W = 1680;
const H = 944;
const FONT = `"BIZ UDPGothic", "Yu Gothic", "Meiryo", sans-serif`;

const C = {
  ink: "#061126",
  body: "#182234",
  muted: "#4b5568",
  blue: "#0758e8",
  blue2: "#0b73ff",
  navy: "#031238",
  pale: "#f3f8ff",
  paleBlue: "#e7f1ff",
  line: "#8ab7ff",
  white: "#ffffff",
};

function font(size, weight = 900) {
  return `${weight} ${size}px ${FONT}`;
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
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function strokeRound(ctx, x, y, w, h, r, stroke, width = 3) {
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  for (const raw of String(text).split("\n")) {
    if (!raw) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const ch of [...raw]) {
      const next = line + ch;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = ch;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function drawText(ctx, text, x, y, maxWidth, size, color = C.body, weight = 800, lineHeight = Math.round(size * 1.45)) {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = font(size, weight);
  ctx.fillStyle = color;
  const lines = wrapLines(ctx, text, maxWidth);
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function drawTitle(ctx, text, x, y, maxWidth, size = 54, color = C.ink) {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = font(size, 900);
  ctx.fillStyle = color;
  const lines = wrapLines(ctx, text, maxWidth);
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * Math.round(size * 1.08)));
  return y + lines.length * Math.round(size * 1.08);
}

function drawBase(ctx) {
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.34;
  ctx.fillStyle = "#b9d2ff";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(285, 0);
  ctx.lineTo(0, 330);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#7ba8ff";
  ctx.beginPath();
  ctx.moveTo(95, 0);
  ctx.lineTo(215, 0);
  ctx.lineTo(0, 240);
  ctx.lineTo(0, 145);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 10; col += 1) {
      const a = 0.13 + (row + col) * 0.018;
      ctx.fillStyle = `rgba(7, 88, 232, ${Math.min(0.62, a)})`;
      ctx.beginPath();
      ctx.arc(W - 250 + col * 22, 54 + row * 22, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(7,88,232,.22)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const y = H - 92 + i * 18;
    ctx.beginPath();
    ctx.moveTo(42, y);
    ctx.lineTo(120 + i * 28, y);
    ctx.lineTo(150 + i * 28, y + 18);
    ctx.stroke();
    ctx.fillStyle = "rgba(7,88,232,.25)";
    ctx.beginPath();
    ctx.arc(154 + i * 28, y + 18, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = C.navy;
  ctx.beginPath();
  ctx.moveTo(W - 265, H - 26);
  ctx.lineTo(W - 26, H - 26);
  ctx.lineTo(W - 26, H - 430);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = C.blue;
  ctx.beginPath();
  ctx.moveTo(W - 305, H - 26);
  ctx.lineTo(W - 170, H - 26);
  ctx.lineTo(W - 130, H - 82);
  ctx.lineTo(W - 265, H - 82);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(W - 195 + i * 26, H - 60);
    ctx.lineTo(W - 178 + i * 26, H - 82);
    ctx.stroke();
  }
  ctx.strokeStyle = C.blue;
  ctx.lineWidth = 8;
  for (let i = 0; i < 3; i += 1) {
    const x = W - 130 + i * 42;
    const y = H - 83;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 21, y + 21);
    ctx.lineTo(x, y + 42);
    ctx.stroke();
  }
  ctx.restore();

  strokeRound(ctx, 22, 22, W - 44, H - 44, 22, C.blue, 4);
}

function drawHeader(ctx, n, label) {
  fillRound(ctx, 86, 58, 52, 52, 10, C.blue);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font(32, 900);
  ctx.fillStyle = C.white;
  ctx.fillText(String(n), 112, 85);
  ctx.textAlign = "left";
  ctx.fillStyle = C.blue;
  ctx.font = font(31, 900);
  ctx.fillText(label, 160, 84);
}

function drawPanel(ctx, x, y, w, h, title, body, options = {}) {
  fillRound(ctx, x, y, w, h, 18, options.fill || C.white);
  strokeRound(ctx, x, y, w, h, 18, options.border || C.blue, options.borderWidth || 3);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = font(options.titleSize || 31, 900);
  ctx.fillStyle = options.titleColor || C.blue;
  ctx.fillText(title, x + 28, y + 24);
  ctx.strokeStyle = "rgba(7,88,232,.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 28, y + 72);
  ctx.lineTo(x + w - 28, y + 72);
  ctx.stroke();
  drawText(ctx, body, x + 28, y + 94, w - 56, options.bodySize || 23, options.bodyColor || C.body, 800, options.lineHeight || 34);
}

function drawCallout(ctx, x, y, w, h, text, size = 28, lineHeight = 38, textTop = 22) {
  fillRound(ctx, x, y, w, h, 42, C.white);
  strokeRound(ctx, x, y, w, h, 42, C.blue, 3);
  fillRound(ctx, x + 32, y + (h - 56) / 2, 56, 56, 28, C.blue);
  ctx.fillStyle = C.white;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font(31, 900);
  ctx.fillText("!", x + 60, y + h / 2 + 1);
  drawText(ctx, text, x + 112, y + textTop, w - 150, size, C.ink, 900, lineHeight);
}

function drawImagePanel(ctx, img, x, y, w, h, alpha = 0.95) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 24);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
  ctx.restore();
  strokeRound(ctx, x, y, w, h, 24, "#8ab7ff", 2.5);
}

function drawImageWash(ctx, img, x, y, w, h, alpha = 0.12) {
  ctx.save();
  ctx.globalAlpha = alpha;
  roundRect(ctx, x, y, w, h, 24);
  ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
  ctx.restore();
}

function drawChip(ctx, x, y, text, fill = C.blue, color = C.white) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font(24, 900);
  const w = Math.ceil(ctx.measureText(text).width + 42);
  fillRound(ctx, x, y, w, 46, 23, fill);
  ctx.fillStyle = color;
  ctx.fillText(text, x + w / 2, y + 24);
  return w;
}

function drawBullets(ctx, items, x, y, maxWidth, size = 24, gap = 39) {
  let cursor = y;
  items.forEach((item) => {
    fillRound(ctx, x, cursor + 8, 15, 15, 8, C.blue);
    cursor = drawText(ctx, item, x + 30, cursor, maxWidth - 30, size, C.body, 800, Math.round(size * 1.38));
    cursor += gap - Math.round(size * 1.38);
  });
  return cursor;
}

function drawProcessStep(ctx, x, y, num, title, body) {
  fillRound(ctx, x, y, 212, 126, 16, C.white);
  strokeRound(ctx, x, y, 212, 126, 16, C.blue, 2.5);
  fillRound(ctx, x + 18, y + 18, 42, 42, 21, C.blue);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font(23, 900);
  ctx.fillStyle = C.white;
  ctx.fillText(String(num), x + 39, y + 40);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = font(25, 900);
  ctx.fillStyle = C.ink;
  ctx.fillText(title, x + 72, y + 20);
  drawText(ctx, body, x + 22, y + 68, 168, 19, C.muted, 800, 26);
}

function drawArrow(ctx, x1, y, x2) {
  ctx.save();
  ctx.strokeStyle = C.blue;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - 18, y - 14);
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - 18, y + 14);
  ctx.stroke();
  ctx.restore();
}

function slide01(img) {
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext("2d");
  drawBase(ctx);
  drawHeader(ctx, 1, "AIで実務の進め方が変わり始めている");
  drawImagePanel(ctx, img, 930, 142, 570, 320, 0.96);

  drawTitle(ctx, "AIによって、実務そのものの進め方が変わり始めている", 92, 146, 780, 58, C.ink);
  drawText(
    ctx,
    "これまでLP制作には、企画、ライティング、デザイン、コーディング、画像制作など、多くの工程と人手が必要だった。制作会社とのやり取りを重ね、完成まで数週間から数か月かかることも珍しくなかった。",
    96,
    310,
    780,
    27,
    C.body,
    800,
    40,
  );

  drawPanel(
    ctx,
    122,
    528,
    602,
    204,
    "これまで",
    "人が工程を分担し、打ち合わせと確認を重ねながら制作を進める。進行は遅く、試せる案の数も限られていた。",
    { titleColor: C.ink, border: "#9dc2ff", bodySize: 23, lineHeight: 34 },
  );
  drawPanel(
    ctx,
    768,
    528,
    650,
    204,
    "これから",
    "エージェント型AIとImage2が、リサーチ、構成、文章、デザイン、画像、実装までを一気通貫で支援する。",
    { fill: C.pale, bodySize: 23, lineHeight: 34 },
  );
  drawCallout(ctx, 200, 790, 1160, 82, "変わっているのは、ツールの便利さではなく“制作工程そのもの”だ。", 28, 38, 21);
  return canvas;
}

function slide02(img) {
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext("2d");
  drawBase(ctx);
  drawImageWash(ctx, img, 1040, 122, 480, 310, 0.12);
  drawHeader(ctx, 2, "LP制作は、工程ごとAIに圧縮される");
  drawTitle(ctx, "「どんなLPを作りたいか」だけで、完成まで進み始める", 92, 146, 1180, 55, C.ink);

  drawPanel(
    ctx,
    92,
    264,
    1400,
    176,
    "AIが担い始めている流れ",
    "人間が細かく「どう作るか」を指定しなくても、目的・商品・ターゲットを伝えるだけで、AIが競合を調べ、構成を考え、文章を書き、デザインを生成し、画像を制作し、実装まで進める。",
    { fill: C.pale, bodySize: 26, lineHeight: 39 },
  );

  const y = 500;
  drawProcessStep(ctx, 110, y, 1, "調べる", "競合・市場\n訴求の整理");
  drawArrow(ctx, 334, y + 63, 382);
  drawProcessStep(ctx, 398, y, 2, "組む", "構成・導線\nページ設計");
  drawArrow(ctx, 622, y + 63, 670);
  drawProcessStep(ctx, 686, y, 3, "書く", "見出し・本文\nCTA文言");
  drawArrow(ctx, 910, y + 63, 958);
  drawProcessStep(ctx, 974, y, 4, "作る", "画像・デザイン\n素材生成");
  drawArrow(ctx, 1198, y + 63, 1246);
  drawProcessStep(ctx, 1262, y, 5, "実装", "HTML/CSS\n公開準備");

  drawCallout(
    ctx,
    174,
    738,
    1220,
    104,
    "LP制作は、外注先に渡す“依頼作業”から、社内で高速に試せる“実行サイクル”へ変わり始めている。",
    28,
    38,
    18,
  );
  return canvas;
}

function slide03(img) {
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext("2d");
  drawBase(ctx);
  drawImageWash(ctx, img, 980, 118, 520, 330, 0.13);
  drawHeader(ctx, 3, "企業の動き方そのものが変わる");
  drawTitle(ctx, "変わっているのは開発だけではない。マーケティングも社内業務も高速化する", 92, 146, 1220, 48, C.ink);

  drawPanel(
    ctx,
    92,
    286,
    440,
    360,
    "LP・制作",
    "企画、ライティング、デザイン、コーディング、画像制作の流れをAIが横断し、制作工程が圧縮される。\n短い期間で複数案を試せる。",
    { titleColor: C.ink, border: "#9dc2ff", bodySize: 23, lineHeight: 35 },
  );
  drawPanel(
    ctx,
    578,
    286,
    440,
    360,
    "マーケティング",
    "競合分析、広告文作成、SNS投稿、クリエイティブ生成、ABテスト素材制作が高速化する。\n時間や人手不足で回せなかった施策まで実行できる。",
    { fill: C.pale, bodySize: 23, lineHeight: 35 },
  );
  drawPanel(
    ctx,
    1064,
    286,
    440,
    360,
    "社内業務",
    "営業資料作成、データ整理、マニュアル整備、レポート作成など、日々の定型業務をAIが補助・自動化する。\n現場の実行速度が上がる。",
    { titleColor: C.ink, border: "#9dc2ff", bodySize: 23, lineHeight: 35 },
  );

  fillRound(ctx, 182, 700, 420, 96, 20, C.navy);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = font(27, 900);
  ctx.fillStyle = C.white;
  ctx.fillText("これまで", 214, 718);
  ctx.font = font(32, 900);
  ctx.fillText("人が作業をこなす会社", 214, 752);
  drawArrow(ctx, 636, 748, 726);
  fillRound(ctx, 768, 700, 520, 96, 20, C.blue);
  ctx.font = font(27, 900);
  ctx.fillStyle = C.white;
  ctx.fillText("これから", 800, 718);
  ctx.font = font(32, 900);
  ctx.fillText("AIで高速に実行できる会社", 800, 752);

  drawText(
    ctx,
    "これは単なる業務効率化ではない。企業そのものの動き方が変わる時代が始まっている。",
    214,
    830,
    1120,
    30,
    C.ink,
    900,
    40,
  );
  return canvas;
}

async function save(canvas, filename) {
  await canvas.toFile(path.join(outDir, filename));
}

async function makeContactSheet() {
  const names = ["slide-01.png", "slide-02.png", "slide-03.png"];
  const imgs = [];
  for (const name of names) imgs.push(await loadImage(path.join(outDir, name)));
  const cw = 1680;
  const ch = 392;
  const canvas = new Canvas(cw, ch);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f3f7ff";
  ctx.fillRect(0, 0, cw, ch);
  const tw = 510;
  const th = Math.round((tw / W) * H);
  imgs.forEach((img, i) => {
    const x = 42 + i * 546;
    const y = 64;
    fillRound(ctx, x - 8, y - 8, tw + 16, th + 16, 14, "#ffffff");
    strokeRound(ctx, x - 8, y - 8, tw + 16, th + 16, 14, "#b6d0ff", 2);
    ctx.drawImage(img, x, y, tw, th);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = font(22, 900);
    ctx.fillStyle = C.blue;
    ctx.fillText(`WORKFLOW ${String(i + 1).padStart(2, "0")}`, x, 24);
  });
  await canvas.toFile(path.join(outDir, "contact-sheet.png"));
}

await fs.mkdir(assetDir, { recursive: true });
await fs.copyFile(sourceAsset, assetPath);
const img = await loadImage(assetPath);
await save(slide01(img), "slide-01.png");
await save(slide02(img), "slide-02.png");
await save(slide03(img), "slide-03.png");
await makeContactSheet();

console.log(JSON.stringify({ outDir, slides: ["slide-01.png", "slide-02.png", "slide-03.png"] }, null, 2));
