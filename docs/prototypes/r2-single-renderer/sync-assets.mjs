import { copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));

await Promise.all([
  copyFile(
    resolve(directory, "../r1-smile-lite/smile-lite.bin"),
    resolve(directory, "smile-lite.bin"),
  ),
  copyFile(
    resolve(directory, "../../../v2/public/baltz-portrait.jpg"),
    resolve(directory, "portrait.jpg"),
  ),
]);

console.log("R2 assets synchronized.");
