import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";
import { api } from "../../../../services/api";
import {
  Project as ImportedProject,
  projectsService,
  ProjectState,
} from "../../../../services/projectsService";
import {
  Team as ImportedTeam,
  teamsService,
} from "../../../../services/teamsService";

interface Project {
  id: string;
  name: string;
  description: string;
  status:
    | "To Do"
    | "In Progress"
    | "Completed"
    | "Planning"
    | "On Hold"
    | "Cancelled";
  tasks: Task[];
  deadline: string;
  progress: number;
  teamName?: string;
  teamId?: string;
}

interface Task {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
  deadline: string;
}

const MemberProjects: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch user's team
        const teams: ImportedTeam[] = await teamsService.getAll();

        // Filter teams where the current user is a member or leader
        const userTeams = teams.filter((team) => {
          // Check if user is a team member
          const isMember = team.members?.some(
            (member) => member.userId === user.id || member.user?.id === user.id
          );
          return isMember;
        });

        if (!userTeams.length) {
          setError("You are not a member of any team");
          setLoading(false);
          return;
        }

        const userTeam = userTeams[0];

        // Fetch team projects
        const teamProjectsResponse = await projectsService.getByTeam(
          Number(userTeam.id)
        );

        // Process projects data
        if (teamProjectsResponse && Array.isArray(teamProjectsResponse)) {
          const formattedProjects: Project[] = teamProjectsResponse.map(
            (project: ImportedProject) => ({
              id: String(project.id || ""),
              name: project.name || "",
              description: project.description || "",
              status: mapProjectState(project.state),
              deadline: project.expectedEndDate || new Date().toISOString(),
              progress: calculateProjectProgress(project),
              teamName: userTeam.name,
              teamId: String(userTeam.id),
              // Add empty tasks array for now, we could fetch them later if needed
              tasks: [],
            })
          );

          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error("Error fetching member projects:", err);
        setError("Failed to load projects data");

        // Fallback to sample data in case of error
        setProjects([
          {
            id: "1",
            name: "Research Data Analysis",
            description: "Analyzing experimental data from recent lab tests",
            status: "In Progress",
            tasks: [
              {
                id: "1-1",
                title: "Data preprocessing",
                status: "Completed",
                deadline: "2024-04-01",
              },
              {
                id: "1-2",
                title: "Statistical analysis",
                status: "In Progress",
                deadline: "2024-04-10",
              },
              {
                id: "1-3",
                title: "Results visualization",
                status: "To Do",
                deadline: "2024-04-15",
              },
            ],
            deadline: "2024-04-15",
            progress: 65,
          },
          {
            id: "2",
            name: "Lab Equipment Upgrade",
            description: "Testing and calibrating new lab equipment",
            status: "To Do",
            tasks: [
              {
                id: "2-1",
                title: "Equipment inventory",
                status: "To Do",
                deadline: "2024-04-20",
              },
              {
                id: "2-2",
                title: "Calibration tests",
                status: "To Do",
                deadline: "2024-04-25",
              },
            ],
            deadline: "2024-05-01",
            progress: 0,
          },
          {
            id: "3",
            name: "Publication Review",
            description: "Literature review for upcoming publication",
            status: "Completed",
            tasks: [
              {
                id: "3-1",
                title: "Literature search",
                status: "Completed",
                deadline: "2024-03-10",
              },
              {
                id: "3-2",
                title: "Review summary",
                status: "Completed",
                deadline: "2024-03-15",
              },
              {
                id: "3-3",
                title: "Final report",
                status: "Completed",
                deadline: "2024-03-20",
              },
            ],
            deadline: "2024-03-20",
            progress: 100,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  // Helper function to map project state to status
  const mapProjectState = (
    state?: ProjectState
  ):
    | "To Do"
    | "In Progress"
    | "Completed"
    | "Planning"
    | "On Hold"
    | "Cancelled" => {
    if (!state) return "To Do";

    switch (state) {
      case "COMPLETED":
        return "Completed";
      case "IN_PROGRESS":
        return "In Progress";
      case "PLANNING":
        return "Planning";
      case "ON_HOLD":
        return "On Hold";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "To Do";
    }
  };

  // Helper function to calculate project progress
  const calculateProjectProgress = (project: ImportedProject): number => {
    if (!project) return 0;

    if (project.state === "COMPLETED") return 100;
    if (
      project.state === "PLANNING" ||
      project.state === "ON_HOLD" ||
      project.state === "CANCELLED"
    )
      return 0;

    // For in-progress projects, you can use a default value
    return 50;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="text-green-500" />;
      case "In Progress":
        return <FaClock className="text-blue-500" />;
      case "To Do":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "Planning":
        return <FaClock className="text-yellow-500" />;
      case "On Hold":
        return <FaExclamationCircle className="text-orange-500" />;
      case "Cancelled":
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "On Hold":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects =
    statusFilter === "all"
      ? projects
      : projects.filter((project) => project.status === statusFilter);

  if (loading) {
    return <div className="p-6">Loading projects data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              statusFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("In Progress")}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              statusFilter === "In Progress"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              statusFilter === "Completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(project.status)}
                <h2 className="text-xl font-semibold">{project.name}</h2>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {project.tasks && project.tasks.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Tasks</h3>
                <div className="space-y-2">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <span>{task.title}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberProjects;
