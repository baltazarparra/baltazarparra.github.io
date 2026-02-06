import "./App.css";
import { useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { Lenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NoiseBackground from "./components/NoiseBackground";
import CustomCursor from "./components/CustomCursor";

// Lazy load Hero3D para melhor performance inicial
const Hero3D = lazy(() => import("./components/Hero3D"));

gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger for better performance
ScrollTrigger.config({
  limitCallbacks: true,
  syncInterval: 150,
});

function App() {
  const heroRef = useRef();
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    // Hero animation with delay to ensure DOM is ready
    const ctx = gsap.context(() => {
      gsap.from(".hero-label", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-title-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.4,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: "power3.out",
      });

      // Advanced scroll animation for ABOUT section
      const aboutTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 75%",
          end: "top 25%",
          scrub: 2,
          invalidateOnRefresh: false,
        },
      });

      aboutTimeline
        .fromTo(
          ".about-section .section-number",
          { opacity: 0, x: -50, rotate: -10 },
          { opacity: 1, x: 0, rotate: 0, duration: 0.675 },
        )
        .fromTo(
          ".about-section .section-title",
          { opacity: 0, y: 30, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          "-=0.1",
        )
        .fromTo(
          ".about-section .section-text p",
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.125,
            stagger: 0.15,
          },
          "-=0.2",
        );

      // Refined and intensified scroll animation for CONNECT section
      const connectTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".connect-section",
          start: "top 80%",
          end: "top 20%",
          scrub: 1.5,
          invalidateOnRefresh: false,
        },
      });

      connectTimeline
        .fromTo(
          ".connect-section .section-number",
          {
            opacity: 0,
            x: -80,
            rotate: -20,
            scale: 0.5,
            filter: "blur(15px)",
          },
          {
            opacity: 1,
            x: 0,
            rotate: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power3.out",
          },
        )
        .fromTo(
          ".connect-section .section-title",
          {
            opacity: 0,
            y: 50,
            scale: 0.8,
            filter: "blur(20px)",
            rotateX: -45,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotateX: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .fromTo(
          ".connect-section .connect-link",
          {
            opacity: 0,
            x: -100,
            rotateY: -25,
            rotateX: 15,
            scale: 0.7,
            filter: "blur(12px)",
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: {
              each: 0.12,
              ease: "power2.out",
            },
            ease: "power3.out",
          },
          "-=0.3",
        );

      // Add individual link hover effects with scroll trigger
      // Only on desktop for performance
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop) {
        gsap.utils.toArray(".connect-link").forEach((link, index) => {
          gsap.to(link, {
            scrollTrigger: {
              trigger: ".connect-section",
              start: "top 60%",
              end: "top 30%",
              scrub: 0.5,
            },
            "--glow-intensity": "1",
            duration: 0.3,
            delay: index * 0.05,
          });
        });
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const mainContent = (
    <main className="main-container">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-label">LEAD DEVELOPER / FULLSTACK / UX-UI</div>

          <h1 className="hero-title">
            <div className="hero-title-line hero-title-main">
                  <span className="hero-title-avatar">
                    <img
                      src="/baltz-portrait.jpg"
                      alt="Retrato de Baltz"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </span>
              <span className="hero-title-text">baltz</span>
            </div>
          </h1>

          <div className="hero-subtitle">
            Based in Brasil <br /> Currently at @
            <a
              href="https://www.thoughtworks.com/"
              target="_blank"
              rel="noreferrer"
            >
              THOUGHTWORKS
            </a>
          </div>
        </div>

        <Suspense fallback={<div style={{ width: "100%", height: "280px" }} />}>
          <Hero3D reduceMotion={prefersReducedMotion} />
        </Suspense>
      </section>

      {/* About Section */}
      <section className="section about-section">
        <div className="section-grid">
          <div className="section-number">01</div>
          <div className="section-content">
            <h2 className="section-title">ABOUT</h2>
            <div className="section-text">
              <p>
                A decade in web development, shaping interfaces and experiences
                with a focus on web development and cutting-edge technologies.
              </p>
              <p>
                Enthusiastic about genAI, with extensive agile and software
                engineering background. Collaborated with major players: Nike,
                Thoughtworks, XP Investimentos, Serasa, Dasa, MRV Construtora,
                CVC Viagens, GFT Technologies, CI&T
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="section connect-section">
        <div className="section-grid">
          <div className="section-number">02</div>
          <div className="section-content">
            <h2 className="section-title">CONNECT</h2>
            <nav className="connect-links">
              <a
                href="https://www.linkedin.com/in/baltazarparra/"
                target="_blank"
                rel="noreferrer"
                className="connect-link"
              >
                <span className="connect-link-text">LINKEDIN</span>
                <span className="connect-link-arrow">→</span>
              </a>
              <a
                href="https://github.com/baltazarparra"
                target="_blank"
                rel="noreferrer"
                className="connect-link"
              >
                <span className="connect-link-text">GITHUB</span>
                <span className="connect-link-arrow">→</span>
              </a>
              <a
                href="https://dev.to/baltz"
                target="_blank"
                rel="noreferrer"
                className="connect-link"
              >
                <span className="connect-link-text">DEV.TO</span>
                <span className="connect-link-arrow">→</span>
              </a>
              <a
                href="https://open.spotify.com/intl-pt/album/6BFeIsMZ4zcuGbs5cugxLM?si=8g7V-wvuSlyE9nC9tRoUKQ"
                target="_blank"
                rel="noreferrer"
                className="connect-link"
              >
                <span className="connect-link-text">SPOTIFY</span>
                <span className="connect-link-arrow">→</span>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-copy">© 2025 BALTAZAR PARRA</div>
        </div>
      </footer>
    </main>
  );

  return (
    <>
      <CustomCursor reduceMotion={prefersReducedMotion} />
      <NoiseBackground reduceMotion={prefersReducedMotion} />

      {prefersReducedMotion ? mainContent : <Lenis root>{mainContent}</Lenis>}
    </>
  );
}

export default App;
