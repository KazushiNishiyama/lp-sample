import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceHtml = path.join(root, ".codex-scratch", "source", "musicjam.html");
const outDir = path.join(root, "assets", "musicjam");

function filenameFromUrl(url) {
  const parsed = new URL(url);
  return path.basename(parsed.pathname);
}

const html = await fs.readFile(sourceHtml, "utf8");
const imageTags = [...html.matchAll(/<img[^>]+>/gi)].map((match) => match[0]);
const records = [];

for (const tag of imageTags) {
  const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
  if (!src || !src.includes("musicjam.jp/wp-content/themes/lightning-musicjam/images/")) continue;
  const alt = tag.match(/\salt=["']([^"']*)["']/i)?.[1] ?? "";
  records.push({
    url: src.replaceAll("&amp;", "&"),
    file: filenameFromUrl(src),
    alt,
  });
}

await fs.mkdir(outDir, { recursive: true });
const seen = new Set();
const manifest = [];

for (const record of records) {
  if (seen.has(record.url)) continue;
  seen.add(record.url);
  const response = await fetch(record.url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) {
    console.warn(`skip ${record.url}: ${response.status}`);
    continue;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(path.join(outDir, record.file), bytes);
  manifest.push({ ...record, bytes: bytes.length });
  console.log(`${record.file}\t${bytes.length}`);
}

await fs.writeFile(
  path.join(outDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
