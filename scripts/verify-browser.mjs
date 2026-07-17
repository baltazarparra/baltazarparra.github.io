import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4100/";
const outputDirectory = resolve(process.argv[3] ?? "docs/evidence/p5");
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
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description ?? result.exceptionDetails.text,
    );
  }
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
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
    mobile: true,
    touch: true,
  },
  {
    name: "narrow-320",
    width: 320,
    height: 800,
    mobile: true,
    touch: true,
  },
  {
    name: "zoom-200",
    width: 720,
    height: 500,
    mobile: false,
    touch: false,
  },
  {
    name: "zoom-400",
    width: 360,
    height: 250,
    mobile: false,
    touch: false,
    keyboard: true,
  },
  {
    name: "no-js",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    disableJavaScript: true,
  },
];
const activeProfiles = profileFilter
  ? profiles.filter((profile) => profile.name === profileFilter)
  : profiles;

const results = [];
let notFound;
let assetFailure;
let geometryFailure;
let webglFailure;

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
    if (profile.name === "desktop") {
      await client.send("Page.addScriptToEvaluateOnNewDocument", {
        source: `(() => {
          const nativeMatchMedia = window.matchMedia.bind(window);
          window.matchMedia = (query) => {
            const result = nativeMatchMedia(query);
            if (query !== "(hover: hover) and (pointer: fine)") return result;
            return new Proxy(result, {
              get(target, property) {
                if (property === "matches") return true;
                const value = Reflect.get(target, property, target);
                return typeof value === "function" ? value.bind(target) : value;
              }
            });
          };
          [window.WebGLRenderingContext, window.WebGL2RenderingContext]
            .filter(Boolean)
            .forEach((Context) => {
              const originalGetParameter = Context.prototype.getParameter;
              Context.prototype.getParameter = function(parameter) {
              if (parameter === 37446 || parameter === 7937) return "ANGLE (Test Hardware GPU)";
                return originalGetParameter.call(this, parameter);
              };
            });
        })();`,
      });
    }
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
    await delay(profile.disableJavaScript ? 3200 : 2500);

    const initial = await evaluate(
      client,
      `(() => ({
        bodyTextLength: document.body.innerText.trim().length,
        h1: document.querySelector("h1")?.textContent?.trim(),
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        heroIndexPresent: Boolean(document.querySelector(".hero-index")),
        heroEmployerDisplay: document.querySelector(".hero-meta a")
          ? getComputedStyle(document.querySelector(".hero-meta a")).display
          : null,
        overlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
        loader: (() => {
          const node = document.querySelector(".opening-loader");
          const style = node ? getComputedStyle(node) : null;
          return {
            present: Boolean(node),
            visibility: style?.visibility ?? null,
            opacity: style?.opacity ?? null
          };
        })(),
        smileCanvas: document.querySelectorAll("[data-unified-canvas]").length,
        viewport: (() => {
          const canvas = document.querySelector("[data-unified-canvas]");
          const canvasRect = canvas?.getBoundingClientRect();
          const rendererMetrics = window.__unifiedRendererMetrics;
          return {
            meta: document.querySelector('meta[name="viewport"]')?.content ?? null,
            innerHeight: window.innerHeight,
            canvasCssHeight: canvasRect?.height ?? null,
            canvasBitmapHeight: canvas?.height ?? null,
            rendererCanvasCssHeight: rendererMetrics?.canvasCssHeight ?? null,
            rendererCanvasBitmapHeight: rendererMetrics?.canvasBitmapHeight ?? null,
            layoutViewportHeight: rendererMetrics?.layoutViewportHeight ?? null,
            backingStoreAligned: canvas && canvasRect
              ? Math.abs(canvas.height - canvasRect.height * Math.min(devicePixelRatio || 1, 1)) <= 1
              : false
          };
        })(),
        sectionOrder: [...document.querySelectorAll("main > section")].map((node) => node.id),
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

    await evaluate(
      client,
      `(() => {
        window.scrollTo({ top: Math.min(window.innerHeight * 1.4, document.documentElement.scrollHeight - window.innerHeight), behavior: "instant" });
        return true;
      })()`,
    );
    await delay(120);
    const scrollMotion = await evaluate(
      client,
      `(() => ({
        metrics: window.__scrollMotionMetrics ?? null,
        curvedPoints: [...document.querySelectorAll(".scroll-curve-point")]
          .filter((node) => node.style.translate).length,
        ribPaths: [...document.querySelectorAll(".scroll-rib path")]
          .slice(0, 8)
          .map((node) => node.getAttribute("d")),
        viewportFilm: {
          transform: getComputedStyle(document.body, "::after").transform,
          opacity: getComputedStyle(document.body, "::after").opacity
        },
        rootState: document.documentElement.dataset.scrollMotion ?? null
      }))()`,
    );
    const scrollDownScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-scroll-down.png`),
      Buffer.from(scrollDownScreenshot.data, "base64"),
    );
    await delay(900);
    const scrollMotionSettled = await evaluate(
      client,
      `(() => ({
        metrics: window.__scrollMotionMetrics ?? null,
        viewportFilm: {
          transform: getComputedStyle(document.body, "::after").transform,
          opacity: getComputedStyle(document.body, "::after").opacity
        },
        rootState: document.documentElement.dataset.scrollMotion ?? null
      }))()`,
    );
    await evaluate(
      client,
      `(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        return true;
      })()`,
    );
    await delay(120);
    const scrollMotionReverse = await evaluate(
      client,
      `(() => ({
        metrics: window.__scrollMotionMetrics ?? null,
        curvedPoints: [...document.querySelectorAll(".scroll-curve-point")]
          .filter((node) => node.style.translate).length,
        ribPaths: [...document.querySelectorAll(".scroll-rib path")]
          .slice(0, 8)
          .map((node) => node.getAttribute("d")),
        viewportFilm: {
          transform: getComputedStyle(document.body, "::after").transform,
          opacity: getComputedStyle(document.body, "::after").opacity
        },
        rootState: document.documentElement.dataset.scrollMotion ?? null
      }))()`,
    );
    const scrollUpScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-scroll-up.png`),
      Buffer.from(scrollUpScreenshot.data, "base64"),
    );
    await delay(900);
    const scrollMotionReverseSettled = await evaluate(
      client,
      `(() => ({
        metrics: window.__scrollMotionMetrics ?? null,
        curvedPoints: [...document.querySelectorAll(".scroll-curve-point")]
          .filter((node) => node.style.translate).length,
        viewportFilm: {
          transform: getComputedStyle(document.body, "::after").transform,
          opacity: getComputedStyle(document.body, "::after").opacity
        },
        rootState: document.documentElement.dataset.scrollMotion ?? null
      }))()`,
    );

    const scrollSurfaces = [];
    if (!profile.disableJavaScript) {
      for (const surfaceName of ["project", "caipora"]) {
        await evaluate(
          client,
          `(() => {
            document.querySelector('[data-scroll-surface][class*="${surfaceName}"]')
              ?.scrollIntoView({ behavior: "instant", block: "center" });
            return true;
          })()`,
        );
        await delay(900);
        await evaluate(
          client,
          `(() => {
            window.scrollBy({ top: Math.min(240, window.innerHeight * 0.24), behavior: "instant" });
            return true;
          })()`,
        );
        await delay(120);
        const surfaceState = await evaluate(
          client,
          `(() => {
            const target = document.querySelector('[data-scroll-surface][class*="${surfaceName}"]');
            return {
              name: "${surfaceName}",
              active: target?.classList.contains('is-scroll-surface-curving') ?? false,
              clipPath: target?.style.clipPath ?? null,
              overlayPresent: Boolean(document.querySelector('.scroll-surface-overlay')),
              renderer: document.documentElement.dataset.renderer ?? null,
              impulse: window.__scrollMotionMetrics?.impulse ?? null
            };
          })()`,
        );
        const surfaceScreenshot = await client.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: false,
        });
        await writeFile(
          resolve(outputDirectory, `${profile.name}-surface-${surfaceName}.png`),
          Buffer.from(surfaceScreenshot.data, "base64"),
        );
        scrollSurfaces.push(surfaceState);
      }
      await evaluate(client, "window.scrollTo({ top: 0, behavior: 'instant' }) || true");
      await delay(900);
    }

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

    let portraitLiquid = null;
    if (profile.name === "desktop" && !profile.disableJavaScript) {
      await evaluate(
        client,
        `(() => {
          document.querySelector('.portrait-shell')
            ?.scrollIntoView({ behavior: 'instant', block: 'center' });
          return true;
        })()`,
      );
      await delay(900);
      const portraitRect = await evaluate(
        client,
        `(() => {
          const rect = document.querySelector('.portrait-shell')?.getBoundingClientRect();
          return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null;
        })()`,
      );
      if (portraitRect) {
        const portraitStillScreenshot = await client.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: false,
        });
        await writeFile(
          resolve(outputDirectory, `${profile.name}-portrait-still.png`),
          Buffer.from(portraitStillScreenshot.data, "base64"),
        );
        const y = portraitRect.top + portraitRect.height * 0.52;
        const positions = [0.08, 0.78, 0.24, 0.7, 0.48];
        for (const [index, progress] of positions.entries()) {
          const x = portraitRect.left + portraitRect.width * progress;
          await client.send("Input.dispatchMouseEvent", {
            type: "mouseMoved",
            x,
            y,
          });
          await evaluate(
            client,
            `(() => {
              const portrait = document.querySelector('.portrait-shell');
              const options = {
                bubbles: true,
                pointerType: 'mouse',
                clientX: ${x},
                clientY: ${y}
              };
              if (${index} === 0) portrait?.dispatchEvent(new PointerEvent('pointerenter', options));
              portrait?.dispatchEvent(new PointerEvent('pointermove', options));
              return true;
            })()`,
          );
          await delay(70);
        }
        portraitLiquid = await evaluate(
          client,
          `(() => ({
            renderer: document.documentElement.dataset.renderer,
            quality: document.documentElement.dataset.quality,
            finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
            rect: ${JSON.stringify(portraitRect)},
            mediaState: document.querySelector('.portrait-shell')?.dataset.mediaState,
            domImageOpacity: getComputedStyle(document.querySelector('.portrait-shell img')).opacity,
            hover: window.__unifiedRendererMetrics?.mediaHover ?? null,
            velocity: window.__unifiedRendererMetrics?.mediaVelocity ?? null,
            trailDistance: window.__unifiedRendererMetrics?.mediaTrailDistance ?? null
          }))()`,
        );
        const portraitLiquidScreenshot = await client.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: false,
        });
        await writeFile(
          resolve(outputDirectory, `${profile.name}-portrait-liquid.png`),
          Buffer.from(portraitLiquidScreenshot.data, "base64"),
        );
      }
    }

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
        const hero = document.querySelector('#hero');
        window.scrollTo({
          top: (hero?.offsetTop ?? 0) + (hero?.offsetHeight ?? window.innerHeight),
          behavior: 'instant'
        });
        return true;
      })()`,
    );
    await delay(900);
    const smileAmbient = await evaluate(
      client,
      `(() => ({
        scrollY: Math.round(window.scrollY),
        expectedSettleAt: Math.round(
          (document.querySelector('#hero')?.offsetTop ?? 0)
          + (document.querySelector('#hero')?.offsetHeight ?? window.innerHeight)
        ),
        progress: window.__unifiedRendererMetrics?.smileProgress,
        persists: window.__unifiedRendererMetrics?.smileVisible,
        docked: window.__unifiedRendererMetrics?.smileDocked,
        widthRatio: window.__unifiedRendererMetrics?.smileWidthRatio,
        visibleHeightRatio: window.__unifiedRendererMetrics?.smileVisibleHeightRatio
      }))()`,
    );

    const smileAmbientScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(outputDirectory, `${profile.name}-smile-ambient.png`),
      Buffer.from(smileAmbientScreenshot.data, "base64"),
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
        caiporaSpriteReady: getComputedStyle(document.querySelector("[data-caipora-sprite]")).backgroundImage !== "none"
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
        const iframe = document.querySelector('.spotify-frame iframe');
        return {
          coverPresent: Boolean(document.querySelector('.clouds-cover')),
          playerHeight: iframe?.getAttribute('height'),
          loading: iframe?.getAttribute('loading'),
          heading: document.querySelector('#clouds-title')?.textContent?.trim(),
          sectionOrder: [...document.querySelectorAll('main > section')].map((node) => node.id)
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
      const keyboardSteps = await evaluate(
        client,
        `(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          document.body.tabIndex = -1;
          document.body.focus({ preventScroll: true });
          return document.querySelectorAll("a[href]").length;
        })()`,
      );
      for (let index = 0; index < keyboardSteps; index += 1) {
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
      scrollMotion,
      scrollMotionSettled,
      scrollMotionReverse,
      scrollMotionReverseSettled,
      scrollSurfaces,
      portraitLiquid,
      writing,
      smileAmbient,
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
      urls: ["*baltz-portrait.webp*"],
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
        document.querySelector('.portrait-shell').scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      })()`,
    );
    await delay(2500);
    assetFailure = await evaluate(
      client,
      `(() => {
        const portrait = document.querySelector('[data-liquid-slot]');
        const image = portrait?.querySelector('img');
        const loader = document.querySelector('.opening-loader');
        return {
          renderer: document.documentElement.dataset.renderer,
          liquid: document.documentElement.dataset.liquid,
          mediaState: portrait?.dataset.mediaState,
          imageLoaded: Boolean(image?.complete && image.naturalWidth > 0),
          loaderVisibility: loader ? getComputedStyle(loader).visibility : null,
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
      resolve(outputDirectory, "asset-failure-portrait.png"),
      Buffer.from(screenshot.data, "base64"),
    );
    client.close();
    await browser.send("Target.closeTarget", { targetId });
  }

  {
    const { client, targetId } = await createPage();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Network.setBlockedURLs", { urls: ["*smile-lite.bin*"] });
    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", { url: baseUrl });
    await loaded;
    await delay(900);
    geometryFailure = await evaluate(
      client,
      `(() => {
        const loader = document.querySelector('.opening-loader');
        return {
          renderer: document.documentElement.dataset.renderer,
          liquid: document.documentElement.dataset.liquid,
          loaderVisibility: loader ? getComputedStyle(loader).visibility : null,
          loaderOpacity: loader ? getComputedStyle(loader).opacity : null
        };
      })()`,
    );
    client.close();
    await browser.send("Target.closeTarget", { targetId });
  }

  {
    const { client, targetId } = await createPage();
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          if (type === "webgl" || type === "experimental-webgl") return null;
          return getContext.call(this, type, ...args);
        };
      })();`,
    });
    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", { url: baseUrl });
    await loaded;
    await delay(900);
    webglFailure = await evaluate(
      client,
      `(() => {
        const loader = document.querySelector('.opening-loader');
        return {
          renderer: document.documentElement.dataset.renderer,
          liquid: document.documentElement.dataset.liquid,
          loaderVisibility: loader ? getComputedStyle(loader).visibility : null,
          portraitOpacity: getComputedStyle(document.querySelector('.portrait-shell img')).opacity
        };
      })()`,
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
  `${JSON.stringify({ notFound, assetFailure, geometryFailure, webglFailure }, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(results, null, 2));
