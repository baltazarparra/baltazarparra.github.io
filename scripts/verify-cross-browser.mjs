import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const moduleUrl = process.env.PLAYWRIGHT_MODULE;
if (!moduleUrl) {
  throw new Error("PLAYWRIGHT_MODULE must point to Playwright's index.mjs");
}

const { firefox, webkit } = await import(moduleUrl);
const baseUrl = process.argv[2] ?? "http://127.0.0.1:4100/";
const outputDirectory = resolve(
  process.argv[3] ?? "../docs/evidence/p8/cross-browser",
);
await mkdir(outputDirectory, { recursive: true });

const profiles = [
  {
    name: "firefox-desktop",
    browserType: firefox,
    viewport: { width: 1440, height: 1000 },
    hasTouch: false,
    keyboard: true,
  },
  {
    name: "firefox-mobile",
    browserType: firefox,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    keyboard: false,
  },
  {
    name: "webkit-desktop",
    browserType: webkit,
    viewport: { width: 1440, height: 1000 },
    hasTouch: false,
    keyboard: true,
  },
  {
    name: "webkit-mobile",
    browserType: webkit,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    keyboard: false,
  },
];

const results = [];

for (const profile of profiles) {
  const browser = await profile.browserType.launch({ headless: true });
  const context = await browser.newContext({
    viewport: profile.viewport,
    hasTouch: profile.hasTouch,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      error: request.failure()?.errorText ?? "unknown",
    });
  });

  const response = await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(1_200);
  const initial = await page.evaluate(() => ({
    statusText: document.readyState,
    bodyTextLength: document.body.innerText.trim().length,
    h1: document.querySelector("h1")?.textContent?.trim(),
    links: document.querySelectorAll("a[href]").length,
    horizontalOverflow: Math.max(
      0,
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
    smileCanvas: document.querySelectorAll("[data-unified-canvas]").length,
    heroIndexPresent: Boolean(document.querySelector(".hero-index")),
  }));
  initial.status = response?.status();

  await page.evaluate(() => {
    document.querySelector("#caipora")?.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(700);
  const navigation = await page.evaluate(() => ({
    hash: location.hash,
    caiporaTop: Math.round(
      document.querySelector("#caipora").getBoundingClientRect().top,
    ),
    horizontalOverflow: Math.max(
      0,
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  }));
  await page.screenshot({
    path: resolve(outputDirectory, `${profile.name}-caipora.png`),
  });
  await page.waitForTimeout(500);
  const resilience = await page.evaluate(() => {
    const cover = document.querySelector(".clouds-cover");
    const image = cover?.querySelector("img");
    const fallback = cover?.querySelector(":scope > span");
    return {
      cloudsState: cover?.getAttribute("data-media-state"),
      imageOpacity: image ? getComputedStyle(image).opacity : null,
      fallbackText: fallback?.textContent?.trim() ?? null,
      fallbackVisible: fallback
        ? getComputedStyle(fallback).visibility !== "hidden" &&
          getComputedStyle(fallback).display !== "none" &&
          getComputedStyle(fallback).opacity !== "0"
        : false,
    };
  });

  const keyboard = [];
  if (profile.keyboard) {
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.tabIndex = -1;
      document.body.focus({ preventScroll: true });
    });
    for (let index = 0; index < 17; index += 1) {
      await page.keyboard.press("Tab");
      keyboard.push(
        await page.evaluate(() => {
          const node = document.activeElement;
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return {
            label:
              node.getAttribute("aria-label") ?? node.textContent?.trim() ?? "",
            visible:
              style.visibility !== "hidden" &&
              style.display !== "none" &&
              rect.width > 0 &&
              rect.height > 0,
            outlineWidth: style.outlineWidth,
          };
        }),
      );
    }
  }

  const homeConsoleErrors = [...consoleErrors];
  const homeFailedRequests = [...failedRequests];
  const missingResponse = await page.goto(new URL("/missing-p8/", baseUrl).href, {
    waitUntil: "load",
  });
  const notFound = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    robots: document.querySelector('meta[name="robots"]')?.content,
    returnLabel: document.querySelector(".not-found a")?.textContent?.trim(),
  }));
  notFound.status = missingResponse?.status();
  const notFoundConsoleErrors = consoleErrors.slice(homeConsoleErrors.length);
  const notFoundFailedRequests = failedRequests.slice(homeFailedRequests.length);

  results.push({
    profile: profile.name,
    homeConsoleErrors,
    homeFailedRequests,
    notFoundConsoleErrors,
    notFoundFailedRequests,
    initial,
    navigation,
    resilience,
    keyboard,
    notFound,
  });

  await context.close();
  await browser.close();
}

await writeFile(
  resolve(outputDirectory, "cross-browser-verification.json"),
  `${JSON.stringify(results, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(results, null, 2));
