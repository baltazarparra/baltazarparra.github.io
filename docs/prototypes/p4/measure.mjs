import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const readArgument = (name, fallback) => {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length) ?? fallback;
};

const baseUrl = readArgument("base", "http://127.0.0.1:4175/docs/prototypes/p4/");
const outputDirectory = resolve(readArgument("output", "docs/evidence/p4"));
const duration = Math.max(2500, Number(readArgument("duration", "5000")));
const repeats = Math.max(1, Number(readArgument("runs", "3")));
const chromeExecutable = readArgument("chrome", "/usr/bin/google-chrome");

const profiles = [
  { name: "desktop", viewport: { width: 1440, height: 1000 }, hasTouch: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, hasTouch: true },
];
const modes = ["cut", "pin", "words"];
const selectedModes = readArgument("modes", modes.join(","))
  .split(",")
  .filter((mode) => modes.includes(mode));
const selectedProfileNames = readArgument("profiles", profiles.map((profile) => profile.name).join(","))
  .split(",");
const selectedProfiles = profiles.filter((profile) => selectedProfileNames.includes(profile.name));
const includeReduced = readArgument("reduced", "1") !== "0";
const screenshotPositions = {
  cut: { selector: "#projects", viewportOffset: 0 },
  pin: { selector: "#projects", viewportOffset: 0.45 },
  words: { selector: "#writing", viewportOffset: 0 },
  reduced: { selector: "#caipora", viewportOffset: 0.35 },
};
const rawRuns = [];

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
        const { resolve: resolveCall, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolveCall(message.result);
        return;
      }

      if (message.method) {
        const callbacks = this.listeners.get(message.method) ?? [];
        callbacks.forEach((callback) => callback(message.params));
      }
    });

    await new Promise((resolveConnection, reject) => {
      this.socket.addEventListener("open", resolveConnection, { once: true });
      this.socket.addEventListener(
        "error",
        () => reject(new Error(`Could not connect to ${this.url}`)),
        { once: true },
      );
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

  waitFor(method) {
    return new Promise((resolveEvent) => {
      const callback = (params) => {
        const callbacks = this.listeners.get(method) ?? [];
        this.listeners.set(method, callbacks.filter((item) => item !== callback));
        resolveEvent(params);
      };
      this.listeners.set(method, [...(this.listeners.get(method) ?? []), callback]);
    });
  }

  on(method, callback) {
    this.listeners.set(method, [...(this.listeners.get(method) ?? []), callback]);
  }

  close() {
    this.socket?.close();
  }
}

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

const launchChrome = async () => {
  const userDataDirectory = await mkdtemp(join(tmpdir(), "p4-cdp-"));
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
    const timeout = setTimeout(() => reject(new Error("Chrome DevTools endpoint timed out")), 15000);
    chrome.stderr.on("data", (chunk) => {
      output += chunk.toString();
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolveUrl(match[1]);
      }
    });
    chrome.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Chrome exited before DevTools was ready (${code})`));
    });
  });

  const browser = await new CDPClient(browserWebSocketUrl).connect();
  const httpOrigin = browserWebSocketUrl.replace("ws://", "http://").replace(/\/devtools\/browser\/.+$/, "");
  return { browser, chrome, httpOrigin, userDataDirectory };
};

const createPage = async (httpOrigin) => {
  const response = await fetch(`${httpOrigin}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error(`Could not create Chrome target (${response.status})`);
  const target = await response.json();
  return {
    client: await new CDPClient(target.webSocketDebuggerUrl).connect(),
    targetId: target.id,
  };
};

