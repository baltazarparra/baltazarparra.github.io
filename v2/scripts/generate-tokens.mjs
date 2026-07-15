import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const sourceUrl = new URL("../../docs/design-tokens.json", import.meta.url);
const outputDirectoryUrl = new URL("../src/generated/", import.meta.url);

const source = JSON.parse(await readFile(sourceUrl, "utf8"));

const unwrap = (node) => {
  if (node && typeof node === "object" && "value" in node) return node.value;
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;

  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => key !== "$schema" && key !== "meta")
      .map(([key, value]) => [key, unwrap(value)]),
  );
};

const toKebabCase = (value) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const flatten = (node, path = []) =>
  Object.entries(node).flatMap(([key, value]) => {
    const nextPath = [...path, toKebabCase(key)];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flatten(value, nextPath);
    }
    return [[nextPath.join("-"), value]];
  });

const tokens = unwrap(source);
const cssVariables = flatten(tokens)
  .map(([name, value]) => {
    const cssValue =
      typeof value === "string" && value.includes(";")
        ? JSON.stringify(value)
        : String(value);
    return `  --${name}: ${cssValue};`;
  })
  .join("\n");

const cssOutput = `/* Generated from docs/design-tokens.json. Do not edit. */\n:root {\n${cssVariables}\n}\n`;
const tsOutput = `/* Generated from docs/design-tokens.json. Do not edit. */\nexport const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n`;

await mkdir(outputDirectoryUrl, { recursive: true });
await Promise.all([
  writeFile(new URL("tokens.css", outputDirectoryUrl), cssOutput),
  writeFile(new URL("tokens.ts", outputDirectoryUrl), tsOutput),
]);

console.log(`Generated tokens from ${fileURLToPath(sourceUrl)}`);
