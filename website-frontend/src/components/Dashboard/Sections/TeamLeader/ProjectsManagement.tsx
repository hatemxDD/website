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
  ChevronDown,
  ChevronUp,
  Check,
  X,
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
  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const [statusNotification, setStatusNotification] = useState<{
    projectId: number;
    message: string;
  } | null>(null);

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
    // Toggle the status edit dropdown
    setEditingStatus(editingStatus === projectId ? null : projectId);
  };

  const updateProjectStatus = async (
    projectId: number,
    newStatus: ProjectState
  ) => {
    try {
      // Close the dropdown
      setEditingStatus(null);

      // Update status through the API
      await projectsService.update(projectId, {
        state: newStatus,
      });

      // Update local state
      setProjects(
        projects.map((project) =>
          project.id === projectId ? { ...project, state: newStatus } : project
        )
      );

      // Show notification
      setStatusNotification({
        projectId,
        message: `Status updated to ${statusLabels[newStatus]}`,
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        setStatusNotification(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating project status:", err);
      alert("Failed to update project status. Please try again.");
    }
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
        return "bg-green-100 text-green-800 border border-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "ON_HOLD":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "PLANNING":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader className="animate-spin h-10 w-10 text-primary" />
        <span className="text-lg font-medium text-gray-600">
          Loading projects...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start shadow-sm">
        <AlertCircle
          className="text-red-500 mr-4 mt-0.5 flex-shrink-0"
          size={24}
        />
        <div>
          <h3 className="font-semibold text-red-800 text-lg">Error</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-management-container">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {team ? `${team.name} Projects` : "Team Projects"}
          </h2>
          <p className="text-gray-500">
            Manage your team's projects and track their progress
          </p>
        </div>
        <button
          onClick={handleAddProject}
          className="btn-primary flex items-center justify-center px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus size={18} className="mr-2" />
          Add New Project
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects by name, description or status..."
          className="form-input pl-12 py-3 w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            No projects found
          </h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {searchQuery
              ? "No projects match your search criteria. Try a different search term."
              : "Your team doesn't have any projects yet. Create your first project to get started."}
          </p>
          <button
            onClick={handleAddProject}
            className="mt-6 btn-secondary flex items-center mx-auto px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div
                className={`p-5 cursor-pointer ${expandedProject === project.id ? "bg-gray-50 border-b border-gray-100" : ""}`}
                onClick={() => toggleProjectExpansion(project.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${getStatusBadgeClass(project.state).split(" ")[0]}`}
                    >
                      {getStatusIcon(project.state)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center ${getStatusBadgeClass(project.state)}`}
                        >
                          {statusLabels[project.state]}
                        </span>
                        {project.team && (
                          <span className="ml-2 text-xs text-gray-500 flex items-center">
                            <Users size={12} className="mr-1" />
                            {project.team.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedProject === project.id ? (
                      <ChevronUp size={20} className="text-gray-400 ml-2" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400 ml-2" />
                    )}
                  </div>
                </div>

                {!expandedProject && (
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {project.description || "No description available"}
                  </p>
                )}

                {statusNotification &&
                  statusNotification.projectId === project.id && (
                    <div className="mt-3 bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm flex items-center border border-green-200">
                      <Check size={16} className="mr-2 text-green-600" />
                      {statusNotification.message}
                    </div>
                  )}
              </div>

              {expandedProject === project.id && (
                <div className="px-6 py-5 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Project Details
                    </h4>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project.id);
                        }}
                        className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                        title="Edit project status"
                      >
                        Change Status <ChevronDown size={14} className="ml-1" />
                      </button>

                      {editingStatus === project.id && (
                        <div
                          className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Object.entries(statusLabels).map(
                            ([state, label]) => (
                              <button
                                key={state}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                                  project.state === state
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700"
                                }`}
                                onClick={() =>
                                  updateProjectStatus(
                                    project.id,
                                    state as ProjectState
                                  )
                                }
                              >
                                {label}
                                {project.state === state && (
                                  <Check size={14} className="text-blue-600" />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                          Description
                        </h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-700">
                            {project.description || "No description available"}
                          </p>
                        </div>
                      </div>

                      {project.team && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                            Team
                          </h4>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center text-gray-700">
                              <Users
                                size={16}
                                className="mr-2 text-indigo-500"
                              />
                              <span className="font-medium">
                                {project.team.name}
                              </span>
                              {project.team.acro && (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({project.team.acro})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                        Timeline
                      </h4>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                        <div className="flex items-center text-gray-700">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <Calendar size={16} className="text-indigo-600" />
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              Created
                            </span>
                            <p className="font-medium">
                              {formatDate(project.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Calendar size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              Expected Completion
                            </span>
                            <p className="font-medium">
                              {project.expectedEndDate
                                ? formatDate(project.expectedEndDate)
                                : "Not set"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