const evaluate = async (client, expression) => {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const waitForMetrics = async (client) => {
  const deadline = Date.now() + duration + 15000;
  while (Date.now() < deadline) {
    const complete = await evaluate(
      client,
      'document.documentElement.dataset.metricsComplete === "true"',
    );
    if (complete) return;
    await delay(100);
  }
  throw new Error("Metrics did not complete before the timeout");
};

const { browser, chrome, httpOrigin, userDataDirectory } = await launchChrome();

const runProfile = async ({ mode, profile, reducedMotion = false, repeat = 1 }) => {
  const { client, targetId } = await createPage(httpOrigin);
  const consoleErrors = [];
  client.on("Runtime.exceptionThrown", (event) => {
    consoleErrors.push(event.exceptionDetails?.text ?? "Runtime exception");
  });
  client.on("Runtime.consoleAPICalled", (event) => {
    if (event.type === "error") {
      consoleErrors.push(event.args.map((argument) => argument.value ?? argument.description).join(" "));
    }
  });

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: profile.viewport.width,
    height: profile.viewport.height,
    deviceScaleFactor: 1,
    mobile: profile.name === "mobile",
    screenWidth: profile.viewport.width,
    screenHeight: profile.viewport.height,
  });
  await client.send("Emulation.setTouchEmulationEnabled", {
    enabled: profile.hasTouch,
    maxTouchPoints: profile.hasTouch ? 5 : 1,
  });
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [
      {
        name: "prefers-reduced-motion",
        value: reducedMotion ? "reduce" : "no-preference",
      },
    ],
  });

  const query = new URLSearchParams({
    motion: mode,
    autoplay: "1",
    capture: "1",
    duration: String(duration),
    touch: profile.hasTouch ? "1" : "0",
  });
  if (reducedMotion) query.set("reduced", "1");

  const loaded = client.waitFor("Page.loadEventFired");
  await client.send("Page.navigate", { url: `${baseUrl}?${query}` });
  await loaded;
  await waitForMetrics(client);

  const metrics = await evaluate(client, "window.__P4_METRICS__");
  rawRuns.push({
    key: `${mode}-${profile.name}${reducedMotion ? "-reduced" : ""}`,
    repeat,
    consoleErrors,
    metrics,
  });

  if (repeat === repeats || reducedMotion) {
    const position = reducedMotion ? screenshotPositions.reduced : screenshotPositions[mode];
    await evaluate(
      client,
      `(() => {
        const target = document.querySelector(${JSON.stringify(position.selector)});
        window.scrollTo({
          top: target.offsetTop + window.innerHeight * ${position.viewportOffset},
          behavior: "instant",
        });
        return true;
      })()`,
    );
    await delay(reducedMotion ? 250 : 1100);
    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(
      resolve(
        outputDirectory,
        `${mode}-${profile.name}${reducedMotion ? "-reduced" : ""}.png`,
      ),
      Buffer.from(screenshot.data, "base64"),
    );
  }

  client.close();
  await browser.send("Target.closeTarget", { targetId });
};

try {
  for (const mode of selectedModes) {
    for (const profile of selectedProfiles) {
      for (let repeat = 1; repeat <= repeats; repeat += 1) {
        await runProfile({ mode, profile, repeat });
      }
    }
  }

  if (includeReduced) {
    for (const profile of selectedProfiles) {
      await runProfile({ mode: "cut", profile, reducedMotion: true });
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

const valueAt = (record, path) =>
  path.split(".").reduce((value, key) => value?.[key], record.metrics);
const round = (value, digits = 2) => Number(value.toFixed(digits));
const summarizeValues = (values) => {
  const numbers = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!numbers.length) return null;
  const middle = Math.floor(numbers.length / 2);
  const median = numbers.length % 2
    ? numbers[middle]
    : (numbers[middle - 1] + numbers[middle]) / 2;
  return {
    median: round(median),
    min: round(numbers[0]),
    max: round(numbers[numbers.length - 1]),
  };
};

const metricPaths = [
  "initialization.motionReadyMs",
  "initialization.loadMs",
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

const grouped = Object.groupBy(rawRuns, (record) => record.key);
const summary = Object.fromEntries(
  Object.entries(grouped).map(([key, records]) => [
    key,
    {
      runs: records.length,
      consoleErrors: records.reduce((count, record) => count + record.consoleErrors.length, 0),
      metrics: Object.fromEntries(
        metricPaths.map((path) => [path, summarizeValues(records.map((record) => valueAt(record, path)))]),
      ),
    },
  ]),
);

await writeFile(
  resolve(outputDirectory, "metrics-raw.json"),
  `${JSON.stringify(rawRuns, null, 2)}\n`,
  "utf8",
);
await writeFile(
  resolve(outputDirectory, "metrics-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
