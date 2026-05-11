import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const outDir = path.join(root, "Slide", "ai-agent-2026-02-image2-text-heavy");
const sourceAsset = path.join(root, "Slide", "ai-agent-2026-02-image2", "assets", "image2-ai-agent-core.png");
const assetDir = path.join(outDir, "assets");
const assetPath = path.join(assetDir, "image2-ai-agent-core.png");

const home = process.env.HOME || process.env.USERPROFILE || process.cwd();
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

function drawTitleLine(ctx, text, x, y, maxWidth, size, color = C.ink) {
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
  ctx.font = font(options.titleSize || 32, 900);
  ctx.fillStyle = options.titleColor || C.blue;
  ctx.fillText(title, x + 28, y + 24);
  ctx.strokeStyle = "rgba(7,88,232,.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 28, y + 74);
  ctx.lineTo(x + w - 28, y + 74);
  ctx.stroke();
  drawText(ctx, body, x + 28, y + 96, w - 56, options.bodySize || 24, options.bodyColor || C.body, 800, options.lineHeight || 36);
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

function drawBullets(ctx, items, x, y, maxWidth, size = 25, gap = 42) {
  let cursor = y;
  items.forEach((item) => {
    fillRound(ctx, x, cursor + 8, 16, 16, 8, C.blue);
    cursor = drawText(ctx, item, x + 30, cursor, maxWidth - 30, size, C.body, 800, Math.round(size * 1.42));
    cursor += gap - Math.round(size * 1.42);
  });
  return cursor;
}

function drawImageWash(ctx, img, x, y, w, h, alpha = 0.12) {
  ctx.save();
  ctx.globalAlpha = alpha;
  roundRect(ctx, x, y, w, h, 22);
  ctx.clip();
  ctx.drawImage(img, 430, 0, 1250, 944, x, y, w, h);
  ctx.restore();
}

function slide01(img) {
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext("2d");
  drawBase(ctx);
  drawImageWash(ctx, img, 980, 112, 520, 330, 0.18);
  drawHeader(ctx, 1, "2026年2月、AIはエージェントになった");

  drawTitleLine(ctx, "AnthropicのOpus4.6で、AIの役割は「会話」から「実行」へ変わった", 92, 144, 1220, 48, C.ink);
  drawPanel(
    ctx,
    94,
    276,
    590,
    312,
    "これまでのAI",
    "ChatGPTに代表されるAIは、質問すれば答えてくれる、文章を書いてくれる存在だった。\n便利ではあったが、本質的には「作業を手伝うツール」に近く、人間が細かく指示し、AIはその一部を返すという関係だった。",
    { titleColor: C.ink, border: "#9dc2ff", bodySize: 24, lineHeight: 37 },
  );
  drawPanel(
    ctx,
    724,
    276,
    700,
    312,
    "Opus4.6以後のAI",
    "AIは自らリサーチし、必要な情報を集め、ファイルを編集し、コードを書き、画像を生成し、複数のツールを横断しながら一連の作業を進める。\n人間が「どう作るか」を細かく指示しなくても、「何を作りたいか」を伝えるだけで完成へ向かい始めた。",
    { fill: C.pale, bodySize: 24, lineHeight: 37 },
  );
  drawCallout(
    ctx,
    170,
    660,
    1230,
    118,
    "これは単なる性能向上ではない。「AIが人の仕事を補助する時代」から、「AIが成果物そのものを生み出す時代」への転換だ。",
  );
  return canvas;
}

function slide02(img) {
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext("2d");
  drawBase(ctx);
  drawImageWash(ctx, img, 1030, 112, 470, 320, 0.15);
  drawHeader(ctx, 2, "Image2で、クリエイティブ制作もAI化する");

  drawTitleLine(ctx, "AIの実装領域は、エンジニアリングだけではなくデザイン・マーケティングまで広がった", 92, 144, 1260, 46, C.ink);
  drawPanel(
    ctx,
    92,
    282,
    610,
    390,
    "短時間で大量に作れるもの",
    "これまで時間がかかっていた制作物も、AIによって短時間で大量に生成・改善できる時代になった。",
    { titleColor: C.ink, bodySize: 24, lineHeight: 36, border: "#9dc2ff" },
  );
  drawBullets(
    ctx,
    ["LPデザイン", "広告バナー", "商品ビジュアル", "SNSクリエイティブ", "サムネイル制作"],
    150,
    462,
    470,
    25,
    38,
  );
  drawPanel(
    ctx,
    744,
    282,
    700,
    390,
    "変わったこと",
    "Image2のような次世代画像生成AIは、単に「きれいな画像を作る」だけではない。\n仮説を出し、複数案を作り、反応を見て改善する制作サイクルそのものを高速化する。\nつまり、コードを書く力だけでなく、見せ方・売り方・伝え方までAIで実装できるようになり始めている。",
    { fill: C.pale, bodySize: 24, lineHeight: 37 },
  );
  drawCallout(
    ctx,
    170,
    744,
    1230,
    104,
    "「作れる人」の範囲が広がった。エンジニアでなくても、AIを使えば企画から見た目、販売導線まで形にできる。",
  );
  return canvas;
}

function slide03(img) {
  const canvas = new Canvas(W, H);
  const ctx = canvas.getContext("2d");
  drawBase(ctx);
  drawImageWash(ctx, img, 950, 96, 540, 360, 0.13);
  drawHeader(ctx, 3, "競争は加速し、個人や企業の戦闘力が書き換わる");

  drawTitleLine(ctx, "GPT-5.5以後、重要なのは資本や人数より「AIを使いこなせるか」になった", 92, 144, 1260, 46, C.ink);

  drawPanel(
    ctx,
    92,
    270,
    610,
    390,
    "2026年4月からの加速",
    "OpenAIがGPT-5.5をリリースし、Opusを超えるとも言われる性能を武器にAI競争はさらに加速した。\nそこからわずか3か月で、プログラミング界隈やクリエイティブ業界では異常な速度の変化が起きている。\n個人開発者がAIを使って数日でアプリを作り、毎日のように新しいサービスが生まれている。",
    { titleColor: C.ink, bodySize: 23, lineHeight: 35, border: "#9dc2ff" },
  );
  drawPanel(
    ctx,
    742,
    270,
    704,
    390,
    "何が書き換わったのか",
    "これまでなら数人のチームと数か月が必要だった開発が、今では個人1人でも実現できるようになった。\n昔なら「エンジニアがいない」「開発費がない」「時間がない」で終わっていたアイデアを、AIが実装まで持っていってくれる。\n実際、自分自身もエージェント型AIでゲームを開発し、現時点で売上は400万円を突破している。",
    { fill: C.pale, bodySize: 23, lineHeight: 35 },
  );

  fillRound(ctx, 166, 696, 420, 102, 18, C.navy);
  ctx.fillStyle = C.white;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = font(26, 900);
  ctx.fillText("個人開発の実例", 196, 714);
  ctx.fillStyle = C.blue2;
  ctx.font = font(34, 900);
  ctx.fillText("売上400万円突破", 196, 750);

  drawCallout(
    ctx,
    630,
    694,
    762,
    118,
    "これは単なるAIブームではない。あとから振り返った時、「ここが時代の分岐点だった」と言われる変化だ。",
    24,
    33,
    16,
  );
  drawText(
    ctx,
    "だからこそ、この波には乗るしかない。“個人や企業の戦闘力”そのものが書き換わる時代の始まりだ。",
    214,
    828,
    1130,
    28,
    C.ink,
    900,
    38,
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
    ctx.fillText(`TEXT HEAVY ${String(i + 1).padStart(2, "0")}`, x, 24);
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
