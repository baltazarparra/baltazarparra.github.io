import { writingPosts } from "../data/homeContent";

const postDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

function formatPostDate(publishedAt) {
    return postDateFormatter.format(new Date(`${publishedAt}T00:00:00Z`));
}

function LatestPostsSection() {
    return (
        <section className="section writing-section">
            <div className="section-grid">
                <div className="section-number">02</div>
                <div className="section-content">
                    <h2 className="section-title">WRITING</h2>

                    <div className="writing-list">
                        {writingPosts.map((post) => (
                            <article className="writing-item" key={post.url}>
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="writing-link"
                                >
                                    <div className="writing-meta">
                                        <span className="writing-chip">
                                            {post.category}
                                        </span>
                                        <span>{formatPostDate(post.publishedAt)}</span>
                                        <span>
                                            {post.readingTimeMinutes} min read
                                        </span>
                                    </div>

                                    <div className="writing-body">
                                        <h3 className="writing-item-title">
                                            {post.title}
                                        </h3>
                                        <span className="writing-item-arrow">
                                            READ POST
                                        </span>
                                    </div>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LatestPostsSection;
