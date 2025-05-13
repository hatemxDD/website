import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Leaf, 
  ExternalLink, 
  FolderTree, 
  Droplets, 
  Battery,
  Lightbulb, 
  Recycle,
  ExternalLink as LinkIcon
} from "lucide-react";
import ContentHome from "./ContentHome";

const Home: React.FC = () => {
  const featuredProjects = [
    {
      id: 1,
      title: "Renewable Energy Integration",
      description:
        "Developing smart grid solutions for seamless integration of renewable energy sources.",
      category: "Energy",
      image: "/images/project-renewable.jpg",
      color: "primary",
      icon: <Battery className="h-4 w-4" />
    },
    {
      id: 2,
      title: "Carbon Capture Technologies",
      description:
        "Innovative approaches to capture and store carbon dioxide from industrial processes.",
      category: "Environment",
      image: "/images/project-carbon.jpg",
      color: "accent",
      icon: <FolderTree className="h-4 w-4" />
    },
    {
      id: 3,
      title: "Sustainable Materials",
      description:
        "Researching biodegradable materials for industrial applications.",
      category: "Materials",
      image: "/images/project-materials.jpg",
      color: "secondary",
      icon: <Droplets className="h-4 w-4" />
    },
    {
      id: 4,
      title: "Water Purification Systems",
      description:
        "Advanced filtration technologies for clean water access in remote regions.",
      category: "Water",
      image: "/images/project-water.jpg",
      color: "primary",
      icon: <Droplets className="h-4 w-4" />
    },
  ];

  const researchAreas = [
    {
      id: 1,
      title: "Energy Innovation",
      description: "Developing next-generation energy technologies for a sustainable future",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "primary",
    },
    {
      id: 2,
      title: "Environmental Protection",
      description: "Creating solutions to preserve and restore our natural ecosystems",
      icon: <Shield className="h-5 w-5" />,
      color: "accent",
    },
    {
      id: 3,
      title: "Sustainable Solutions",
      description: "Designing practical approaches to address climate change challenges",
      icon: <Recycle className="h-5 w-5" />,
      color: "secondary",
    },
    {
      id: 4,
      title: "Clean Technology",
      description: "Advancing innovative clean tech solutions for industrial applications",
      icon: <Zap className="h-5 w-5" />,
      color: "primary",
    },
    {
      id: 5,
      title: "Resource Conservation",
      description: "Optimizing resource usage through advanced research and innovation",
      icon: <Leaf className="h-5 w-5" />,
      color: "accent",
    },
    {
      id: 6,
      title: "Water Management",
      description: "Developing sustainable approaches to water conservation and purification",
      icon: <Droplets className="h-5 w-5" />,
      color: "secondary",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white mb-6 shadow-xl">
        {/* Abstract Grid Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/60 via-transparent to-accent-500/30 animate-pulse-slow" />
        
        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[url('/img/wave-pattern.svg')] bg-repeat-x bg-bottom opacity-10" />
        
        <div className="relative px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight sm:text-4xl lg:text-6xl leading-tight">
              Research Excellence in{" "}
              <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent relative">
                Energy & Environment
                <svg className="absolute -bottom-1 left-0 w-full h-1 text-accent-400/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0,0 Q50,10 100,0 L100,10 L0,10 Z"></path>
                </svg>
              </span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Advancing sustainable solutions for a cleaner, more efficient future 
              through cutting-edge research and innovation.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/about"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
              >
                Explore Our Research
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3 bg-primary-800/60 text-white border border-white/20 rounded-lg hover:bg-primary-700/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Get in Touch
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas Section - Redesigned */}
      <section className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/50 to-secondary-100/30 rounded-xl -z-10"></div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
            Our Research Areas
          </h2>
          <p className="text-sm text-secondary-600 max-w-2xl mx-auto">
            Pioneering breakthroughs in energy and environmental sciences
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchAreas.map((area) => (
            <div 
              key={area.id}
              className="relative group overflow-hidden rounded-lg bg-white shadow-sm border border-secondary-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-secondary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-5 flex items-start gap-4">
                <div className={`p-3 rounded-lg flex-shrink-0 bg-${area.color}-100 text-${area.color}-600 group-hover:bg-${area.color}-500 group-hover:text-white shadow-sm transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                  {area.icon}
                </div>
                <div>
                  <h3 className={`text-base font-semibold mb-1 text-${area.color}-700 group-hover:text-${area.color}-600 transition-colors`}>
                    {area.title}
                  </h3>
                  <p className="text-sm text-secondary-500 line-clamp-2 mb-2">
                    {area.description}
                  </p>
                  <Link 
                    to={`/research/${area.id}`} 
                    className={`inline-flex items-center text-xs font-medium text-${area.color}-600 hover:text-${area.color}-700 group-hover:underline`}
                  >
                    Learn more 
                    <ArrowRight className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section - Redesigned */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
            Featured Projects
          </h2>
          <p className="text-sm text-secondary-600 max-w-2xl mx-auto">
            Discover our cutting-edge research initiatives
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-secondary-100"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Project Image */}
                <div className="relative md:w-1/3 h-40 md:h-auto overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500 ease-out"
                    style={{ 
                      backgroundImage: project.image ? `url(${project.image})` : `linear-gradient(to right, var(--tw-gradient-stops))`,
                      '--tw-gradient-from': `#${project.color === 'primary' ? '0ea5e9' : project.color === 'accent' ? '10b981' : '64748b'}`,
                      '--tw-gradient-to': `#${project.color === 'primary' ? '0369a1' : project.color === 'accent' ? '047857' : '334155'}`,
                      '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
                    } as React.CSSProperties}
                  >
                    {!project.image && (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="h-12 w-12 opacity-30">
                          {project.icon}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 py-1 px-2 rounded-full text-xs font-medium
                      ${project.color === 'primary' 
                        ? 'bg-primary-100 text-primary-700' 
                        : project.color === 'accent' 
                          ? 'bg-accent-100 text-accent-700' 
                          : 'bg-secondary-100 text-secondary-700'}`
                    }>
                      {project.icon}
                      {project.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col flex-grow justify-between md:w-2/3">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-4">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <Link
                      to={`/projects/${project.id}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        ${project.color === 'primary' 
                          ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' 
                          : project.color === 'accent' 
                            ? 'bg-accent-50 text-accent-700 hover:bg-accent-100' 
                            : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'}`
                      }
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 hover:bg-secondary-100 transition-all duration-300 group"
          >
            View All Projects
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Dynamic Content */}
      <ContentHome />
    </div>
  );
};

export default Home;
