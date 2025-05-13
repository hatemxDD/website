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

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Users, 
  Beaker, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Info, 
  FileText, 
  Eye,
  Award,
  ChartBar
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const ContentHome: React.FC = () => {
  const { news, projects } = useApp();

  // Get latest news (up to 3 items)
  const latestNews = news
    .slice(0, 3)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get high priority projects (up to 4 items)
  const highPriorityProjects = projects
    .filter(
      (project) =>
        project.priority === "high" && project.status === "in_progress"
    )
    .slice(0, 4);

  // For tooltips
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Function to get progress color based on percentage
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'text-red-500';
    if (progress < 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  // Function to get progress background color
  const getProgressBgColor = (progress: number) => {
    if (progress < 30) return 'from-red-200 to-red-300';
    if (progress < 70) return 'from-amber-200 to-amber-300';
    return 'from-emerald-200 to-emerald-300';
  };

  // Function to get estimated completion
  const getEstimatedCompletion = (project: any) => {
    if (!project.endDate) return "Ongoing";
    
    const end = new Date(project.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 30) return `${diffDays} days left`;
    
    const diffMonths = Math.ceil(diffDays / 30);
    return diffMonths === 1 ? "1 month left" : `${diffMonths} months left`;
  };

  return (
    <>
      {/* Latest News Section - Redesigned */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
            Latest Updates
          </h2>
          <p className="text-sm text-secondary-600 max-w-2xl mx-auto">
            Stay informed with our most recent announcements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-secondary-100 flex flex-col h-full"
            >
              {/* Image Header */}
              <div className="relative h-40 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{ 
                    backgroundImage: item.photo 
                      ? `url(${item.photo})` 
                      : `linear-gradient(135deg, #0ea5e9, #0c4a6e)`
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
                
                {/* Date badge in bottom-right */}
                <div className="absolute bottom-3 right-3 z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-secondary-800 shadow-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-primary-600" />
                    {formatDate(item.date)}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-4 line-clamp-3 flex-grow">
                  {item.description || "Read our latest updates on research advancements, team news, and upcoming events."}
                </p>
                <div className="mt-auto pt-2 border-t border-secondary-100">
                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-secondary-50 text-primary-700 hover:bg-secondary-100 transition-all duration-200 w-full justify-center"
                  >
                    <Eye className="h-4 w-4" />
                    Read Article
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-lg hover:bg-primary-100 transition-all duration-300 group font-medium"
          >
            <FileText className="h-4 w-4" />
            View All News
            <ArrowRight className="h-4 w-4 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Key Research Initiatives - Redesigned */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
            Key Research Initiatives
          </h2>
          <p className="text-sm text-secondary-600 max-w-2xl mx-auto">
            Our high-priority ongoing research projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highPriorityProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-secondary-100 group"
            >
              <div className="p-6">
                {/* Header with title and status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors mb-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Started: {formatDate(project.startDate)}
                      </span>
                      
                      {project.endDate && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Est. completion: {formatDate(project.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium
                    ${project.progress < 30 
                      ? 'bg-red-50 text-red-700' 
                      : project.progress < 70 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-emerald-50 text-emerald-700'}`
                  }>
                    {project.progress < 30 
                      ? 'Early Phase' 
                      : project.progress < 70 
                        ? 'In Progress' 
                        : 'Advanced Stage'}
                  </div>
                </div>
                
                {/* Category & Team */}
                <div className="flex items-center gap-3 mb-5">
                  {(project as any).category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                      {(project as any).category}
                    </span>
                  )}
                  
                  {(project as any).team && (
                    <span className="inline-flex items-center text-xs text-secondary-600">
                      <Users className="h-3 w-3 mr-1" />
                      {(project as any).team}
                    </span>
                  )}
                  
                  {(project as any).awards && (
                    <span className="inline-flex items-center text-xs text-amber-600">
                      <Award className="h-3 w-3 mr-1" />
                      {(project as any).awards} {(project as any).awards > 1 ? 'awards' : 'award'}
                    </span>
                  )}
                </div>
                
                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <ChartBar className={`h-4 w-4 mr-1.5 ${getProgressColor(project.progress)}`} />
                      <span className="text-sm font-medium text-secondary-700">Project Progress</span>
                    </div>
                    <span className={`text-sm font-bold ${getProgressColor(project.progress)}`}>
                      {project.progress}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressBgColor(project.progress)} rounded-full transition-all duration-1000 ease-in-out group-hover:shadow-inner animate-pulse-slow`}
                      style={{ 
                        width: `${project.progress}%`,
                        animationDelay: `${index * 0.2}s` 
                      }}
                    />
                  </div>

                  {/* Completion estimate */}
                  <div className="text-right mt-1">
                    <span className="text-xs text-secondary-500">
                      {getEstimatedCompletion(project)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-secondary-600 line-clamp-1">
                    {project.description || "Research initiative focusing on innovative solutions for sustainable development."}
                  </p>
                  
                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary-50 text-primary-700 hover:bg-secondary-100 transition-all duration-200 whitespace-nowrap"
                  >
                    Details
                    <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link
            to="/projects/research"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-50 text-secondary-900 border border-secondary-200 rounded-lg hover:bg-secondary-100 transition-all duration-300 group font-medium"
          >
            <ChartBar className="h-4 w-4" />
            View All Research Initiatives
            <ArrowRight className="h-4 w-4 ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        
        {/* Decorative Elements */}
        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 bottom-0 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 mb-2">
                {/* Stylized collaboration icon */}
                <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                <div className="absolute inset-2 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="absolute h-full w-full animate-ping rounded-full bg-white/10 opacity-75"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-display font-bold tracking-tight sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100">
              Join Our Research Community
            </h2>
            <p className="mt-2 text-sm text-primary-100 max-w-2xl mx-auto">
              Collaborate with leading researchers and contribute to
              groundbreaking discoveries in energy and environmental science
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/teams"
                className="group flex items-center justify-center gap-2 px-5 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/10 shadow-sm hover:shadow transform hover:-translate-y-0.5"
              >
                <Users className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Meet Our Teams
              </Link>
              <Link
                to="/projects/apply"
                className="group flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Beaker className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Apply for Collaboration
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContentHome;
