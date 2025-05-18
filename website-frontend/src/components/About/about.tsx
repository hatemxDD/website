import React from "react";
import {
  FaThermometerHalf,
  FaWater,
  FaSun,
  FaWind,
  FaFlask,
  FaChartLine,
  FaArrowRight,
  FaMicroscope,
  FaLeaf,
} from "react-icons/fa";
import Footer from "../Layout/Footer";
import "./About.css";

const About: React.FC = () => {
  return (
    <>
      <div className="about-container dark:bg-gray-800">
        {/* Hero Section */}
        <section className="about-hero dark:bg-gray-900">
          <div className="hero-overlay dark:opacity-60"></div>
          <div className="about-hero-content dark:text-white">
            <h1>
              Pioneering Research for a{" "}
              <span className="highlight dark:text-blue-400">
                Sustainable Future
              </span>
            </h1>
            <p className="dark:text-gray-300">
              Our laboratory is dedicated to advancing scientific knowledge in
              energy efficiency and environmental sustainability, developing
              innovative solutions for a better tomorrow.
            </p>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="vision-mission dark:bg-gray-800">
          <div className="section-header">
            <h2 className="dark:text-white">Vision & Mission</h2>
            <p className="dark:text-gray-300">
              Our commitment to excellence in research and innovation
            </p>
          </div>
          <div className="vision-mission-grid">
            <div className="vision-card dark:bg-gray-700 dark:border-gray-600">
              <FaMicroscope className="vision-icon dark:text-blue-400" />
              <h3 className="dark:text-white">Our Vision</h3>
              <p className="dark:text-gray-300">
                To be a global leader in sustainable energy research and
                environmental protection, driving innovation and creating
                lasting positive impact for future generations.
              </p>
            </div>
            <div className="mission-card dark:bg-gray-700 dark:border-gray-600">
              <FaLeaf className="mission-icon dark:text-green-400" />
              <h3 className="dark:text-white">Our Mission</h3>
              <p className="dark:text-gray-300">
                To advance scientific knowledge through cutting-edge research,
                develop sustainable solutions, and foster collaboration between
                academia, industry, and communities.
              </p>
            </div>
          </div>
        </section>

        {/* Research Focus Section */}
        <section className="research-focus dark:bg-gray-900">
          <div className="section-header">
            <h2 className="dark:text-white">Research Focus</h2>
            <p className="dark:text-gray-300">
              Advancing knowledge in energy and environmental sciences
            </p>
          </div>
          <div className="focus-content">
            <div className="focus-text">
              <p className="focus-description dark:text-gray-300">
                Our laboratory is dedicated to advancing research in energy
                efficiency and environmental sustainability. We focus on
                developing innovative solutions for thermal comfort, control
                systems, and sustainable energy applications.
              </p>
            </div>
          </div>
        </section>

        {/* Research Areas Section */}
        <section className="research-areas dark:bg-gray-800">
          <div className="section-header">
            <h2 className="dark:text-white">Research Areas</h2>
            <p className="dark:text-gray-300">
              Exploring innovative solutions across multiple disciplines
            </p>
          </div>
          <div className="areas-grid">
            {[
              {
                icon: <FaThermometerHalf />,
                title: "Thermal Comfort",
                description:
                  "Research on optimal indoor environmental quality and temperature control systems.",
              },
              {
                icon: <FaWind />,
                title: "Control Systems",
                description:
                  "Development of intelligent automation systems for energy management.",
              },
              {
                icon: <FaSun />,
                title: "Solar Resources",
                description:
                  "Study of solar energy technologies and photovoltaic systems.",
              },
              {
                icon: <FaWater />,
                title: "Thermo Fluidics",
                description:
                  "Analysis of fluid dynamics and heat transfer for improved thermal management.",
              },
              {
                icon: <FaFlask />,
                title: "Environmental Sciences",
                description:
                  "Research on environmental impact assessment and sustainable resource management.",
              },
              {
                icon: <FaChartLine />,
                title: "Simulation & Modeling",
                description:
                  "Advanced computational methods for system analysis and optimization.",
              },
            ].map((area, index) => (
              <div
                key={index}
                className="research-area dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="area-icon dark:text-blue-400">{area.icon}</div>
                <h3 className="area-title dark:text-white">{area.title}</h3>
                <p className="area-description dark:text-gray-300">
                  {area.description}
                </p>
                <a
                  href={`/research/${index}`}
                  className="area-link dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Learn More <FaArrowRight />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
