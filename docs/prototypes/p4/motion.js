import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const params = new URLSearchParams(window.location.search);
const root = document.documentElement;
const mode = root.dataset.motion;
const reduced = root.dataset.reduced === "true";
const compact = window.matchMedia("(max-width: 48rem)").matches;
const touchOverride = params.get("touch");
const touch =
  touchOverride === "1" ||
  (touchOverride !== "0" && window.matchMedia("(hover: none), (pointer: coarse)").matches);
const lab = window.__P4_LAB__;
const metricsOutput = document.querySelector("#metrics-output");
const measurementDuration = Math.max(
  2500,
  Math.min(Number(params.get("duration")) || 8500, 20000),
);

document.querySelector(`[data-mode-link="${mode}"]`)?.setAttribute("aria-current", "page");
const reducedLink = document.querySelector(".reduced-link");
if (reducedLink) {
  reducedLink.href = `?motion=${mode}&reduced=${reduced ? "0" : "1"}`;
  reducedLink.textContent = reduced ? "Full motion" : "Reduced";
}

const settle = (targets, trigger, options = {}) => {
  gsap.from(targets, {
    autoAlpha: 0,
    y: options.y ?? 32,
    duration: options.duration ?? 0.78,
    stagger: options.stagger ?? 0.06,
    ease: "power3.out",
    clearProps: "opacity,visibility,transform",
    scrollTrigger: {
      trigger,
      start: options.start ?? "top 78%",
      toggleActions: "play none none reverse",
    },
  });
};

const setupHero = () => {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  timeline
    .from(".site-header", { yPercent: -105, duration: 0.56 })
    .from(
      ".hero-beat",
      {
        autoAlpha: 0,
        y: 30,
        duration: 0.72,
        stagger: 0.07,
      },
      0.12,
    )
    .from(
      ".hero-object",
      {
        autoAlpha: 0,
        clipPath: "inset(0 0 100% 0)",
        duration: 0.92,
      },
      0.2,
    );
};

const setupCut = () => {
  document.querySelectorAll(".scene:not(.hero)").forEach((scene) => {
    const media = scene.querySelectorAll(".scene-media");
    const copy = scene.querySelectorAll(".scene-copy, .scene-list");

    if (media.length) {
      gsap.from(media, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.95,
        ease: "power4.inOut",
        clearProps: "clipPath",
        scrollTrigger: {
          trigger: scene,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }

    if (copy.length) settle(copy, scene, { start: "top 72%" });
  });

  gsap.fromTo(
    ".thermal-cut span",
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".thermal-cut",
        start: "top 92%",
        end: "top 35%",
        scrub: 0.35,
      },
    },
  );
};

const setupPin = () => {
  document.querySelectorAll(".scene:not(.hero):not(.projects)").forEach((scene) => {
    settle(scene.querySelectorAll(".scene-copy, .scene-list, .scene-media"), scene, {
      y: 24,
      start: "top 76%",
    });
  });

  const lead = document.querySelector(".project-lead");
  const projects = document.querySelector(".projects");
  const entries = gsap.utils.toArray(".project-entry");

  if (compact || touch) {
    settle(lead, projects, { start: "top 76%" });
    entries.forEach((entry) => settle(entry, entry, { start: "top 82%" }));
  } else {
    ScrollTrigger.create({
      trigger: projects,
      start: "top top+=112",
      end: () => `+=${Math.max(window.innerHeight, projects.offsetHeight - window.innerHeight * 0.6)}`,
      pin: lead,
      pinSpacing: false,
      anticipatePin: 1,
    });

    entries.forEach((entry) => {
      gsap.fromTo(
        entry,
        { autoAlpha: 0.22, y: 56, scale: 0.965 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: entry,
            start: "top 88%",
            end: "center 55%",
            scrub: 0.45,
          },
        },
      );
    });
  }

  gsap.fromTo(
    ".thermal-cut span",
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.65,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: ".thermal-cut",
        start: "top 84%",
        toggleActions: "play none none reverse",
      },
    },
  );
};

const splitWords = () => {
  document.querySelectorAll("[data-words]").forEach((element) => {
    const text = element.textContent.trim();
    element.setAttribute("aria-label", text);
    element.textContent = "";

    text.split(/\s+/).forEach((word, index, words) => {
      const span = document.createElement("span");
      span.className = "word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      element.append(span);
      if (index < words.length - 1) element.append(" ");
    });
  });
};

const setupWords = () => {
  splitWords();

  document.querySelectorAll("[data-words]").forEach((heading) => {
    const words = heading.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { opacity: 0.14, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: heading,
          start: "top 86%",
          end: "bottom 43%",
          scrub: 0.35,
        },
      },
    );
  });

  document.querySelectorAll(".scene-media").forEach((media) => {
    gsap.fromTo(
      media,
      { autoAlpha: 0.35, scale: 0.91 },
      {
        autoAlpha: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: media,
          start: "top 92%",
          end: "center 54%",
          scrub: 0.5,
        },
      },
    );
  });

  document.querySelectorAll(".scene-list").forEach((list) => {
    settle(list, list, { y: 18, start: "top 82%", duration: 0.6 });
  });

  gsap.fromTo(
    ".thermal-cut span",
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".thermal-cut",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
};

