import { featuredProjects } from "../data/homeContent";

function FeaturedProjectsSection() {
    return (
        <section className="section projects-section">
            <div className="section-grid">
                <div className="section-number">03</div>
                <div className="section-content">
                    <h2 className="section-title">PROJECTS</h2>
                    <p className="section-intro">
                        Three selected builds spanning protocol design,
                        experimental interaction, and web3 product work.
                    </p>

                    <div className="projects-grid">
                        {featuredProjects.map((project) => (
                            <article className="project-card" key={project.url}>
                                <div className="project-card-meta">
                                    <span className="project-chip">
                                        {project.category}
                                    </span>
                                </div>

                                <h3 className="project-title">
                                    {project.name}
                                </h3>
                                <p className="project-description">
                                    {project.description}
                                </p>

                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="project-link"
                                >
                                    <span>VIEW ON GITHUB</span>
                                    <span className="project-link-arrow">→</span>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedProjectsSection;
