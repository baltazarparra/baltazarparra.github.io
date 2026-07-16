import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4302/";
const outputDirectory = resolve(process.argv[3] ?? "/tmp/r2-interaction-runtime");
const chromeExecutable = "/usr/bin/google-chrome";
const duration = 4000;
const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

const profiles = [
  {
    name: "smile-desktop",
    suffix: "",
    selector: "[data-smile-slot]",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reduced: false,
    runs: 3,
  },
  {
    name: "liquid-desktop",
    suffix: "?view=liquid",
    selector: "[data-liquid-slot]",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reduced: false,
    runs: 3,
  },
  {
    name: "smile-mobile",
    suffix: "",
    selector: "[data-smile-slot]",
    width: 390,
    height: 844,
    mobile: true,
    touch: true,
    reduced: false,
    runs: 3,
  },
  {
    name: "liquid-mobile",
    suffix: "?view=liquid",
    selector: "[data-liquid-slot]",
    width: 390,
    height: 844,
    mobile: true,
    touch: true,
    reduced: false,
    runs: 3,
  },
  {
    name: "reduced",
    suffix: "",
    selector: null,
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reduced: true,
    runs: 1,
  },
];

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
    this.listeners.set(method, [...(this.listeners.get(method) ?? []), listener]);
  }

  waitFor(method) {
    return new Promise((resolveEvent) => {
      const listener = (params) => {
        this.listeners.set(
          method,
          (this.listeners.get(method) ?? []).filter((candidate) => candidate !== listener),
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

await mkdir(outputDirectory, { recursive: true });
const userDataDirectory = await mkdtemp(join("/tmp", "r2-interaction-"));
const chrome = spawn(
  chromeExecutable,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--enable-precise-memory-info",
    "--enable-unsafe-swiftshader",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
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

const rawRuns = [];

try {
  for (const profile of profiles) {
    for (let run = 1; run <= profile.runs; run += 1) {
      const { client, targetId } = await createPage();
      const consoleErrors = [];
      client.on("Runtime.exceptionThrown", (event) => {
        consoleErrors.push(event.exceptionDetails?.text ?? "Runtime exception");
      });
      client.on("Runtime.consoleAPICalled", (event) => {
        if (event.type === "error") {
          consoleErrors.push(
            event.args.map((argument) => argument.value ?? argument.description).join(" "),
          );
        }
      });

      await client.send("Page.enable");
      await client.send("Runtime.enable");
      await client.send("Network.enable");
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
            value: profile.reduced ? "reduce" : "no-preference",
          },
          { name: "hover", value: profile.touch ? "none" : "hover" },
          { name: "pointer", value: profile.touch ? "coarse" : "fine" },
        ],
      });

      const loaded = client.waitFor("Page.loadEventFired");
      await client.send("Page.navigate", { url: `${baseUrl}${profile.suffix}` });
      await loaded;
      await delay(650);

      let pointerTimer = null;
      let touchActive = false;
      let pointerPhase = 0;
      let bounds = null;
      if (profile.selector && !profile.reduced) {
        await evaluate(
          client,
          `document.querySelector(${JSON.stringify(profile.selector)})
            ?.scrollIntoView({ block: "center", behavior: "auto" })`,
        );
        await delay(120);
        bounds = await evaluate(
          client,
          `(() => {
            const rect = document.querySelector(${JSON.stringify(profile.selector)})
              ?.getBoundingClientRect();
            return rect
              ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
              : null;
          })()`,
        );
      }

      const dispatchPointer = async () => {
        if (!bounds) return;
        pointerPhase += 0.19;
        const x = bounds.left + bounds.width * (0.5 + Math.cos(pointerPhase) * 0.34);
        const y = bounds.top + bounds.height * (0.5 + Math.sin(pointerPhase * 0.82) * 0.32);
        if (profile.touch) {
          await client.send("Input.dispatchTouchEvent", {
            type: touchActive ? "touchMove" : "touchStart",
            touchPoints: [{ x, y, id: 0, radiusX: 1, radiusY: 1, force: 1 }],
          });
          touchActive = true;
          return;
        }
        await client.send("Input.dispatchMouseEvent", {
          type: "mouseMoved",
          x,
          y,
          button: "none",
          buttons: 0,
          pointerType: "mouse",
        });
      };

      if (bounds) {
        await dispatchPointer();
        pointerTimer = setInterval(() => {
          void dispatchPointer().catch(() => {});
        }, 32);
      }

      let result;
      try {
        result = await evaluate(
          client,
          `(async () => {
          const frames = [];
          const longTasks = [];
          const memoryStart = performance.memory?.usedJSHeapSize ?? null;
          const observer = "PerformanceObserver" in window
            ? new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) longTasks.push(entry.duration);
              })
            : null;
          try { observer?.observe({ type: "longtask", buffered: false }); } catch {}

          const startedAt = performance.now();
          let previousFrame = null;
          await new Promise((resolveMeasurement) => {
            const sample = (timestamp) => {
              if (previousFrame !== null) frames.push(timestamp - previousFrame);
              previousFrame = timestamp;
              const progress = Math.min(1, (timestamp - startedAt) / ${duration});
              if (progress < 1) requestAnimationFrame(sample);
              else setTimeout(resolveMeasurement, 250);
            };
            requestAnimationFrame(sample);
          });

          observer?.disconnect();
          const valid = frames.filter((value) => value > 0 && value < 1000);
          const sorted = [...valid].sort((a, b) => a - b);
          const quantile = (fraction) => sorted.length
            ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))]
            : null;
          const mean = valid.length
            ? valid.reduce((sum, value) => sum + value, 0) / valid.length
            : null;
          const round = (value, digits = 2) => value === null ? null : Number(value.toFixed(digits));
          const memoryEnd = performance.memory?.usedJSHeapSize ?? null;
          return {
            frames: {
              samples: valid.length,
              fpsApprox: round(mean ? 1000 / mean : null, 1),
              timeP50Ms: round(quantile(0.5)),
              timeP95Ms: round(quantile(0.95)),
              over20msPct: round(valid.length
                ? valid.filter((value) => value > 20).length / valid.length * 100
                : null),
            },
            longTasks: {
              count: longTasks.length,
              totalMs: round(longTasks.reduce((sum, value) => sum + value, 0)),
              maxMs: round(longTasks.length ? Math.max(...longTasks) : 0),
            },
            memory: {
              endMiB: round(memoryEnd === null ? null : memoryEnd / 1048576),
              deltaMiB: round(memoryEnd === null || memoryStart === null
                ? null
                : (memoryEnd - memoryStart) / 1048576),
            },
            canvases: document.querySelectorAll("canvas").length,
            renderer: window.__unifiedRendererMetrics
              ? {
                  contexts: window.__unifiedRendererMetrics.contexts,
                  programs: window.__unifiedRendererMetrics.programs,
                  quality: window.__unifiedRendererMetrics.quality,
                  renderer: window.__unifiedRendererMetrics.renderer,
                }
              : null,
            state: document.documentElement.dataset.renderer,
          };
          })()`,
        );
      } finally {
        if (pointerTimer) clearInterval(pointerTimer);
        if (touchActive) {
          await client.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
          });
        }
      }

      rawRuns.push({ profile: profile.name, run, consoleErrors, metrics: result });
      client.close();
      await browser.send("Target.closeTarget", { targetId });
    }
  }
} finally {
  try {
    await browser.send("Browser.close");
  } catch {
    chrome.kill("SIGTERM");
  }
  browser.close();
  await delay(250);
  await rm(userDataDirectory, { recursive: true, force: true });
}