const context = gsap.context(() => {
  if (reduced) {
    gsap.set(".thermal-cut span", { scaleX: 1 });
    return;
  }

  setupHero();
  if (mode === "cut") setupCut();
  if (mode === "pin") setupPin();
  if (mode === "words") setupWords();
});

ScrollTrigger.refresh();
lab.motionReadyAt = performance.now();

const quantile = (values, percentile) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(percentile * sorted.length) - 1);
  return sorted[index];
};

const round = (value, digits = 2) =>
  value === null || !Number.isFinite(value) ? null : Number(value.toFixed(digits));

const sampler = {
  active: false,
  frames: [],
  startedAt: 0,
  lastFrameAt: 0,
  startHeap: null,
  raf: 0,
};

const sampleFrame = (timestamp) => {
  if (!sampler.active) return;
  if (sampler.lastFrameAt) sampler.frames.push(timestamp - sampler.lastFrameAt);
  sampler.lastFrameAt = timestamp;
  sampler.raf = requestAnimationFrame(sampleFrame);
};

const beginMeasurement = () => {
  sampler.active = true;
  sampler.frames = [];
  sampler.startedAt = performance.now();
  sampler.lastFrameAt = 0;
  sampler.startHeap = performance.memory?.usedJSHeapSize ?? null;
  sampler.raf = requestAnimationFrame(sampleFrame);
};

const finishMeasurement = () => {
  if (!sampler.active) return window.__P4_METRICS__;
  sampler.active = false;
  cancelAnimationFrame(sampler.raf);

  const finishedAt = performance.now();
  const frames = sampler.frames.filter((value) => value > 0 && value < 1000);
  const frameMean = frames.length
    ? frames.reduce((total, value) => total + value, 0) / frames.length
    : null;
  const longTasks = lab.longTasks.filter(
    (task) => task.startTime >= sampler.startedAt && task.startTime <= finishedAt,
  );
  const navigation = performance.getEntriesByType("navigation")[0];
  const paints = Object.fromEntries(
    performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime]),
  );
  const endHeap = performance.memory?.usedJSHeapSize ?? null;
  const metrics = {
    prototype: mode,
    reducedMotion: reduced,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    touchFallback: compact || touch,
    environment: navigator.userAgent,
    throttling: "none; viewport emulation only",
    measurementMs: round(finishedAt - sampler.startedAt),
    scrollDistancePx: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    initialization: {
      motionReadyMs: round(lab.motionReadyAt - lab.startedAt),
      domContentLoadedMs: round(navigation?.domContentLoadedEventEnd ?? null),
      loadMs: round(navigation?.loadEventEnd ?? null),
      firstContentfulPaintMs: round(paints["first-contentful-paint"] ?? null),
    },
    frames: {
      samples: frames.length,
      fpsApprox: round(frameMean ? 1000 / frameMean : null, 1),
      timeP50Ms: round(quantile(frames, 0.5)),
      timeP95Ms: round(quantile(frames, 0.95)),
      over20msPct: round(
        frames.length ? (frames.filter((value) => value > 20).length / frames.length) * 100 : null,
        1,
      ),
    },
    longTasks: {
      count: longTasks.length,
      totalMs: round(longTasks.reduce((total, task) => total + task.duration, 0)),
      maxMs: round(longTasks.length ? Math.max(...longTasks.map((task) => task.duration)) : 0),
    },
    memory: {
      supported: endHeap !== null,
      startMiB: round(sampler.startHeap === null ? null : sampler.startHeap / 1048576),
      endMiB: round(endHeap === null ? null : endHeap / 1048576),
      deltaMiB: round(
        endHeap === null || sampler.startHeap === null
          ? null
          : (endHeap - sampler.startHeap) / 1048576,
      ),
    },
  };

  window.__P4_METRICS__ = metrics;
  root.dataset.metricsComplete = "true";
  if (metricsOutput) metricsOutput.textContent = JSON.stringify(metrics, null, 2);
  return metrics;
};

const runAutoplay = () => {
  beginMeasurement();
  const startedAt = performance.now();
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const step = (timestamp) => {
    const progress = Math.min(1, (timestamp - startedAt) / measurementDuration);
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    window.scrollTo(0, maxScroll * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      window.setTimeout(finishMeasurement, 350);
    }
  };

  requestAnimationFrame(step);
};

const prepareRun = async () => {
  await document.fonts.ready;
  ScrollTrigger.refresh();

  const snapshot = Number(params.get("progress"));
  if (Number.isFinite(snapshot) && snapshot >= 0 && snapshot <= 1) {
    window.scrollTo(
      0,
      (document.documentElement.scrollHeight - window.innerHeight) * snapshot,
    );
    ScrollTrigger.update();
  }

  if (params.get("autoplay") === "1") {
    window.setTimeout(runAutoplay, 350);
  } else {
    beginMeasurement();
    window.setTimeout(finishMeasurement, measurementDuration);
  }
};

if (document.readyState === "complete") {
  prepareRun();
} else {
  window.addEventListener("load", prepareRun, { once: true });
}

window.addEventListener(
  "beforeunload",
  () => {
    context.revert();
    lab.longTaskObserver?.disconnect();
  },
  { once: true },
);
