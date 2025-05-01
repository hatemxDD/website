/**
 * Home Content Component
 *
 * Main content section of the home page.
 * Features:
 * - Hero section
 * - Featured content
 * - Latest updates
 * - Call-to-action sections
 */

import "./Home.css";
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFileAlt, FaUsers, FaFlask } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const ContentHome: React.FC = () => {
  const { news, publications, projects } = useApp();

  // Get latest news (up to 3 items)
  const latestNews = news
    .slice(0, 3)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get latest publications (up to 3 items)
  const latestPublications = publications
    .slice(0, 3)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

  // Get high priority projects (up to 3 items)
  const highPriorityProjects = projects
    .filter(
      (project) =>
        project.priority === "high" && project.status === "in_progress"
    )
    .slice(0, 3);

  return (
    <div className="content-container">
      {/* Latest News Section */}
      <section className="latest-news">
        <div className="section-header">
          <h2>Latest Updates</h2>
          <p>Stay informed with our most recent announcements</p>
        </div>

        <div className="news-grid">
          {latestNews.map((item) => (
            <div key={item.id} className="news-card">
              {item.photo && (
                <div
                  className="news-image"
                  style={{ backgroundImage: `url(${item.photo})` }}
                ></div>
              )}
              <div className="news-content">
                <div className="news-date">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={`/news/${item.id}`} className="news-link">
                  Read More <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-link">
          <Link to="/news">
            View All News <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Publications Highlights */}
      <section className="publications-highlight">
        <div className="section-header">
          <h2>Recent Publications</h2>
          <p>Explore our latest research papers</p>
        </div>

        <div className="publications-list">
          {latestPublications.map((publication) => (
            <div key={publication.id} className="publication-item">
              <div className="publication-icon">
                <FaFileAlt />
              </div>
              <div className="publication-details">
                <h3>{publication.title}</h3>
                <p className="publication-authors">
                  {publication.authors.join(", ")}
                </p>
                <p className="publication-journal">
                  {publication.journal} • Impact Factor:{" "}
                  {publication.impactFactor}
                </p>
                <p className="publication-date">
                  {new Date(publication.publishDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-link">
          <Link to="/publications">
            Browse All Publications <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Priority Projects */}
      <section className="priority-projects">
        <div className="section-header">
          <h2>Key Research Initiatives</h2>
          <p>Our high-priority ongoing research projects</p>
        </div>

        <div className="projects-grid">
          {highPriorityProjects.map((project) => (
            <div key={project.id} className="project-card priority-card">
              <div className="project-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {project.progress}% Complete
                </span>
              </div>
              <div className="project-content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span className="project-dates">
                    {new Date(project.startDate).toLocaleDateString()} -
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </span>
                </div>
                <Link to={`/projects/${project.id}`} className="project-link">
                  Project Details <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Join Our Research Community</h2>
          <p>
            Collaborate with leading researchers and contribute to
            groundbreaking discoveries
          </p>
          <div className="cta-buttons">
            <Link to="/teams" className="cta-btn">
              <FaUsers className="cta-icon" />
              Meet Our Teams
            </Link>
            <Link to="/projects/apply" className="cta-btn primary">
              <FaFlask className="cta-icon" />
              Apply for Collaboration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentHome;
