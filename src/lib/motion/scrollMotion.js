import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * @typedef {object} ScrollMotionState
 * @property {number} rawVelocity
 * @property {number} impulse
 * @property {number} targetImpulse
 * @property {number} energy
 * @property {number} direction
 * @property {boolean} active
 */

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const frameDuration = 1000 / 60;
const film = document.querySelector("[data-viewport-film]");
const filmGrain = film?.querySelector('[data-film-layer="grain"]');
const filmFiber = film?.querySelector('[data-film-layer="fiber"]');
const filmWeave = film?.querySelector('[data-film-layer="weave"]');
const desktopFilm = window.matchMedia("(hover: hover) and (pointer: fine)");
const desktopFilmProperties = [
  "--viewport-film-x",
  "--viewport-film-y",
  "--viewport-film-grain-x",
  "--viewport-film-grain-y",
  "--viewport-film-fiber-x",
  "--viewport-film-fiber-y",
  "--viewport-film-weave-x",
  "--viewport-film-weave-y",
  "--viewport-film-rotate",
  "--viewport-film-scale",
  "--viewport-film-opacity",
  "--viewport-film-contrast",
];

/** @type {Set<(state: ScrollMotionState) => void>} */
const readListeners = new Set();
/** @type {Set<(state: ScrollMotionState) => void>} */
const writeListeners = new Set();
/** @type {ScrollMotionState} */
const state = {
  rawVelocity: 0,
  impulse: 0,
  targetImpulse: 0,
  energy: 0,
  direction: 1,
  active: false,
};

let frame = 0;
let lastFrameAt = 0;
let trigger;

const filmValues = () => {
  const filmEnergy = Math.min(1, state.energy);
  const impulse = state.impulse;
  return {
    x: impulse * 3.6,
    y: impulse * -6.4,
    rotation: impulse * 0.032,
    scale: 1 + Math.abs(impulse) * 0.005,
    grainX: impulse * 18,
    grainY: impulse * -24,
    fiberX: impulse * -11,
    fiberY: impulse * 7,
    weaveX: impulse * 5,
    weaveY: impulse * 14,
    opacity: 0.12 + filmEnergy * 0.025,
    contrast: 1.04 + filmEnergy * 0.14,
  };
};

const renderDesktopFilm = (values) => {
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--viewport-film-x", `${values.x.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-y", `${values.y.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-grain-x", `${values.grainX.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-grain-y", `${values.grainY.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-fiber-x", `${values.fiberX.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-fiber-y", `${values.fiberY.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-weave-x", `${values.weaveX.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-weave-y", `${values.weaveY.toFixed(3)}px`);
  rootStyle.setProperty("--viewport-film-rotate", `${values.rotation.toFixed(4)}deg`);
  rootStyle.setProperty("--viewport-film-scale", values.scale.toFixed(5));
  rootStyle.setProperty("--viewport-film-opacity", values.opacity.toFixed(4));
  rootStyle.setProperty("--viewport-film-contrast", values.contrast.toFixed(4));
};

const renderMobileFilm = (values) => {
  if (!film) return;
  film.style.transform = [
    `translate3d(${values.x.toFixed(3)}px, ${values.y.toFixed(3)}px, 0)`,
    `rotate(${values.rotation.toFixed(4)}deg)`,
    `scale(${values.scale.toFixed(5)})`,
  ].join(" ");
  film.style.opacity = values.opacity.toFixed(4);
  film.style.filter = `contrast(${values.contrast.toFixed(4)})`;
  if (filmGrain) {
    filmGrain.style.transform = `translate3d(${values.grainX.toFixed(3)}px, ${values.grainY.toFixed(3)}px, 0)`;
  }
  if (filmFiber) {
    filmFiber.style.transform = `translate3d(${values.fiberX.toFixed(3)}px, ${values.fiberY.toFixed(3)}px, 0)`;
  }
  if (filmWeave) {
    filmWeave.style.transform = `translate3d(${values.weaveX.toFixed(3)}px, ${values.weaveY.toFixed(3)}px, 0)`;
  }
};

const renderFilm = () => {
  const values = filmValues();
  if (desktopFilm.matches) renderDesktopFilm(values);
  else renderMobileFilm(values);
};

const publish = () => {
  // Geometry consumers read first; film and bend DOM writes follow as one phase.
  readListeners.forEach((listener) => listener(state));
  renderFilm();
  writeListeners.forEach((listener) => listener(state));
  window.__scrollMotionMetrics = {
    rawVelocity: state.rawVelocity,
    impulse: state.impulse,
    energy: state.energy,
    direction: state.direction,
    active: state.active,
    filmMode: desktopFilm.matches ? "pseudo" : "element",
  };
};

const settle = (time) => {
  frame = 0;
  const elapsed = lastFrameAt > 0
    ? Math.min(100, Math.max(frameDuration, time - lastFrameAt))
    : frameDuration;
  const elapsedFrames = elapsed / frameDuration;
  const response = 1 - Math.pow(0.84, elapsedFrames);
  lastFrameAt = time;

  state.impulse += (state.targetImpulse - state.impulse) * response;
  state.targetImpulse *= Math.pow(0.84, elapsedFrames);
  state.rawVelocity *= Math.pow(0.78, elapsedFrames);
  state.energy = Math.max(Math.abs(state.impulse), Math.abs(state.targetImpulse));
  state.active = state.energy > 0.002 || Math.abs(state.targetImpulse) > 0.002;
  const motionState = state.active ? "active" : "idle";
  if (document.documentElement.dataset.scrollMotion !== motionState) {
    document.documentElement.dataset.scrollMotion = motionState;
  }
  publish();

  if (state.active && !document.hidden) frame = requestAnimationFrame(settle);
  else lastFrameAt = 0;
};

const requestSettle = () => {
  if (!frame && !document.hidden) frame = requestAnimationFrame(settle);
};

desktopFilm.addEventListener("change", () => {
  const rootStyle = document.documentElement.style;
  if (!desktopFilm.matches) {
    desktopFilmProperties.forEach((property) => rootStyle.removeProperty(property));
  } else if (film) {
    ["transform", "opacity", "filter"]
      .forEach((property) => film.style.removeProperty(property));
    [filmGrain, filmFiber, filmWeave].forEach((layer) => {
      layer?.style.removeProperty("transform");
    });
  }
  publish();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.active) requestSettle();
});

const updateVelocity = (velocity) => {
  state.rawVelocity = velocity;
  if (Math.abs(velocity) >= 48) state.direction = Math.sign(velocity);
  state.targetImpulse = clamp(velocity / 1_400, -1, 1);
  requestSettle();
};

const ensureTrigger = () => {
  if (trigger) return;
  trigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => updateVelocity(self.getVelocity()),
    onRefresh: () => requestSettle(),
  });
};

export const scrollMotion = {
  /**
   * @param {(state: ScrollMotionState) => void} listener
   * @param {{ phase?: "read" | "write" }} [options]
   */
  subscribe(listener, { phase = "write" } = {}) {
    ensureTrigger();
    const listeners = phase === "read" ? readListeners : writeListeners;
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  },
  getState() {
    ensureTrigger();
    return state;
  },
};
