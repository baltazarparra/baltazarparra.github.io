import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollMotion } from "./scrollMotion.js";

const svgNamespace = "http://www.w3.org/2000/svg";
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
// Per-point DOM deformation stays off the native touch-scroll path.
const dynamicScrollBend = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

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
  return { element, path, strength: readStrength(element), visible: false };
};

const ribs = [...document.querySelectorAll("[data-scroll-rib]")].flatMap((element) => {
  const edges = element.dataset.scrollRib?.split(" ") || [];
  return edges.filter((edge) => edge === "top" || edge === "bottom")
    .map((edge) => createRib(element, edge));
});

const surfaces = (dynamicScrollBend
  ? [...document.querySelectorAll("[data-scroll-surface]")]
  : [])
  .map((element) => ({
    element,
    strength: Number(element.dataset.scrollSurfaceStrength) || 0.82,
    width: 0,
    height: 0,
    visible: false,
  }));

const curveElements = dynamicScrollBend
  ? [
      ...document.querySelectorAll("[data-scroll-bend], [data-scroll-curve]"),
      ...[...document.querySelectorAll(".chroma-text")]
        .filter((element) => !element.closest("[data-scroll-curve]")),
    ]
  : [];

const groups = [...new Set(curveElements)].map((element) => {
  const pointSelector = element.classList.contains("chroma-text")
    ? ".chroma-unit"
    : ":scope > *:not(.scroll-rib)";
  const points = [...element.querySelectorAll(pointSelector)]
    .map((point) => ({ element: point, normalizedX: 0 }));
  points.forEach(({ element: point }) => point.classList.add("scroll-curve-point"));
  return {
    element,
    points,
    halfWidth: 1,
    strength: readGroupStrength(element),
    visible: false,
  };
});

if (
  dynamicScrollBend
  && (groups.length > 0 || ribs.length > 0 || surfaces.length > 0)
) {
  const resetGroup = (group) => {
    group.points.forEach(({ element: point }) => {
      point.style.removeProperty("translate");
      point.style.removeProperty("rotate");
    });
    group.element.classList.remove("is-scroll-curving");
  };

  const resetSurface = (surface) => {
    surface.element.style.removeProperty("clip-path");
    surface.element.classList.remove("is-scroll-surface-curving");
  };

  const measureLayout = () => {
    groups.forEach(resetGroup);
    surfaces.forEach(resetSurface);

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
    group.points.forEach(({ element: point, normalizedX }) => {
      const arch = 1 - normalizedX * normalizedX;
      const translateY = -amplitude * arch;
      const tangent = (2 * amplitude * normalizedX) / group.halfWidth;
      const rotation = clamp(Math.atan(tangent) * (180 / Math.PI), -3, 3);
      point.style.translate = `0 ${translateY.toFixed(2)}px`;
      point.style.rotate = `${rotation.toFixed(2)}deg`;
    });
    group.element.classList.add("is-scroll-curving");
  };

  const renderRib = (rib, impulse, motionScale) => {
    const controlY = clamp(80 - impulse * 52 * rib.strength * motionScale, 30, 130);
    rib.path.setAttribute("d", `M 0 80 Q 500 ${controlY.toFixed(2)} 1000 80`);
  };

  const surfacePoints = (width, height, amplitude) => {
    const magnitude = Math.abs(amplitude);
    const top = [];
    const bottom = [];
    const steps = 18;
    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      const normalizedX = progress * 2 - 1;
      const arch = 1 - normalizedX * normalizedX;
      const shift = amplitude >= 0 ? magnitude * (1 - arch) : magnitude * arch;
      top.push({ x: width * progress, y: shift });
      bottom.push({ x: width * progress, y: height - magnitude + shift });
    }
    return { top, bottom };
  };

  const renderSurface = (surface, impulse, motionScale) => {
    if (surface.width <= 0 || surface.height <= 0) return;
    const amplitude = impulse * 22 * surface.strength * motionScale;
    const { top, bottom } = surfacePoints(surface.width, surface.height, amplitude);
    const polygon = [...top, ...bottom.toReversed()]
      .map(({ x, y }) => `${x.toFixed(2)}px ${y.toFixed(2)}px`)
      .join(", ");
    surface.element.style.clipPath = `polygon(${polygon})`;
    surface.element.classList.add("is-scroll-surface-curving");
  };

  ribs.forEach((rib) => renderRib(rib, 0, 1));
  measureLayout();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      groups.filter(({ element }) => element === entry.target).forEach((group) => {
        group.visible = entry.isIntersecting;
        if (!group.visible) resetGroup(group);
      });
      ribs.filter(({ element }) => element === entry.target).forEach((rib) => {
        rib.visible = entry.isIntersecting;
      });
      surfaces.filter(({ element }) => element === entry.target).forEach((surface) => {
        surface.visible = entry.isIntersecting;
        if (!surface.visible) resetSurface(surface);
      });
    });
  }, { rootMargin: "30% 0px" });

  [...new Set([
    ...groups.map(({ element }) => element),
    ...ribs.map(({ element }) => element),
    ...surfaces.map(({ element }) => element),
  ])].forEach((element) => observer.observe(element));

  const resizeObserver = new ResizeObserver(scheduleMeasure);
  resizeObserver.observe(document.documentElement);
  ScrollTrigger.addEventListener("refreshInit", measureLayout);
  document.fonts?.ready.then(() => {
    measureLayout();
    ScrollTrigger.refresh();
  });

  scrollMotion.subscribe(({ impulse, active }) => {
    const motionScale = window.innerWidth <= 760 ? 0.72 : 1;
    groups.forEach((group) => {
      if (!active || !group.visible) resetGroup(group);
      else renderGroup(group, impulse, motionScale);
    });
    ribs.forEach((rib) => {
      if (rib.visible) renderRib(rib, active ? impulse : 0, motionScale);
    });
    surfaces.forEach((surface) => {
      if (!active || !surface.visible) resetSurface(surface);
      else renderSurface(surface, impulse, motionScale);
    });
  });
}
