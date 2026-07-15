import "./CloudsEpSection.css";

const SPOTIFY_ALBUM_URL =
    "https://open.spotify.com/album/6BFeIsMZ4zcuGbs5cugxLM";
const SPOTIFY_EMBED_URL =
    "https://open.spotify.com/embed/album/6BFeIsMZ4zcuGbs5cugxLM?utm_source=generator&theme=0&si=2ac627b3be104ad4";

function CloudsEpSection() {
    return (
        <section className="section music-section">
            <div className="section-grid">
                <div className="section-number">06</div>
                <div className="section-content">
                    <h2 className="section-title">CLOUDS</h2>
                    <p className="music-intro">MY EP, AVAILABLE ON SPOTIFY.</p>

                    <article className="music-showcase">
                        <div className="music-showcase-copy">
                            <div className="music-eyebrow">
                                <span>ORIGINAL MUSIC</span>
                                <span>EP</span>
                            </div>

                            <p className="music-statement">
                                LISTEN TO
                                <span>CLOUDS.</span>
                            </p>

                            <a
                                href={SPOTIFY_ALBUM_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="music-link"
                            >
                                <span>OPEN ON SPOTIFY</span>
                                <span className="music-link-arrow">↗</span>
                            </a>
                        </div>

                        <div className="music-player-shell">
                            <iframe
                                className="music-player"
                                title="CLOUDS EP on Spotify"
                                src={SPOTIFY_EMBED_URL}
                                width="100%"
                                height="352"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}

export default CloudsEpSection;
