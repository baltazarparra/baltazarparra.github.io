import { useEffect, useState } from "react";

export type QualityTier = "low" | "medium" | "high";

export interface CapabilityProfile {
  tier: QualityTier;
  animate: boolean;
  renderWebGL: boolean;
  dpr: [number, number];
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

const detectProfile = (): CapabilityProfile => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia(
    "(hover: none), (pointer: coarse)",
  ).matches;
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const constrained = memory <= 2 || cores <= 2;

  if (constrained) {
    return {
      tier: "low",
      animate: false,
      renderWebGL: false,
      dpr: [0.7, 0.9],
    };
  }

  if (coarsePointer || window.innerWidth < 768) {
    return {
      tier: "medium",
      animate: !reducedMotion && document.visibilityState === "visible",
      renderWebGL: !reducedMotion,
      dpr: [0.8, 1.1],
    };
  }

  return {
    tier: "high",
    animate: !reducedMotion && document.visibilityState === "visible",
    renderWebGL: !reducedMotion,
    dpr: [1, 1.5],
  };
};

export const useCapabilityProfile = () => {
  const [profile, setProfile] = useState<CapabilityProfile | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const update = () => setProfile(detectProfile());

    update();
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return profile;
};
