import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./Home.css";
import ContentHome from "./ContentHome";

const Home: React.FC = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Renewable Energy Integration",
      description:
        "Developing smart grid solutions for seamless integration of renewable energy sources.",
      category: "Energy",
    },
    {
      id: 2,
      title: "Carbon Capture Technologies",
      description:
        "Innovative approaches to capture and store carbon dioxide from industrial processes.",
      category: "Environment",
    },
    {
      id: 3,
      title: "Sustainable Materials",
      description:
        "Researching biodegradable materials for industrial applications.",
      category: "Materials",
    },
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Research Excellence in{" "}
            <span className="highlight">Energy & Environment</span>
          </h1>
          <p className="hero-subtitle">
            Advancing sustainable solutions for a cleaner, more efficient future
          </p>
          <div className="hero-buttons">
            <Link to="/about" className="btn btn-primary">
              Explore Our Research <FaArrowRight className="btn-icon" />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <section className="research-areas">
        <div className="section-header">
          <h2>Our Research Areas</h2>
          <p>Pioneering breakthroughs in energy and environmental sciences</p>
        </div>
        <div className="research-cards">
          <div className="research-card">
            <h3>Energy Innovation</h3>
            <p>
              Developing next-generation energy technologies for a sustainable
              future
            </p>
          </div>
          <div className="research-card">
            <h3>Environmental Protection</h3>
            <p>
              Creating solutions to preserve and restore our natural ecosystems
            </p>
          </div>
          <div className="research-card">
            <h3>Sustainable Solutions</h3>
            <p>
              Designing practical approaches to address climate change
              challenges
            </p>
          </div>
        </div>
      </section>

      <section className="featured-projects">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p>Discover our cutting-edge research initiatives</p>
        </div>
        <div className="projects-grid">
          {featuredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-content">
                <div className="project-category">{project.category}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Link to={`/projects/${project.id}`} className="project-link">
                  Learn More <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Include the ContentHome component to display dynamic content */}
      <ContentHome />
    </div>
  );
};

export default Home;
