import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4100/";
const outputDirectory = resolve(process.argv[3] ?? "../docs/evidence/p5");
const profileFilter = process.argv[4];
const chromeExecutable = "/usr/bin/google-chrome";
const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

await mkdir(outputDirectory, { recursive: true });

class CDPClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      if (message.method) {
        for (const listener of this.listeners.get(message.method) ?? []) {
          listener(message.params);
        }
      }
    });

    await new Promise((resolveConnection, reject) => {
      this.socket.addEventListener("open", resolveConnection, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    return this;
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolveCall, reject) => {
      this.pending.set(id, { resolve: resolveCall, reject });
    });
  }

  on(method, listener) {
    this.listeners.set(method, [
      ...(this.listeners.get(method) ?? []),
      listener,
    ]);
  }

  waitFor(method) {
    return new Promise((resolveEvent) => {
      const listener = (params) => {
        this.listeners.set(
          method,
          (this.listeners.get(method) ?? []).filter(
            (candidate) => candidate !== listener,
          ),
        );
        resolveEvent(params);
      };
      this.on(method, listener);
    });
  }

  close() {
    this.socket?.close();
  }
}

const evaluate = async (client, expression) => {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const userDataDirectory = await mkdtemp(join("/tmp", "baltz-browser-cdp-"));
const chrome = spawn(
  chromeExecutable,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--enable-unsafe-swiftshader",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDirectory}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

const browserWebSocketUrl = await new Promise((resolveUrl, reject) => {
  let output = "";
  const timeout = setTimeout(
    () => reject(new Error("Chrome DevTools endpoint timed out")),
    15000,
  );
  chrome.stderr.on("data", (chunk) => {
    output += chunk.toString();
    const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match?.[1]) {
      clearTimeout(timeout);
      resolveUrl(match[1]);
    }
  });
});

const browser = await new CDPClient(browserWebSocketUrl).connect();
const httpOrigin = browserWebSocketUrl
  .replace("ws://", "http://")
  .replace(/\/devtools\/browser\/.+$/, "");

const createPage = async () => {
  const response = await fetch(
    `${httpOrigin}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  );
  const target = await response.json();
  return {
    client: await new CDPClient(target.webSocketDebuggerUrl).connect(),
    targetId: target.id,
  };
};

const profiles = [
  {
    name: "desktop",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reducedMotion: false,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
    mobile: true,
    touch: true,
    reducedMotion: false,
  },
  {
    name: "narrow-320",
    width: 320,
    height: 800,
    mobile: true,
    touch: true,
    reducedMotion: false,
  },
  {
    name: "zoom-200",
    width: 720,
    height: 500,
    mobile: false,
    touch: false,
    reducedMotion: false,
  },
  {
    name: "zoom-400",
    width: 360,
    height: 250,
    mobile: false,
    touch: false,
    reducedMotion: false,
    keyboard: true,
  },
  {
    name: "reduced",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reducedMotion: true,
    disableJavaScript: false,
  },
  {
    name: "no-js",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reducedMotion: false,
    disableJavaScript: true,
  },
];
const activeProfiles = profileFilter
  ? profiles.filter((profile) => profile.name === profileFilter)
  : profiles;

const results = [];
let notFound;
let assetFailure;

try {
  for (const profile of activeProfiles) {
    const { client, targetId } = await createPage();
    const consoleErrors = [];
    const failedRequests = [];

    client.on("Runtime.exceptionThrown", (event) => {
      consoleErrors.push(event.exceptionDetails?.text ?? "Runtime exception");
    });
    client.on("Runtime.consoleAPICalled", (event) => {
      if (event.type === "error") {
        consoleErrors.push(
          event.args
            .map((argument) => argument.value ?? argument.description)
            .join(" "),
        );
      }
    });
    client.on("Network.loadingFailed", (event) => {
      failedRequests.push({
        errorText: event.errorText,
        requestId: event.requestId,
      });
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Accessibility.enable");
    await client.send("Network.setCacheDisabled", { cacheDisabled: true });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: profile.width,
      height: profile.height,
      deviceScaleFactor: profile.mobile ? 2 : 1,
      mobile: profile.mobile,
      screenWidth: profile.width,
      screenHeight: profile.height,
    });
    await client.send("Emulation.setTouchEmulationEnabled", {
      enabled: profile.touch,
      maxTouchPoints: profile.touch ? 5 : 1,
    });
    await client.send("Emulation.setEmulatedMedia", {
      media: "screen",
      features: [
        {
          name: "prefers-reduced-motion",
          value: profile.reducedMotion ? "reduce" : "no-preference",
        },
        {
          name: "hover",
          value: profile.touch ? "none" : "hover",
        },
        {
          name: "pointer",
          value: profile.touch ? "coarse" : "fine",
        },
      ],
    });
    await client.send("Emulation.setScriptExecutionDisabled", {
      value: profile.disableJavaScript ?? false,
    });

    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", { url: baseUrl });
    await loaded;
    await delay(2500);

    const initial = await evaluate(
      client,
      `(() => ({
        bodyTextLength: document.body.innerText.trim().length,
        h1: document.querySelector("h1")?.textContent?.trim(),
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        heroIndexPresent: Boolean(document.querySelector(".hero-index")),
        heroEmployerDisplay: getComputedStyle(document.querySelector(".hero-meta a")).display,
        overlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
        smileCanvas: document.querySelectorAll("[data-unified-canvas]").length,
        pageHeight: document.documentElement.scrollHeight,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        headings: [...document.querySelectorAll("h1, h2, h3")].map((node) => ({
          level: Number(node.tagName.slice(1)),
          text: node.textContent.trim()
        })),
        landmarks: {
          main: document.querySelectorAll("main").length,
          header: document.querySelectorAll("header").length,
          nav: document.querySelectorAll("nav").length,
          footer: document.querySelectorAll("footer").length
        },
        images: [...document.querySelectorAll("img")].map((image) => ({
          alt: image.alt,
          width: image.width,
          height: image.height
        })),
        robots: document.querySelector('meta[name="robots"]')?.content,
        socialImage: document.querySelector('meta[property="og:image"]')?.content,
        socialImageSize: [
          document.querySelector('meta[property="og:image:width"]')?.content,
          document.querySelector('meta[property="og:image:height"]')?.content
        ],
        structuredDataTypes: [...document.querySelectorAll('script[type="application/ld+json"]')]
          .flatMap((script) => JSON.parse(script.textContent)["@graph"] ?? [])
          .map((entry) => entry["@type"])
      }))()`,
    );

    const accessibilityTree = await client.send("Accessibility.getFullAXTree");
    const accessibility = accessibilityTree.nodes
      .filter((node) => !node.ignored)
      .filter((node) =>
        ["main", "navigation", "heading", "link", "image"].includes(
          node.role?.value,
        ),
      )
      .map((node) => ({
        role: node.role?.value,
        name: node.name?.value ?? "",
        level: node.properties?.find(
          (property) => property.name === "level",
        )?.value?.value,
      }));

    const heroScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-hero.png`),
      Buffer.from(heroScreenshot.data, "base64"),
    );

    await evaluate(
      client,
      `(() => {
        document.querySelector("#writing").scrollIntoView({ behavior: "instant", block: "center" });
        return true;
      })()`,
    );
    await delay(900);
    const writing = await evaluate(
      client,
      `(() => ({
        entries: document.querySelectorAll(".story-row").length,
        titles: [...document.querySelectorAll(".story-row h3")].map((node) => node.textContent.trim()),
        dates: [...document.querySelectorAll(".story-row time")].map((node) => node.dateTime),
        links: [...document.querySelectorAll(".story-row")].map((node) => node.href)
      }))()`,
    );

    const writingScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-writing.png`),
      Buffer.from(writingScreenshot.data, "base64"),
    );

    await evaluate(
      client,
      `(() => {
        window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'instant' });
        return true;
      })()`,
    );
    await delay(900);
    const smileExit = await evaluate(
      client,
      `(() => ({
        scrollY: Math.round(window.scrollY),
        expectedExitAt: Math.round(window.innerHeight * 0.75),
        progress: window.__unifiedRendererMetrics?.smileProgress,
        visible: window.__unifiedRendererMetrics?.smileVisible
      }))()`,
    );

    const smileExitScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-smile-exit.png`),
      Buffer.from(smileExitScreenshot.data, "base64"),
    );

    await evaluate(
      client,
      `(() => {
        document.querySelector('#caipora').scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      })()`,
    );
    await delay(500);
    const navigation = await evaluate(
      client,
      `(() => ({
        hash: location.hash,
        caiporaTop: Math.round(document.querySelector("#caipora").getBoundingClientRect().top),
        caiporaImageLoaded: document.querySelector("#caipora img").complete
      }))()`,
    );

    const caiporaScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-caipora.png`),
      Buffer.from(caiporaScreenshot.data, "base64"),
    );

    await evaluate(
      client,
      `(() => {
        document.querySelector('.clouds').scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      })()`,
    );
    await delay(1200);
    const clouds = await evaluate(
      client,
      `(() => {
        const root = document.querySelector('.clouds-cover');
        const image = root?.querySelector('img');
        const iframe = document.querySelector('.spotify-frame iframe');
        return {
          imageLoaded: Boolean(image?.complete && image.naturalWidth > 0),
          imageOpacity: image ? getComputedStyle(image).opacity : null,
          playerHeight: iframe?.getAttribute('height'),
          heading: document.querySelector('#clouds-title')?.textContent?.trim()
        };
      })()`,
    );

    const cloudsScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-clouds.png`),
      Buffer.from(cloudsScreenshot.data, "base64"),
    );

    const privacy = await evaluate(
      client,
      `(() => {
        const resources = performance.getEntriesByType('resource').map((entry) => ({
          origin: new URL(entry.name).origin,
          initiatorType: entry.initiatorType,
          transferSize: entry.transferSize
        }));
        return {
          resources,
          externalScripts: [...document.scripts]
            .map((script) => script.src)
            .filter(Boolean)
            .filter((src) => new URL(src).origin !== location.origin),
          iframeCount: document.querySelectorAll('iframe').length,
          documentCookie: document.cookie,
          localStorageEntries: localStorage.length,
          sessionStorageEntries: sessionStorage.length
        };
      })()`,
    );
    const networkCookies = await client.send("Network.getAllCookies");
    privacy.networkCookies = networkCookies.cookies.map((cookie) => ({
      domain: cookie.domain,
      name: cookie.name,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
    }));

    const keyboard = [];
    if (profile.name === "desktop" || profile.keyboard) {
      await evaluate(
        client,
        `(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          document.body.tabIndex = -1;
          document.body.focus({ preventScroll: true });
          return document.querySelectorAll("a[href]").length;
        })()`,
      );
      for (let index = 0; index < 17; index += 1) {
        await client.send("Input.dispatchKeyEvent", {
          type: "keyDown",
          key: "Tab",
          code: "Tab",
          windowsVirtualKeyCode: 9,
          nativeVirtualKeyCode: 9,
        });
        await client.send("Input.dispatchKeyEvent", {
          type: "keyUp",
          key: "Tab",
          code: "Tab",
          windowsVirtualKeyCode: 9,
          nativeVirtualKeyCode: 9,
        });
        await delay(40);
        keyboard.push(
          await evaluate(
            client,
            `(() => {
              const node = document.activeElement;
              const style = getComputedStyle(node);
              const rect = node.getBoundingClientRect();
              return {
                tag: node.tagName,
                label: node.getAttribute("aria-label") || node.textContent.trim(),
                href: node.href,
                visible: style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0,
                outlineWidth: style.outlineWidth
              };
            })()`,
          ),
        );
      }
    }

    results.push({
      profile: profile.name,
      consoleErrors,
      failedRequests,
      initial,
      writing,
      smileExit,
      navigation,
      clouds,
      privacy,
      accessibility,
      keyboard,
    });

    client.close();
    await browser.send("Target.closeTarget", { targetId });
  }

  {
    const { client, targetId } = await createPage();
    let responseStatus;
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    client.on("Network.responseReceived", (event) => {
      if (event.type === "Document") responseStatus = event.response.status;
    });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: 1440,
      screenHeight: 1000,
    });
    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", {
      url: new URL("/missing-p7/", baseUrl).href,
    });
    await loaded;
    await delay(400);
    notFound = await evaluate(
      client,
      `(() => ({
        h1: document.querySelector('h1')?.textContent?.trim(),
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        robots: document.querySelector('meta[name="robots"]')?.content,
        returnLabel: document.querySelector('.not-found a')?.textContent?.trim(),
        returnHref: document.querySelector('.not-found a')?.href
      }))()`,
    );
    notFound.status = responseStatus;
    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, "404.png"),
      Buffer.from(screenshot.data, "base64"),
    );
    const returned = client.waitFor("Page.loadEventFired");
    await evaluate(client, "document.querySelector('.not-found a').click() || true");
    await returned;
    notFound.returnedTo = await evaluate(client, "location.href");
    client.close();
    await browser.send("Target.closeTarget", { targetId });
  }

  {
    const { client, targetId } = await createPage();
    const failedRequests = [];
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Network.setBlockedURLs", {
      urls: ["*spotifycdn.com*", "*smile-lite.bin*"],
    });
    client.on("Network.loadingFailed", (event) => {
      failedRequests.push(event.errorText);
    });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: 1440,
      screenHeight: 1000,
    });
    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", { url: baseUrl });
    await loaded;
    await evaluate(
      client,
      `(() => {
        document.querySelector('.clouds').scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      })()`,
    );
    await delay(2500);
    assetFailure = await evaluate(
      client,
      `(() => {
        const cover = document.querySelector('.clouds-cover');
        const smileFallback = document.querySelector('.smile-poster');
        return {
          coverImageOpacity: getComputedStyle(cover.querySelector('img')).opacity,
          coverFallbackText: cover.querySelector('span')?.textContent?.trim(),
          smileFallbackVisible: getComputedStyle(smileFallback).display !== 'none',
          smileCanvasCount: document.querySelectorAll('[data-unified-canvas]').length
        };
      })()`,
    );
    assetFailure.failedRequests = failedRequests;
    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, "asset-failure-clouds.png"),
      Buffer.from(screenshot.data, "base64"),
    );
    client.close();
    await browser.send("Target.closeTarget", { targetId });
  }
} finally {
  try {
    await browser.send("Browser.close");
  } catch {
    chrome.kill("SIGTERM");
  }
  browser.close();
  await delay(250);
  try {
    await rm(userDataDirectory, { recursive: true, force: true });
  } catch {
    await delay(500);
    await rm(userDataDirectory, { recursive: true, force: true });
  }
}

await writeFile(
  resolve(outputDirectory, "browser-verification.json"),
  `${JSON.stringify(results, null, 2)}\n`,
  "utf8",
);

await writeFile(
  resolve(outputDirectory, "polish-verification.json"),
  `${JSON.stringify({ notFound, assetFailure }, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(results, null, 2));
