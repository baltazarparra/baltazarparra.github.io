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
// Touch keeps the shared scroll signal, but not the full-screen film repaint.
const dynamicFilm = window.matchMedia("(hover: hover) and (pointer: fine)");
const filmProperties = [
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
const listeners = new Set();
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

const publish = () => {
  if (dynamicFilm.matches) {
    const filmEnergy = Math.min(1, state.energy);
    const filmX = state.impulse * 3.6;
    const filmY = state.impulse * -6.4;
    const filmRotation = state.impulse * 0.032;
    const filmScale = 1 + Math.abs(state.impulse) * 0.005;
    const filmGrainX = state.impulse * 18;
    const filmGrainY = state.impulse * -24;
    const filmFiberX = state.impulse * -11;
    const filmFiberY = state.impulse * 7;
    const filmWeaveX = state.impulse * 5;
    const filmWeaveY = state.impulse * 14;
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--viewport-film-x", `${filmX.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-y", `${filmY.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-grain-x", `${filmGrainX.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-grain-y", `${filmGrainY.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-fiber-x", `${filmFiberX.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-fiber-y", `${filmFiberY.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-weave-x", `${filmWeaveX.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-weave-y", `${filmWeaveY.toFixed(3)}px`);
    rootStyle.setProperty("--viewport-film-rotate", `${filmRotation.toFixed(4)}deg`);
    rootStyle.setProperty("--viewport-film-scale", filmScale.toFixed(5));
    rootStyle.setProperty(
      "--viewport-film-opacity",
      (0.12 + filmEnergy * 0.025).toFixed(4),
    );
    rootStyle.setProperty(
      "--viewport-film-contrast",
      (1.04 + filmEnergy * 0.14).toFixed(4),
    );
  }
  listeners.forEach((listener) => listener(state));
  window.__scrollMotionMetrics = {
    rawVelocity: state.rawVelocity,
    impulse: state.impulse,
    energy: state.energy,
    direction: state.direction,
    active: state.active,
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

dynamicFilm.addEventListener("change", () => {
  if (!dynamicFilm.matches) {
    const rootStyle = document.documentElement.style;
    filmProperties.forEach((property) => rootStyle.removeProperty(property));
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
  /** @param {(state: ScrollMotionState) => void} listener */
  subscribe(listener) {
    ensureTrigger();
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  },
  getState() {
    ensureTrigger();
    return state;
  },
};
