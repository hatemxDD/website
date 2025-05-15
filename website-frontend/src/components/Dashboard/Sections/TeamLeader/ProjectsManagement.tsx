import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  Users,
  BadgeCheck,
  Clock,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  projectsService,
  Project,
  ProjectState,
} from "../../../../services/projectsService";
import {
  teamsService,
  Team,
  MyTeamsResponse,
} from "../../../../services/teamsService";
import { useNavigate } from "react-router-dom";

const statusLabels: Record<ProjectState, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

const ProjectsManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get teams led by the current user
        const myTeamsResponse = await teamsService.getMyTeams();

        const leadTeams = myTeamsResponse.led;

        if (leadTeams.length === 0) {
          setError("You are not leading any teams.");
          setIsLoading(false);
          return;
        }

        // Get the first team the user leads (can be expanded to select from multiple teams)
        const currentTeam = leadTeams[0];

        setTeam(currentTeam);

        // Get all projects for this team
        const teamProjects = await projectsService.getByTeam(currentTeam.id);
        

        setProjects(teamProjects);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      statusLabels[project.state]
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleAddProject = () => {
    // Navigate to add project page or open modal
    navigate("/dashboard/TeamLeader/projects/add");
  };

  const handleEditProject = (projectId: number) => {
    navigate(`/dashboard/TeamLeader/projects/edit/${projectId}`);
  };

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsService.delete(projectId);
        setProjects(projects.filter((project) => project.id !== projectId));
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getStatusIcon = (status: ProjectState) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Clock size={16} className="text-green-500" />;
      case "COMPLETED":
        return <BadgeCheck size={16} className="text-blue-500" />;
      case "ON_HOLD":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "PLANNING":
        return <Calendar size={16} className="text-purple-500" />;
      case "CANCELLED":
        return <Trash2 size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: ProjectState) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "ON_HOLD":
        return "bg-amber-100 text-amber-800";
      case "PLANNING":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
        <div>
          <h3 className="font-medium text-red-800">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-management-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {team ? `${team.name} Projects` : "Team Projects"}
        </h2>
        <button
          onClick={handleAddProject}
          className="btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Project
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="form-input pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">
            No projects found
          </h3>
          <p className="text-gray-500 mt-2">
            {searchQuery
              ? "No projects match your search criteria."
              : "Your team doesn't have any projects yet."}
          </p>
          <button
            onClick={handleAddProject}
            className="mt-4 btn-secondary flex items-center mx-auto"
          >
            <Plus size={16} className="mr-1" />
            Create First Project
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleProjectExpansion(project.id)}
              >
                <div className="flex items-center">
                  <div className="mr-3">{getStatusIcon(project.state)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {project.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full mt-1 inline-flex items-center ${getStatusBadgeClass(project.state)}`}
                    >
                      {getStatusIcon(project.state)}
                      <span className="ml-1">
                        {statusLabels[project.state]}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project.id);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-600"
                    title="Edit project"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="p-1 text-gray-500 hover:text-red-600"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {expandedProject === project.id && (
                <div className="px-4 pb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Description
                      </h4>
                      <p className="text-gray-700">
                        {project.description || "No description available"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Dates
                      </h4>
                      <div className="flex items-center text-gray-700">
                        <Calendar size={14} className="mr-1" />
                        <span>Created: {formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-700 mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span>Updated: {formatDate(project.updatedAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-700 mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          Expected End:{" "}
                          {project.expectedEndDate
                            ? formatDate(project.expectedEndDate)
                            : "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {project.team && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Team
                      </h4>
                      <div className="flex items-center text-gray-700">
                        <Users size={14} className="mr-1" />
                        <span>
                          {project.team.name} ({project.team.acro})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
