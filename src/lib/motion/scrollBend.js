import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollMotion } from "./scrollMotion.js";

const svgNamespace = "http://www.w3.org/2000/svg";
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const supportsPathClip = CSS.supports(
  "clip-path",
  'path("M 0 0 L 1 0 L 1 1 Z")',
);

const readStrength = (element) => {
  const localStrength = Number(element.dataset.scrollCurve);
  if (Number.isFinite(localStrength) && localStrength > 0) return localStrength;

  const scene = element.closest("[data-scroll-bend]");
  const sceneStrength = Number(scene?.dataset.scrollBend);
  return Number.isFinite(sceneStrength) && sceneStrength > 0 ? sceneStrength : 0.7;
};

const readGroupStrength = (element) => {
  const strength = readStrength(element);
  if (element.classList.contains("chroma-text")) return strength * 0.62;
  if (element.matches("[data-scroll-bend]:not([data-scroll-curve])")) {
    return strength * 0.28;
  }
  return strength;
};

const createRib = (element, edge) => {
  const svg = document.createElementNS(svgNamespace, "svg");
  const path = document.createElementNS(svgNamespace, "path");
  svg.classList.add("scroll-rib", `scroll-rib--${edge}`);
  svg.setAttribute("viewBox", "0 0 1000 160");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  path.setAttribute("vector-effect", "non-scaling-stroke");
  path.setAttribute("d", "M 0 80 Q 500 80 1000 80");
  svg.append(path);
  element.append(svg);
  return {
    element,
    path,
    strength: readStrength(element),
    visible: false,
    controlY: 80,
  };
};

const ribs = [...document.querySelectorAll("[data-scroll-rib]")].flatMap((element) => {
  const edges = element.dataset.scrollRib?.split(" ") || [];
  return edges.filter((edge) => edge === "top" || edge === "bottom")
    .map((edge) => createRib(element, edge));
});

const surfaces = [...document.querySelectorAll("[data-scroll-surface]")]
  .map((element) => ({
    element,
    strength: Number(element.dataset.scrollSurfaceStrength) || 0.82,
    width: 0,
    height: 0,
    visible: false,
    rendered: false,
    clipPath: "",
  }));

const curveElements = [
  ...document.querySelectorAll("[data-scroll-bend], [data-scroll-curve]"),
  ...[...document.querySelectorAll(".chroma-text")]
    .filter((element) => !element.closest("[data-scroll-curve]")),
];

const groups = [...new Set(curveElements)].map((element) => {
  const pointSelector = element.classList.contains("chroma-text")
    ? ".chroma-unit"
    : ":scope > *:not(.scroll-rib)";
  const points = [...element.querySelectorAll(pointSelector)]
    .map((point) => ({
      element: point,
      normalizedX: 0,
      translate: "",
      rotate: "",
    }));
  points.forEach(({ element: point }) => point.classList.add("scroll-curve-point"));
  return {
    element,
    points,
    halfWidth: 1,
    strength: readGroupStrength(element),
    visible: false,
    rendered: false,
  };
});

const metrics = {
  enabled: true,
  clipPathMode: supportsPathClip ? "path" : "polygon",
  groups: groups.length,
  points: groups.reduce((total, group) => total + group.points.length, 0),
  ribs: ribs.length,
  surfaces: surfaces.length,
  visibleGroups: 0,
  visiblePoints: 0,
  measureCount: 0,
  renderCount: 0,
  pointWrites: 0,
  surfaceWrites: 0,
  lastRenderDuration: 0,
  maxRenderDuration: 0,
};
window.__scrollBendMetrics = metrics;

