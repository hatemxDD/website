import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";
import { api } from "../../../../services/api";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  tasks: Task[];
  deadline: string;
  progress: number;
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

        // Fetch projects for the current user
        const response = await api.get<Project[]>(
          `/api/members/${user.id}/projects`
        );
        setProjects(response);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="text-green-500" />;
      case "In Progress":
        return <FaClock className="text-blue-500" />;
      case "To Do":
        return <FaExclamationCircle className="text-yellow-500" />;
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberProjects;
