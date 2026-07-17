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

const renderFilm = () => {
  if (!film) return;
  const filmEnergy = Math.min(1, state.energy);
  const impulse = state.impulse;
  film.style.transform = [
    `translate3d(${(impulse * 3.6).toFixed(3)}px, ${(impulse * -6.4).toFixed(3)}px, 0)`,
    `rotate(${(impulse * 0.032).toFixed(4)}deg)`,
    `scale(${(1 + Math.abs(impulse) * 0.005).toFixed(5)})`,
  ].join(" ");
  film.style.opacity = (0.12 + filmEnergy * 0.025).toFixed(4);
  film.style.filter = `contrast(${(1.04 + filmEnergy * 0.14).toFixed(4)})`;
  if (filmGrain) {
    filmGrain.style.transform = `translate3d(${(impulse * 18).toFixed(3)}px, ${(impulse * -24).toFixed(3)}px, 0)`;
  }
  if (filmFiber) {
    filmFiber.style.transform = `translate3d(${(impulse * -11).toFixed(3)}px, ${(impulse * 7).toFixed(3)}px, 0)`;
  }
  if (filmWeave) {
    filmWeave.style.transform = `translate3d(${(impulse * 5).toFixed(3)}px, ${(impulse * 14).toFixed(3)}px, 0)`;
  }
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
