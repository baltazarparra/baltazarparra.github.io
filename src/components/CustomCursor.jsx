/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const CustomCursor = ({ reduceMotion = false }) => {
  const trailCount = 16;
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const trailDotsRef = useRef([]);
  const layerRef = useRef(null);
  const rafRef = useRef(null);
  const seedsRef = useRef(
    Array.from({ length: trailCount }, () => ({
      ox: Math.random() * 2 - 1,
      oy: Math.random() * 2 - 1,
      phase: Math.random() * Math.PI * 2
    }))
  );
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;

    if (!supportsHover || reduceMotion) {
      setEnabled(false);
      document.body.classList.remove("cursor-enabled");
      return undefined;
    }

    setEnabled(true);
    document.body.classList.add("cursor-enabled");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let trailX = x;
    let trailY = y;
    let dotScale = 1;
    let trailScale = 1;
    let targetDotScale = 1;
    let targetTrailScale = 1;
    let isVisible = false;
    const trailPositions = Array.from({ length: trailCount }, () => ({
      x,
      y
    }));

    const show = () => {
      if (!isVisible && layerRef.current) {
        layerRef.current.style.opacity = "1";
        isVisible = true;
      }
    };

    const render = () => {
      trailX += (x - trailX) * 0.16;
      trailY += (y - trailY) * 0.12;
      dotScale += (targetDotScale - dotScale) * 0.2;
      trailScale += (targetTrailScale - trailScale) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${dotScale})`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) scale(${trailScale})`;
      }

      const t = performance.now() * 0.001;
      let prevX = x;
      let prevY = y;
      for (let i = 0; i < trailCount; i++) {
        const node = trailDotsRef.current[i];
        const pos = trailPositions[i];
        const seed = seedsRef.current[i];
        const ease = Math.max(0.04, 0.18 - i * 0.008);
        pos.x += (prevX - pos.x) * ease;
        pos.y += (prevY - pos.y) * ease;
        prevX = pos.x;
        prevY = pos.y;

        if (node) {
          const tailFactor = i / (trailCount - 1);
          const wobble = Math.sin(t * 0.9 + seed.phase + i * 0.35);
          const drift = 14 * tailFactor;
          const driftX = (seed.ox * drift + wobble * 6) * 0.5;
          const driftY =
            (seed.oy * drift + Math.cos(t * 0.75 + seed.phase) * 6) * 0.5 -
            tailFactor * 10;
          const scale = Math.max(0.7, 1.5 - i * 0.035);
          const opacity = Math.max(0.02, 0.18 - i * 0.009);
          node.style.transform = `translate3d(${pos.x + driftX}px, ${pos.y + driftY}px, 0) scale(${scale})`;
          node.style.opacity = `${opacity}`;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    const handleMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      show();
    };

    const handleDown = () => {
      targetDotScale = 1.6;
      targetTrailScale = 0.9;
      if (layerRef.current) layerRef.current.classList.add("is-pressed");
    };

    const handleUp = () => {
      targetDotScale = 1;
      targetTrailScale = 1;
      if (layerRef.current) layerRef.current.classList.remove("is-pressed");
    };

    const handleLeave = () => {
      if (layerRef.current) layerRef.current.style.opacity = "0";
      isVisible = false;
    };

    const handleEnter = () => {
      show();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerenter", handleEnter);

    render();

    return () => {
      document.body.classList.remove("cursor-enabled");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerenter", handleEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} className="cursor-layer" aria-hidden="true">
      <div ref={trailRef} className="cursor-trail" />
      {Array.from({ length: trailCount }).map((_, index) => (
        <div
          key={`trail-${index}`}
          className="cursor-trail-dot"
          ref={(el) => {
            trailDotsRef.current[index] = el;
          }}
        />
      ))}
      <div ref={cursorRef} className="cursor-dot" />
    </div>
  );
};

export default CustomCursor;