const summarize = (values) => {
  const numbers = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!numbers.length) return null;
  const middle = Math.floor(numbers.length / 2);
  return {
    median: numbers.length % 2
      ? numbers[middle]
      : Number(((numbers[middle - 1] + numbers[middle]) / 2).toFixed(2)),
    min: numbers[0],
    max: numbers.at(-1),
  };
};

const paths = [
  "frames.fpsApprox",
  "frames.timeP50Ms",
  "frames.timeP95Ms",
  "frames.over20msPct",
  "longTasks.count",
  "longTasks.totalMs",
  "memory.endMiB",
  "memory.deltaMiB",
];
const valueAt = (record, path) =>
  path.split(".").reduce((value, key) => value?.[key], record.metrics);
const summary = Object.fromEntries(
  profiles.map((profile) => {
    const records = rawRuns.filter((record) => record.profile === profile.name);
    return [
      profile.name,
      {
        runs: records.length,
        consoleErrors: records.flatMap((record) => record.consoleErrors).length,
        canvases: [...new Set(records.map((record) => record.metrics.canvases))],
        contexts: [...new Set(records.map((record) => record.metrics.renderer?.contexts))],
        programs: [...new Set(records.map((record) => record.metrics.renderer?.programs))],
        quality: [...new Set(records.map((record) => record.metrics.renderer?.quality))],
        renderer: [...new Set(records.map((record) => record.metrics.renderer?.renderer))],
        metrics: Object.fromEntries(
          paths.map((path) => [path, summarize(records.map((record) => valueAt(record, path)))]),
        ),
      },
    ];
  }),
);

await writeFile(
  resolve(outputDirectory, "interaction-raw.json"),
  `${JSON.stringify(rawRuns, null, 2)}\n`,
  "utf8",
);
await writeFile(
  resolve(outputDirectory, "interaction-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
