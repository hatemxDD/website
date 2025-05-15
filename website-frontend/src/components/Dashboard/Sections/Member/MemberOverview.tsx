import React, { useState, useEffect } from "react";
import { BarChart2, Users, FileText, ChevronRight } from "lucide-react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";
import { api } from "../../../../services/api";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../contexts/ThemeContext";

interface Project {
  id: string;
  name: string;
  status: "To Do" | "In Progress" | "Completed";
  deadline: string;
  progress: number;
  teamName?: string;
  teamId?: string;
  description?: string;
}

interface Team {
  id: string;
  name: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  email: string;
  photoUrl?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

const MemberOverview: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // In a real app, fetch from API
        // Sample data for demonstration
        const sampleProjects: Project[] = [
          {
            id: "1",
            name: "Team Genomics Analysis",
            status: "In Progress",
            deadline: "2024-05-30",
            progress: 45,
            teamName: "Genomics Research Team",
            description: "Analysis of genomic data from recent samples",
          },
          {
            id: "2",
            name: "Clinical Data Integration",
            status: "To Do",
            deadline: "2024-06-15",
            progress: 10,
            teamName: "Genomics Research Team",
            description: "Integrating clinical data with genomic findings",
          },
          {
            id: "3",
            name: "Publication Draft",
            status: "Completed",
            deadline: "2024-04-15",
            progress: 100,
            teamName: "Genomics Research Team",
            description: "Preparation of manuscript for journal submission",
          },
        ];

        setTeamProjects(sampleProjects);

        // Calculate completion rate
        const completedProjects = sampleProjects.filter(
          (project) => project.status === "Completed"
        ).length;

        setCompletionRate(
          Math.round((completedProjects / sampleProjects.length) * 100)
        );

        // Team data
        setTeams([{ id: "1", name: "Genomics Research Team" }]);

        // Team members
        const teamMembersData: TeamMember[] = [
          {
            id: 1,
            name: "Jane Smith",
            role: "Team Leader",
            email: "jane@research.org",
          },
          {
            id: 2,
            name: "John Doe",
            role: "Senior Researcher",
            email: "john@research.org",
          },
          {
            id: 3,
            name: "Maria Lopez",
            role: "Research Assistant",
            email: "maria@research.org",
          },
          {
            id: 4,
            name: "Alex Chen",
            role: "Researcher",
            email: "alex@research.org",
          },
        ];
        setTeamMembers(teamMembersData);
      } catch (err) {
        console.error("Error fetching member dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Member Dashboard
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="My Projects"
          value={teamProjects.length}
          icon={<FileText className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          trend={`${teamProjects.filter((p) => p.status === "In Progress").length} active projects`}
        />
        <StatCard
          title="My Team"
          value={teams.length}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          trend={teams.length > 0 ? teams[0].name : "Not in any team"}
        />
        <StatCard
          title="Completion Rate"
          value={completionRate}
          icon={<BarChart2 className="h-6 w-6 text-white" />}
          color="bg-green-500"
          trend="Project completion percentage"
        />
      </div>

      {/* Project Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Project Progress
          </h2>
          <Link
            to="/dashboard/TeamMember/projects"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {teamProjects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No projects found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-white text-lg">
                    {project.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {project.description}
                  </div>
                )}
                {project.teamName && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <FaUsers className="mr-2" />
                    <span>{project.teamName}</span>
                  </div>
                )}
                <div className="w-full mt-2">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Deadline: {formatDate(project.deadline)}
                  </span>
                  <Link
                    to={`/dashboard/TeamMember/projects/${project.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Team Members
          </h2>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No team members found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                      {member.name.substring(0, 2)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {member.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberOverview;
