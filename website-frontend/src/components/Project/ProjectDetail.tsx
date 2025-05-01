import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaUser, FaTag, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // This would typically come from an API or database
  const project = {
    id: 1,
    title: "Computer Vision AI",
    description: "Our Computer Vision AI project focuses on developing advanced object detection and recognition systems. The project combines deep learning techniques with traditional computer vision approaches to achieve state-of-the-art results in various applications.",
    longDescription: `Our Computer Vision AI project represents a significant advancement in the field of artificial intelligence and computer vision. The project focuses on developing sophisticated algorithms and systems that can accurately detect, recognize, and analyze objects in real-time.

Key Features:
• Advanced object detection using deep learning models
• Real-time video processing capabilities
• Multi-object tracking and recognition
• Integration with existing surveillance systems
• Custom training for specific use cases

The project has achieved remarkable results in various applications, including:
• Security and surveillance
• Autonomous vehicles
• Medical imaging
• Industrial automation
• Retail analytics

Our team has developed proprietary algorithms that significantly improve accuracy while reducing computational requirements, making the system more efficient and practical for real-world applications.`,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80",
    date: "March 15, 2024",
    author: "Dr. Sarah Johnson",
    category: "Computer Vision",
    technologies: ["Python", "TensorFlow", "OpenCV", "PyTorch"],
    githubLink: "https://github.com/example/project",
    demoLink: "https://demo.example.com/project",
    team: [
      { name: "Dr. Sarah Johnson", role: "Project Lead" },
      { name: "Dr. Michael Chen", role: "Senior Researcher" },
      { name: "Dr. Emily Rodriguez", role: "AI Specialist" }
    ]
  };

  return (
    <div className="project-detail">
      <div className="project-header">
        <Link to="/" className="back-button">
          <FaArrowLeft className="arrow-icon" />
          Back to Home
        </Link>
        <div className="project-meta">
          <span className="meta-item">
            <FaCalendar className="meta-icon" />
            {project.date}
          </span>
          <span className="meta-item">
            <FaUser className="meta-icon" />
            {project.author}
          </span>
          <span className="meta-item">
            <FaTag className="meta-icon" />
            {project.category}
          </span>
        </div>
      </div>

      <div className="project-content">
        <div className="project-image">
          <img src={project.image} alt={project.title} />
        </div>

        <div className="project-info">
          <h1>{project.title}</h1>
          <p className="project-description">{project.description}</p>

          <div className="project-technologies">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="project-links">
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
              <FaGithub className="link-icon" />
              View on GitHub
            </a>
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link">
              <FaExternalLinkAlt className="link-icon" />
              Live Demo
            </a>
          </div>

          <div className="project-team">
            <h3>Research Team</h3>
            <div className="team-grid">
              {project.team.map((member, index) => (
                <div key={index} className="team-member">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="project-details">
            <h3>Project Details</h3>
            <div className="details-content">
              {project.longDescription.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 