import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const source = resolve(directory, "og-source.html");
const output = resolve(directory, "../public/og.png");
const chrome = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

await new Promise((resolveProcess, rejectProcess) => {
  const process = spawn(
    chrome,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      `--screenshot=${output}`,
      pathToFileURL(source).href,
    ],
    { stdio: "inherit" },
  );
  process.once("error", rejectProcess);
  process.once("exit", (code) => {
    if (code === 0) resolveProcess();
    else rejectProcess(new Error(`Chrome exited with code ${code}`));
  });
});

console.log(`Generated ${output}`);
