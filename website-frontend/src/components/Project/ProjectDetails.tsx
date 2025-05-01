import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Microscope, Brain, Users, Clock, Beaker } from 'lucide-react';
import './ProjectDetails.css';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  features: string[];
  team: string[];
  duration: string;
  status: string;
}

interface Projects {
  [key: string]: Project;
}

function ProjectDetails() {
  const { id } = useParams();

  const projects: Projects = {
    'alpha': {
      title: "Research Project Alpha",
      description: "A groundbreaking research initiative focused on developing novel approaches to molecular analysis using advanced AI algorithms and cutting-edge laboratory equipment. This project combines traditional wet lab techniques with computational methods to unlock new possibilities in biotechnology research.",
      technologies: ["Spectroscopy", "Machine Learning", "Chromatography", "Data Analysis", "Molecular Modeling"],
      images: [
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800"
      ],
      features: [
        "Advanced molecular analysis protocols",
        "Real-time data processing",
        "Automated sample handling",
        "AI-powered result interpretation",
        "Cross-validation methodology",
        "Comprehensive documentation system"
      ],
      team: ["Dr. Sarah Johnson", "Prof. Mike Chen", "Dr. Emma Davis"],
      duration: "18 months",
      status: "Active Research"
    },
    'beta': {
      title: "Laboratory Beta",
      description: "An innovative research project exploring the intersection of biochemistry and artificial intelligence, focusing on protein folding prediction and drug discovery applications.",
      technologies: ["Protein Analysis", "Deep Learning", "Mass Spectrometry", "Molecular Dynamics", "Cloud Computing"],
      images: [
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800"
      ],
      features: [
        "Protein structure prediction",
        "Automated screening process",
        "Virtual compound library",
        "Machine learning models",
        "Real-time collaboration tools"
      ],
      team: ["Dr. Alex Wong", "Prof. Lisa Park", "Dr. David Miller"],
      duration: "24 months",
      status: "In Progress"
    },
    'gamma': {
      title: "Study Gamma",
      description: "A comprehensive research study investigating novel therapeutic approaches using advanced microscopy and cell culture techniques, combined with machine learning for image analysis.",
      technologies: ["Cell Culture", "Microscopy", "Image Analysis", "Bioinformatics", "Statistical Analysis"],
      images: [
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800"
      ],
      features: [
        "High-resolution imaging",
        "Automated cell tracking",
        "Data visualization tools",
        "Statistical analysis pipeline",
        "Collaborative research platform"
      ],
      team: ["Dr. Rachel Green", "Prof. Tom Anderson", "Dr. Maria Garcia"],
      duration: "15 months",
      status: "Data Analysis"
    }
  };

  const project = id ? projects[id] : null;

  if (!project) {
    return (
      <div className="project-details">
        <div className="content-container" style={{ padding: "3rem", textAlign: "center" }}>
          <h2 className="section-title">Project not found</h2>
          <Link to="/group-details" className="back-link">
            <ArrowLeft />
            Return to Research Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details">
      <div className="container">
        <Link to="/group-details" className="back-link">
          <ArrowLeft />
          Back to Research Projects
        </Link>

        <div className="content-container">
          <header className="project-header">
            <div className="header-content">
              <h1 className="project-title">{project.title}</h1>
              <span className="status-badge">{project.status}</span>
            </div>
          </header>

          <div className="project-content">
            <div className="content-grid">
              <div className="main-content">
                <section>
                  <h2 className="section-title">
                    <FlaskConical />
                    Research Overview
                  </h2>
                  <p className="overview-text">{project.description}</p>
                </section>

                <section>
                  <h2 className="section-title">
                    <Microscope />
                    Laboratory Documentation
                  </h2>
                  <div className="gallery-grid">
                    {project.images.map((image, index) => (
                      <div key={index} className="gallery-image">
                        <img src={image} alt={`${project.title} documentation ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="section-title">
                    <Brain />
                    Research Features
                  </h2>
                  <ul className="features-list">
                    {project.features.map((feature, index) => (
                      <li key={index} className="feature-item">{feature}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="sidebar">
                <section>
                  <h2 className="section-title">
                    <Beaker />
                    Technologies & Methods
                  </h2>
                  <div className="tech-tags">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="section-title">
                    <Users />
                    Research Team
                  </h2>
                  <ul className="team-list">
                    {project.team.map((member, index) => (
                      <li key={index} className="team-member">
                        <div className="member-avatar">
                          {member.split(' ')[1][0]}
                        </div>
                        {member}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>

          <div className="project-meta">
            <div className="meta-item">
              <Clock className="meta-icon" />
              <span className="meta-label">Research Duration:</span>
              <span className="meta-value">{project.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;