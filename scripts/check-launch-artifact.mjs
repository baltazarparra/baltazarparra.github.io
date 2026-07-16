import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const distDirectory = resolve(process.argv[2] ?? "dist");
const failures = [];

const readRequired = async (path) => {
  try {
    return await readFile(resolve(distDirectory, path));
  } catch (error) {
    failures.push(`${path}: ${error.message}`);
    return Buffer.alloc(0);
  }
};

const expectText = (text, needle, source) => {
  if (!text.includes(needle)) {
    failures.push(`${source}: missing ${JSON.stringify(needle)}`);
  }
};

const walkSize = async (directory) => {
  let bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    bytes += entry.isDirectory() ? await walkSize(path) : (await stat(path)).size;
  }
  return bytes;
};

const index = (await readRequired("index.html")).toString("utf8");
const notFound = (await readRequired("404.html")).toString("utf8");
const robots = (await readRequired("robots.txt")).toString("utf8").trim();
const sitemap = (await readRequired("sitemap.xml")).toString("utf8").trim();
const socialImage = await readRequired("og.png");

expectText(index, '<link rel="canonical" href="https://baltz.dev/">', "index.html");
expectText(index, '<meta property="og:image" content="https://baltz.dev/og.png">', "index.html");
expectText(index, '<meta name="robots" content="index, follow">', "index.html");
expectText(index, '"@type":"WebSite"', "index.html");
expectText(index, '"@type":"Person"', "index.html");
expectText(notFound, '<link rel="canonical" href="https://baltz.dev/404.html">', "404.html");
expectText(notFound, '<meta name="robots" content="noindex, follow">', "404.html");
expectText(robots, "Sitemap: https://baltz.dev/sitemap.xml", "robots.txt");
expectText(sitemap, "<loc>https://baltz.dev/</loc>", "sitemap.xml");

const pngSignature = socialImage.subarray(0, 8).toString("hex");
const socialWidth = socialImage.length >= 24 ? socialImage.readUInt32BE(16) : 0;
const socialHeight = socialImage.length >= 24 ? socialImage.readUInt32BE(20) : 0;
if (pngSignature !== "89504e470d0a1a0a") failures.push("og.png: invalid PNG signature");
if (socialWidth !== 1200 || socialHeight !== 630) {
  failures.push(`og.png: expected 1200x630, got ${socialWidth}x${socialHeight}`);
}

for (const [source, html] of [
  ["index.html", index],
  ["404.html", notFound],
]) {
  for (const forbidden of ["localhost", "127.0.0.1", "og.jpg"]) {
    if (html.includes(forbidden)) failures.push(`${source}: contains forbidden ${forbidden}`);
  }
}

const result = {
  distDirectory,
  totalBytes: await walkSize(distDirectory),
  socialImage: { width: socialWidth, height: socialHeight },
  canonical: "https://baltz.dev/",
  failures,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
