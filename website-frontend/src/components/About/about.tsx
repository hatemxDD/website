import React from 'react';
import { 
  FaThermometerHalf, FaWater, FaSun, FaWind, FaFlask, FaChartLine,
  FaArrowRight, FaMicroscope, FaLeaf
} from 'react-icons/fa';
import Footer from '../Layout/Footer';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Pioneering Research for a <span className="highlight">Sustainable Future</span></h1>
          <p>Our laboratory is dedicated to advancing scientific knowledge in energy efficiency and environmental sustainability, 
             developing innovative solutions for a better tomorrow.</p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="vision-mission">
        <div className="section-header">
          <h2>Vision & Mission</h2>
          <p>Our commitment to excellence in research and innovation</p>
        </div>
        <div className="vision-mission-grid">
          <div className="vision-card">
            <FaMicroscope className="vision-icon" />
            <h3>Our Vision</h3>
            <p>To be a global leader in sustainable energy research and environmental protection, 
               driving innovation and creating lasting positive impact for future generations.</p>
          </div>
          <div className="mission-card">
            <FaLeaf className="mission-icon" />
            <h3>Our Mission</h3>
            <p>To advance scientific knowledge through cutting-edge research, develop sustainable solutions, 
               and foster collaboration between academia, industry, and communities.</p>
          </div>
        </div>
      </section>

      {/* Research Focus Section */}
      <section className="research-focus">
        <div className="section-header">
          <h2>Research Focus</h2>
          <p>Advancing knowledge in energy and environmental sciences</p>
        </div>
        <div className="focus-content">
          <div className="focus-text">
            <p className="focus-description">
              Our laboratory is dedicated to advancing research in energy efficiency and environmental sustainability. 
              We focus on developing innovative solutions for thermal comfort, control systems, and sustainable energy applications.
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section className="research-areas">
        <div className="section-header">
          <h2>Research Areas</h2>
          <p>Exploring innovative solutions across multiple disciplines</p>
        </div>
        <div className="areas-grid">
          {[
            {
              icon: <FaThermometerHalf />,
              title: "Thermal Comfort",
              description: "Research on optimal indoor environmental quality and temperature control systems.",
            },
            {
              icon: <FaWind />,
              title: "Control Systems",
              description: "Development of intelligent automation systems for energy management.",
            },
            {
              icon: <FaSun />,
              title: "Solar Resources",
              description: "Study of solar energy technologies and photovoltaic systems.",
            },
            {
              icon: <FaWater />,
              title: "Thermo Fluidics",
              description: "Analysis of fluid dynamics and heat transfer for improved thermal management.",
            },
            {
              icon: <FaFlask />,
              title: "Environmental Sciences",
              description: "Research on environmental impact assessment and sustainable resource management.",
            },
            {
              icon: <FaChartLine />,
              title: "Simulation & Modeling",
              description: "Advanced computational methods for system analysis and optimization.",
            }
          ].map((area, index) => (
            <div key={index} className="research-area">
              <div className="area-icon">{area.icon}</div>
              <h3 className="area-title">{area.title}</h3>
              <p className="area-description">{area.description}</p>
              <a href={`/research/${index}`} className="area-link">
                Learn More <FaArrowRight />
              </a>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
