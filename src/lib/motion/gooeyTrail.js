import { gsap } from "gsap";

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const layer = document.querySelector("[data-gooey-trail]");
const grid = layer?.querySelector("[data-gooey-grid]");
const exclusions = [...document.querySelectorAll("[data-gooey-exclude]")];

const metrics = {
  status: "idle",
  active: false,
  cells: 0,
  filter: "none",
  zone: null,
  reveals: 0,
};

window.__gooeyTrailMetrics = metrics;

if (layer instanceof HTMLElement && grid instanceof HTMLElement) {
  const isFirefox = navigator.userAgent.includes("Firefox");
  const canUseFilter = CSS.supports("filter", "blur(1px)") && !isFirefox;
  const cells = [];
  let columns = 0;
  let rows = 0;
  let cellSize = 0;
  let resizeFrame = 0;
  let moveFrame = 0;
  let pendingEvent = null;
  let lastPoint = null;
  let lastCellIndex = -1;
  let active = false;

  const setActive = (nextActive, zone = null) => {
    if (active === nextActive && metrics.zone === zone?.id) return;
    active = nextActive;
    metrics.active = nextActive;
    metrics.zone = zone?.id ?? null;
    layer.dataset.active = nextActive ? "true" : "false";
    document.documentElement.dataset.gooeySurface = nextActive ? "active" : "idle";

    if (!nextActive) {
      lastPoint = null;
      lastCellIndex = -1;
      gsap.to(cells, {
        opacity: 0,
        scale: 0.32,
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const cellTone = (index) => {
    const value = (index * 17 + Math.floor(index / Math.max(columns, 1)) * 11) % 13;
    if (value === 0 || value === 7) return "rust";
    if (value === 3 || value === 9 || value === 12) return "ember";
    return "paper";
  };

  const buildGrid = () => {
    columns = Math.max(12, Math.min(22, Math.round(window.innerWidth / 78)));
    cellSize = window.innerWidth / columns;
    rows = Math.ceil(window.innerHeight / cellSize) + 1;

    const fragment = document.createDocumentFragment();
    const nextCells = [];
    const total = columns * rows;

    for (let index = 0; index < total; index += 1) {
      const cell = document.createElement("span");
      cell.className = "gooey-trail__cell";
      cell.dataset.tone = cellTone(index);
      fragment.append(cell);
      nextCells.push(cell);
    }

    gsap.killTweensOf(cells);
    grid.replaceChildren(fragment);
    cells.splice(0, cells.length, ...nextCells);
    grid.style.setProperty("--gooey-columns", String(columns));
    grid.style.setProperty("--gooey-cell-size", `${cellSize}px`);
    metrics.cells = cells.length;
    lastPoint = null;
    lastCellIndex = -1;
  };

  const revealCell = (x, y, speed) => {
    const column = Math.max(0, Math.min(columns - 1, Math.floor(x / cellSize)));
    const row = Math.max(0, Math.min(rows - 1, Math.floor(y / cellSize)));
    const cellIndex = row * columns + column;
    if (cellIndex === lastCellIndex) return;
    const cell = cells[cellIndex];
    if (!cell) return;
    lastCellIndex = cellIndex;

    const density = 1 - speed;
    const scale = 1.18 + density * 0.42;
    const hold = 0.09 + density * 0.1;
    const fade = 0.62 + density * 0.24;

    gsap.killTweensOf(cell);
    gsap.set(cell, { opacity: 1, scale });
    gsap.to(cell, {
      opacity: 0,
      scale: 0.34,
      duration: fade,
      delay: hold,
      ease: "expo.out",
      overwrite: false,
    });
    metrics.reveals += 1;
  };

  const drawSegment = (point) => {
    if (!lastPoint) {
      revealCell(point.x, point.y, 0);
      lastPoint = point;
      return;
    }

    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    const elapsed = Math.max(8, point.time - lastPoint.time);
    const speed = Math.min(1, distance / elapsed / 1.75);
    const steps = Math.max(1, Math.min(8, Math.ceil(distance / (cellSize * 0.48))));

    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      revealCell(
        lastPoint.x + (point.x - lastPoint.x) * progress,
        lastPoint.y + (point.y - lastPoint.y) * progress,
        speed,
      );
    }

    lastPoint = point;
  };

  const resolveTarget = (event) => {
    if (event.target instanceof Element) return event.target;
    return document.elementFromPoint(event.clientX, event.clientY);
  };

  const renderMove = () => {
    moveFrame = 0;
    const event = pendingEvent;
    pendingEvent = null;
    if (!(event instanceof PointerEvent)) return;

    const target = resolveTarget(event);
    const zone = target?.closest("[data-gooey-zone]");
    const excluded = target?.closest("[data-gooey-exclude]");

    if (!(zone instanceof HTMLElement) || excluded) {
      setActive(false);
      return;
    }

    setActive(true, zone);
    drawSegment({ x: event.clientX, y: event.clientY, time: event.timeStamp });
  };

  const onPointerMove = (event) => {
    pendingEvent = event;
    if (!moveFrame) moveFrame = requestAnimationFrame(renderMove);
  };

  const onResize = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      buildGrid();
    });
  };

  const onDeactivate = () => setActive(false);
  const onVisibilityChange = () => {
    if (document.visibilityState !== "visible") setActive(false);
  };

  const enable = () => {
    if (!finePointer.matches || metrics.status === "ready") return;
    buildGrid();
    layer.dataset.filter = canUseFilter ? "gooey" : "fallback";
    document.documentElement.dataset.gooeyTrail = "ready";
    document.documentElement.dataset.gooeySurface = "idle";
    metrics.status = "ready";
    metrics.filter = layer.dataset.filter;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("blur", onDeactivate, { passive: true });
    document.addEventListener("mouseleave", onDeactivate, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    exclusions.forEach((element) => {
      element.addEventListener("pointerenter", onDeactivate, { passive: true });
    });
  };

  const disable = () => {
    if (metrics.status !== "ready") {
      document.documentElement.dataset.gooeyTrail = "disabled";
      metrics.status = "disabled";
      return;
    }

    setActive(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("blur", onDeactivate);
    document.removeEventListener("mouseleave", onDeactivate);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    exclusions.forEach((element) => {
      element.removeEventListener("pointerenter", onDeactivate);
    });
    gsap.killTweensOf(cells);
    grid.replaceChildren();
    cells.length = 0;
    metrics.cells = 0;
    metrics.status = "disabled";
    document.documentElement.dataset.gooeyTrail = "disabled";
    document.documentElement.dataset.gooeySurface = "idle";
  };

  const syncCapability = () => {
    if (finePointer.matches) enable();
    else disable();
  };

  finePointer.addEventListener("change", syncCapability);
  syncCapability();
}
