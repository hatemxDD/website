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
import {
  Team as ImportedTeam,
  TeamMember as ImportedTeamMember,
  teamsService,
} from "../../../../services/teamsService";
import {
  Project as ImportedProject,
  projectsService,
  ProjectState,
} from "../../../../services/projectsService";
import { User, usersService } from "../../../../services/usersService";
import { AxiosResponse } from "axios";

interface Project {
  id: string;
  name: string;
  status:
    | "To Do"
    | "In Progress"
    | "Completed"
    | "Planning"
    | "On Hold"
    | "Cancelled";
  deadline: string;
  progress: number;
  teamName?: string;
  teamId?: string;
  description?: string;
}

interface TeamData {
  id: string;
  name: string;
  acro: string;
  leader: {
    id: string;
    name: string;
    email: string;
  };
  members: {
    id: string;
    name: string;
    email: string;
  }[];
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
  isTeamLeader?: boolean;
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
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLeader, setTeamLeader] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
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

        // Fetch team members using getMembers from teamsService
        const teamMembersResponse = await userTeam.members;

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
              status: mapProjectState(project.state),
              deadline: project.expectedEndDate || new Date().toISOString(),
              progress: calculateProjectProgress(project),
              teamName: userTeam.name,
              teamId: String(userTeam.id),
              description: project.description || "",
            })
          );

          setTeamProjects(formattedProjects);

          // Calculate completion rate
          const completedProjects = formattedProjects.filter(
            (p) => p.status === "Completed"
          ).length;
          const completionPercentage =
            formattedProjects.length > 0
              ? Math.round((completedProjects / formattedProjects.length) * 100)
              : 0;

          setCompletionRate(completionPercentage);
        }

        // Convert ImportedTeam to TeamData format
        const teamData: TeamData = {
          id: String(userTeam.id || ""),
          name: userTeam.name || "",
          acro: userTeam.acro || "",
          leader: {
            id: String(userTeam.leader?.id || ""),
            name: userTeam.leader?.name || "",
            email: userTeam.leader?.email || "",
          },
          members: (userTeam.memberUsers || []).map((member) => ({
            id: String(member.id),
            name: member.name,
            email: member.email,
          })),
        };

        setTeam(teamData);

        // Set team leader data
        const teamLeaderData = teamData.leader;
        let teamLeaderUser: User | null = null;

        try {
          // Fetch full team leader details if leader ID is available
          if (userTeam.leaderId) {
            const leaderResponse = await usersService.getById(
              Number(userTeam.leaderId)
            );
            teamLeaderUser = leaderResponse;
          }
        } catch (error) {
          console.error("Error fetching team leader details:", error);
        }

        const teamLeaderFormatted: TeamMember = {
          id: teamLeaderData.id,
          name: teamLeaderData.name || teamLeaderUser?.name || "",
          email: teamLeaderData.email || teamLeaderUser?.email || "",
          role: "Team Leader",
          isTeamLeader: true,
          photoUrl: teamLeaderUser?.image || teamLeaderUser?.photo,
        };

        // Process detailed team members with user info
        const memberPromises = teamMembersResponse
          ? teamMembersResponse
              .filter((member) => member.userId !== userTeam.leaderId)
              .map(async (member) => {
                // Fetch detailed user information for each team member
                try {
                  const userData = await usersService.getById(
                    Number(member.userId)
                  );

                  return {
                    id: String(member.userId),
                    name: userData.name || "",
                    email: userData.email || "",
                    role: "Team Member",
                    isTeamLeader: false,
                    photoUrl: userData.image || userData.photo,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching user data for ID ${member.userId}:`,
                    error
                  );
                  return {
                    id: String(member.userId),
                    name: member.user?.name || "Unknown User",
                    email: member.user?.email || "",
                    role: "Team Member",
                    isTeamLeader: false,
                  };
                }
              })
          : [];

        const teamMembersFormatted = await Promise.all(memberPromises);

        setTeamLeader(teamLeaderFormatted);
        setTeamMembers(teamMembersFormatted);
      } catch (err) {
        console.error("Error fetching member dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "On Hold":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
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
          value={team ? 1 : 0}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          trend={team ? team.name : "Not in any team"}
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
              No projects found for your team.
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
                {team && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <FaUsers className="mr-2" />
                    <span>{team.name}</span>
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

        {/* Team Leader */}
        {teamLeader && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              Team Leader
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {teamLeader.photoUrl ? (
                    <img
                      src={teamLeader.photoUrl}
                      alt={teamLeader.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-medium">
                      {teamLeader.name.substring(0, 2)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white text-lg">
                    {teamLeader.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {teamLeader.role}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {teamLeader.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Team Members */}
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
          Team Members
        </h3>

        {teamMembers.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No other team members found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                        {member.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white text-lg">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberOverview;
