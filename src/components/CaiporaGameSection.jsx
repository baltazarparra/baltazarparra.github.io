/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "./CaiporaGameSection.css";

const CAIPORA_URL = "https://baltazarparra.github.io/caipora/";
const CAIPORA_SPRITE_URL =
    "https://baltazarparra.github.io/caipora/assets/sprites/caipora_idle_strip.png";

function CaiporaGameSection({ reduceMotion = false }) {
    const spriteRef = useRef(null);

    useEffect(() => {
        const sprite = spriteRef.current;
        if (!sprite || reduceMotion) return undefined;

        const idleFrames = 5;
        const lastFrame = 6;
        const idleMs = 1000 / 5;
        const blinkMs = 1000 / 12;
        const blinkMinMs = 3000;
        const blinkMaxMs = 6500;

        let idleFrame = 0;
        let blinkAt = 0;
        let timeoutId;
        let isRunning = false;
        let isInView = false;

        const showFrame = (frame) => {
            sprite.style.backgroundPositionX = `${(frame / lastFrame) * 100}%`;
        };

        const scheduleBlink = () => {
            blinkAt =
                Date.now() +
                blinkMinMs +
                Math.random() * (blinkMaxMs - blinkMinMs);
        };

        const playIdle = () => {
            if (!isRunning) return;

            if (Date.now() >= blinkAt) {
                showFrame(5);
                timeoutId = window.setTimeout(() => {
                    if (!isRunning) return;
                    showFrame(6);
                    timeoutId = window.setTimeout(() => {
                        if (!isRunning) return;
                        scheduleBlink();
                        playIdle();
                    }, blinkMs);
                }, blinkMs);
                return;
            }

            showFrame(idleFrame);
            idleFrame = (idleFrame + 1) % idleFrames;
            timeoutId = window.setTimeout(playIdle, idleMs);
        };

        const stopAnimation = () => {
            isRunning = false;
            window.clearTimeout(timeoutId);
        };

        const startAnimation = () => {
            if (
                isRunning ||
                !isInView ||
                document.visibilityState !== "visible"
            ) {
                return;
            }

            isRunning = true;
            scheduleBlink();
            playIdle();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                startAnimation();
            } else {
                stopAnimation();
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isInView = entry.isIntersecting;
                if (isInView) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            },
            { rootMargin: "160px 0px", threshold: 0.1 },
        );

        observer.observe(sprite);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            stopAnimation();
            observer.disconnect();
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [reduceMotion]);

    return (
        <section className="section game-section">
            <div className="section-grid">
                <div className="section-number">04</div>
                <div className="section-content">
                    <article className="game-showcase">
                        <div className="game-showcase-copy">
                            <div className="game-eyebrow">
                                <span>ORIGINAL GAME</span>
                                <span>PLAY IN BROWSER</span>
                            </div>

                            <h2 className="section-title game-title">CAIPORA</h2>
                            <p className="game-kicker">
                                THE GUARDIAN OF THE FOREST HAS AWAKENED.
                            </p>
                            <p className="game-description">
                                A Brazilian folk-horror roguelike where precise
                                timing, procedural runs and every hard-earned
                                hit decide who survives the forest.
                            </p>

                            <ul className="game-features" aria-label="Game features">
                                <li>Turn-based combat + action commands</li>
                                <li>Procedural roguelike runs</li>
                                <li>Brazilian folk horror</li>
                            </ul>

                            <a
                                href={CAIPORA_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="game-link"
                            >
                                <span>PLAY CAIPORA</span>
                                <span className="game-link-arrow">→</span>
                            </a>
                        </div>

                        <div
                            className="game-visual"
                            role="img"
                            aria-label="Animated pixel-art protagonist from Caipora"
                        >
                            <div className="game-character-stage">
                                <div
                                    ref={spriteRef}
                                    className="game-character"
                                    style={{ backgroundImage: `url(${CAIPORA_SPRITE_URL})` }}
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="game-visual-label">
                                <span>01 PLAYER</span>
                                <span>THE FOREST IS WATCHING</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

export default CaiporaGameSection;
