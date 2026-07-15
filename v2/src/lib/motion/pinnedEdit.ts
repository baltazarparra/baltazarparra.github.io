import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const settle = (
  targets: gsap.TweenTarget,
  trigger: Element,
  start = "top 78%",
) =>
  gsap.from(targets, {
    y: 24,
    duration: 0.78,
    stagger: 0.06,
    ease: "power3.out",
    clearProps: "transform",
    scrollTrigger: {
      trigger,
      start,
      toggleActions: "play none none reverse",
    },
  });

export const initPinnedEdit = () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const media = gsap.matchMedia();

  const context = gsap.context(() => {
    if (reducedMotion) {
      gsap.set(".thermal-cut", { clipPath: "none" });
      return;
    }

    document.querySelectorAll<HTMLElement>(".settle-scene").forEach((scene) => {
      settle(scene.querySelectorAll(".settle-item"), scene);
    });

    const projects = document.querySelector<HTMLElement>(".projects");
    const lead = document.querySelector<HTMLElement>(".project-lead");
    const entries = gsap.utils.toArray<HTMLElement>(".project-entry");

    if (projects && lead) {
      media.add(
        "(min-width: 48.0625rem) and (hover: hover) and (pointer: fine)",
        () => {
          ScrollTrigger.create({
            trigger: projects,
            start: "top top+=112",
            end: () =>
              `+=${Math.max(
                window.innerHeight,
                projects.offsetHeight - window.innerHeight * 0.6,
              )}`,
            pin: lead,
            pinSpacing: false,
            anticipatePin: 1,
          });

          entries.forEach((entry) => {
            gsap.fromTo(
              entry,
              { y: 56, scale: 0.965 },
              {
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

          return () => gsap.set(entries, { clearProps: "all" });
        },
      );

      media.add(
        "(max-width: 48rem), (hover: none), (pointer: coarse)",
        () => {
          settle(lead, projects, "top 82%");
          entries.forEach((entry) => settle(entry, entry, "top 86%"));
        },
      );
    }

    gsap.fromTo(
      ".thermal-cut",
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.65,
        ease: "power3.inOut",
        clearProps: "clipPath",
        scrollTrigger: {
          trigger: ".thermal-cut",
          start: "top 84%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  ScrollTrigger.refresh();

  return () => {
    media.revert();
    context.revert();
  };
};
