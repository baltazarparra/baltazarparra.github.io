import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4100/";
const outputDirectory = resolve(process.argv[3] ?? "../docs/evidence/p5");
const chromeExecutable = "/usr/bin/google-chrome";
const duration = 5000;
const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

const profiles = [
  {
    name: "desktop",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reducedMotion: false,
    runs: 3,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
    mobile: true,
    touch: true,
    reducedMotion: false,
    runs: 3,
  },
  {
    name: "reduced",
    width: 1440,
    height: 1000,
    mobile: false,
    touch: false,
    reducedMotion: true,
    runs: 1,
  },
];

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

const userDataDirectory = await mkdtemp(join("/tmp", "baltz-runtime-"));
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
            event.args
              .map((argument) => argument.value ?? argument.description)
              .join(" "),
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

      const loaded = client.waitFor("Page.loadEventFired");
      await client.send("Page.navigate", { url: baseUrl });
      await loaded;
      await delay(750);

      const metrics = await evaluate(
        client,
        `(async () => {
          const frames = [];
          const longTasks = [];
          const memoryStart = performance.memory?.usedJSHeapSize ?? null;
          const observer = "PerformanceObserver" in window
            ? new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  longTasks.push(entry.duration);
                }
              })
            : null;
          try {
            observer?.observe({ type: "longtask", buffered: false });
          } catch {}

          const quantile = (values, fraction) => {
            if (!values.length) return null;
            const sorted = [...values].sort((a, b) => a - b);
            return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
          };
          const round = (value, digits = 2) =>
            value === null ? null : Number(value.toFixed(digits));
          const maximumScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight,
          );
          const startedAt = performance.now();
          let previousFrame = null;

          await new Promise((resolveMeasurement) => {
            const sample = (timestamp) => {
              if (previousFrame !== null) frames.push(timestamp - previousFrame);
              previousFrame = timestamp;
              const progress = Math.min(1, (timestamp - startedAt) / ${duration});
              const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
              window.scrollTo({
                top: maximumScroll * eased,
                behavior: "instant",
              });
              if (progress < 1) requestAnimationFrame(sample);
              else setTimeout(resolveMeasurement, 350);
            };
            requestAnimationFrame(sample);
          });

          observer?.disconnect();
          const validFrames = frames.filter((value) => value > 0 && value < 1000);
          const mean = validFrames.length
            ? validFrames.reduce((sum, value) => sum + value, 0) / validFrames.length
            : null;
          const memoryEnd = performance.memory?.usedJSHeapSize ?? null;
          return {
            frames: {
              samples: validFrames.length,
              fpsApprox: round(mean ? 1000 / mean : null, 1),
              timeP50Ms: round(quantile(validFrames, 0.5)),
              timeP95Ms: round(quantile(validFrames, 0.95)),
              over20msPct: round(
                validFrames.length
                  ? validFrames.filter((value) => value > 20).length / validFrames.length * 100
                  : null,
              ),
            },
            longTasks: {
              count: longTasks.length,
              totalMs: round(longTasks.reduce((sum, value) => sum + value, 0)),
              maxMs: round(longTasks.length ? Math.max(...longTasks) : 0),
            },
            memory: {
              endMiB: round(memoryEnd === null ? null : memoryEnd / 1048576),
              deltaMiB: round(
                memoryEnd === null || memoryStart === null
                  ? null
                  : (memoryEnd - memoryStart) / 1048576,
              ),
            },
            finalScrollY: Math.round(window.scrollY),
            maximumScroll: Math.round(maximumScroll),
            unifiedCanvas: document.querySelectorAll("[data-unified-canvas]").length,
            smileProgress: window.__unifiedRendererMetrics?.smileProgress ?? null,
            smileVisible: window.__unifiedRendererMetrics?.smileVisible ?? null,
          };
        })()`,
      );

      rawRuns.push({
        profile: profile.name,
        run,
        consoleErrors,
        metrics,
      });

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

const metricPaths = [
  "frames.fpsApprox",
  "frames.timeP50Ms",
  "frames.timeP95Ms",
  "frames.over20msPct",
  "longTasks.count",
  "longTasks.totalMs",
  "longTasks.maxMs",
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
        metrics: Object.fromEntries(
          metricPaths.map((path) => [
            path,
            summarize(records.map((record) => valueAt(record, path))),
          ]),
        ),
      },
    ];
  }),
);

await writeFile(
  resolve(outputDirectory, "runtime-raw.json"),
  `${JSON.stringify(rawRuns, null, 2)}\n`,
  "utf8",
);
await writeFile(
  resolve(outputDirectory, "runtime-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
