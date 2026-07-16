import "./unified-renderer.js";

const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const panels = document.querySelectorAll(".interactive-panel, .interactive-row");
  let frame = 0;
  let target;
  let x = 0;
  let y = 0;

  const render = () => {
    frame = 0;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--pointer-x", `${x - rect.left}px`);
    target.style.setProperty("--pointer-y", `${y - rect.top}px`);
  };

  panels.forEach((panel) => {
    panel.addEventListener("pointermove", (event) => {
      target = panel;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
    panel.addEventListener("pointerleave", () => {
      panel.style.removeProperty("--pointer-x");
      panel.style.removeProperty("--pointer-y");
      if (target === panel) target = undefined;
    }, { passive: true });
  });
}