if (groups.length > 0 || ribs.length > 0 || surfaces.length > 0) {
  const resetGroup = (group) => {
    if (!group.rendered) return 0;
    let writes = 0;
    group.points.forEach((point) => {
      if (point.translate) {
        point.element.style.removeProperty("translate");
        point.translate = "";
        writes += 1;
      }
      if (point.rotate) {
        point.element.style.removeProperty("rotate");
        point.rotate = "";
        writes += 1;
      }
    });
    group.rendered = false;
    group.element.classList.remove("is-scroll-curving");
    return writes;
  };

  const resetRib = (rib) => {
    if (rib.controlY === 80) return;
    rib.controlY = 80;
    rib.path.setAttribute("d", "M 0 80 Q 500 80 1000 80");
  };

  const resetSurface = (surface) => {
    if (!surface.rendered) return 0;
    surface.element.style.removeProperty("clip-path");
    surface.element.classList.remove("is-scroll-surface-curving");
    surface.rendered = false;
    surface.clipPath = "";
    return 1;
  };

  const measureLayout = () => {
    const groupMeasurements = groups.map((group) => {
      const groupRect = group.element.getBoundingClientRect();
      return {
        group,
        groupRect,
        pointRects: group.points.map(({ element }) => element.getBoundingClientRect()),
      };
    });
    const surfaceMeasurements = surfaces.map((surface) => ({
      surface,
      rect: surface.element.getBoundingClientRect(),
    }));

    groupMeasurements.forEach(({ group, groupRect, pointRects }) => {
      const centerX = groupRect.left + groupRect.width * 0.5;
      group.halfWidth = Math.max(1, groupRect.width * 0.5);
      group.points.forEach((point, index) => {
        const rect = pointRects[index];
        const pointX = rect ? rect.left + rect.width * 0.5 : centerX;
        point.normalizedX = clamp((pointX - centerX) / group.halfWidth, -1, 1);
      });
    });
    surfaceMeasurements.forEach(({ surface, rect }) => {
      surface.width = rect.width;
      surface.height = rect.height;
    });
    metrics.measureCount += 1;
  };

  let measureFrame = 0;
  const scheduleMeasure = () => {
    if (measureFrame) return;
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      measureLayout();
    });
  };

  const renderGroup = (group, impulse, motionScale) => {
    const amplitude = impulse * 30 * group.strength * motionScale;
    let writes = 0;
    if (!group.rendered) {
      group.rendered = true;
      group.element.classList.add("is-scroll-curving");
    }
    group.points.forEach((point) => {
      const arch = 1 - point.normalizedX * point.normalizedX;
      const translateY = -amplitude * arch;
      const tangent = (2 * amplitude * point.normalizedX) / group.halfWidth;
      const rotation = clamp(Math.atan(tangent) * (180 / Math.PI), -3, 3);
      const translate = `0 ${translateY.toFixed(2)}px`;
      const rotate = `${rotation.toFixed(2)}deg`;
      if (translate !== point.translate) {
        point.element.style.translate = translate;
        point.translate = translate;
        writes += 1;
      }
      if (rotate !== point.rotate) {
        point.element.style.rotate = rotate;
        point.rotate = rotate;
        writes += 1;
      }
    });
    return writes;
  };

  const renderRib = (rib, impulse, motionScale) => {
    const controlY = clamp(80 - impulse * 52 * rib.strength * motionScale, 30, 130);
    const roundedControlY = Number(controlY.toFixed(2));
    if (roundedControlY === rib.controlY) return;
    rib.controlY = roundedControlY;
    rib.path.setAttribute("d", `M 0 80 Q 500 ${roundedControlY} 1000 80`);
  };

  const surfacePolygon = (width, height, amplitude) => {
    const magnitude = Math.abs(amplitude);
    const top = [];
    const bottom = [];
    const steps = 18;
    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      const normalizedX = progress * 2 - 1;
      const arch = 1 - normalizedX * normalizedX;
      const shift = amplitude >= 0 ? magnitude * (1 - arch) : magnitude * arch;
      top.push(`${(width * progress).toFixed(2)}px ${shift.toFixed(2)}px`);
      bottom.unshift(
        `${(width * progress).toFixed(2)}px ${(height - magnitude + shift).toFixed(2)}px`,
      );
    }
    return `polygon(${[...top, ...bottom].join(", ")})`;
  };

  const surfacePath = (width, height, amplitude) => {
    const magnitude = Math.min(Math.abs(amplitude), height * 0.45);
    const centerX = (width * 0.5).toFixed(2);
    const rightX = width.toFixed(2);
    let topEdge;
    let topControl;
    let bottomEdge;
    let bottomControl;
    if (amplitude >= 0) {
      topEdge = magnitude;
      topControl = -magnitude;
      bottomEdge = height;
      bottomControl = height - magnitude * 2;
    } else {
      topEdge = 0;
      topControl = magnitude * 2;
      bottomEdge = height - magnitude;
      bottomControl = height + magnitude;
    }
    return `path("M 0 ${topEdge.toFixed(2)} Q ${centerX} ${topControl.toFixed(2)} ${rightX} ${topEdge.toFixed(2)} L ${rightX} ${bottomEdge.toFixed(2)} Q ${centerX} ${bottomControl.toFixed(2)} 0 ${bottomEdge.toFixed(2)} Z")`;
  };

  const renderSurface = (surface, impulse, motionScale) => {
    if (surface.width <= 0 || surface.height <= 0) return 0;
    const amplitude = impulse * 22 * surface.strength * motionScale;
    const clipPath = supportsPathClip
      ? surfacePath(surface.width, surface.height, amplitude)
      : surfacePolygon(surface.width, surface.height, amplitude);
    if (clipPath === surface.clipPath) return 0;
    surface.element.style.clipPath = clipPath;
    surface.clipPath = clipPath;
    if (!surface.rendered) {
      surface.rendered = true;
      surface.element.classList.add("is-scroll-surface-curving");
    }
    return 1;
  };

  measureLayout();

  const visibilityTargets = new Map();
  const registerTarget = (element, type, target) => {
    const entries = visibilityTargets.get(element) || [];
    entries.push({ type, target });
    visibilityTargets.set(element, entries);
  };
  groups.forEach((group) => registerTarget(group.element, "group", group));
  ribs.forEach((rib) => registerTarget(rib.element, "rib", rib));
  surfaces.forEach((surface) => registerTarget(surface.element, "surface", surface));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      (visibilityTargets.get(entry.target) || []).forEach(({ type, target }) => {
        const visible = entry.isIntersecting;
        target.visible = visible;
        if (type === "group") {
          target.points.forEach(({ element }) => {
            element.classList.toggle("is-scroll-bend-visible", visible);
          });
          if (!visible) resetGroup(target);
        } else if (type === "rib") {
          if (!visible) resetRib(target);
        } else {
          target.element.classList.toggle("is-scroll-surface-visible", visible);
          if (!visible) resetSurface(target);
        }
      });
    });
    metrics.visibleGroups = groups.filter(({ visible }) => visible).length;
    metrics.visiblePoints = groups.reduce(
      (total, group) => total + (group.visible ? group.points.length : 0),
      0,
    );
  }, { rootMargin: "30% 0px" });

  visibilityTargets.forEach((_, element) => observer.observe(element));

  let measuredRootWidth = document.documentElement.clientWidth;
  const rootResizeObserver = new ResizeObserver(([entry]) => {
    const nextWidth = entry?.contentRect.width || document.documentElement.clientWidth;
    if (Math.abs(nextWidth - measuredRootWidth) <= 0.5) return;
    measuredRootWidth = nextWidth;
    scheduleMeasure();
  });
  rootResizeObserver.observe(document.documentElement);

  const surfaceResizeObserver = new ResizeObserver(scheduleMeasure);
  surfaces.forEach(({ element }) => surfaceResizeObserver.observe(element));
  ScrollTrigger.addEventListener("refreshInit", measureLayout);
  document.fonts?.ready.then(() => {
    measureLayout();
    ScrollTrigger.refresh();
  });

  scrollMotion.subscribe(({ impulse, active }) => {
    const startedAt = performance.now();
    const motionScale = window.innerWidth <= 760 ? 0.72 : 1;
    let pointWrites = 0;
    let surfaceWrites = 0;
    groups.forEach((group) => {
      if (!active || !group.visible) pointWrites += resetGroup(group);
      else pointWrites += renderGroup(group, impulse, motionScale);
    });
    ribs.forEach((rib) => {
      if (rib.visible) renderRib(rib, active ? impulse : 0, motionScale);
    });
    surfaces.forEach((surface) => {
      if (!active || !surface.visible) surfaceWrites += resetSurface(surface);
      else surfaceWrites += renderSurface(surface, impulse, motionScale);
    });
    const duration = performance.now() - startedAt;
    metrics.renderCount += 1;
    metrics.pointWrites += pointWrites;
    metrics.surfaceWrites += surfaceWrites;
    metrics.lastRenderDuration = duration;
    metrics.maxRenderDuration = Math.max(metrics.maxRenderDuration, duration);
  });
}
