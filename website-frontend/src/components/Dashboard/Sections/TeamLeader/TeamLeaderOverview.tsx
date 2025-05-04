import React, { useState, useEffect } from "react";
import { BarChart2, Users, FileText, ChevronRight } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { teamsService } from "../../../../services/teamsService";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
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

interface Project {
  id: string | number;
  name: string;
  status: string;
  deadline: string;
  progress: number;
}

interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  email: string;
  photoUrl?: string;
}

interface Team {
  id: number;
  name: string;
  description: string | null;
  acro: string;
  members?: any[];
  projects?: any[];
}

const TeamLeaderOverview: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [teamMembersData, setTeamMembersData] = useState<TeamMember[]>([]);
  const [completionRate, setCompletionRate] = useState(0);

  // Calculate statistics
  const calculateCompletionRate = (projects: Project[]) => {
    if (projects.length === 0) return 0;

    const completedProjects = projects.filter(
      (project) => project.status.toLowerCase() === "completed"
    ).length;

    return Math.round((completedProjects / projects.length) * 100);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch teams where the current user is the leader
        const teamsResponse = await teamsService.getAll();
        const userTeams = (teamsResponse as any).data.filter(
          (team: any) => team.leader && team.leader.id === user?.id
        );

        setTeams(userTeams);

        // If there are teams, fetch details for the first one
        if (userTeams.length > 0) {
          const teamId = userTeams[0].id;
          const teamDetails = await teamsService.getById(teamId);
          const teamData = (teamDetails as any).data;

          // Set members
          if (teamData.members) {
            const formattedMembers = teamData.members.map((member: any) => ({
              id: member.user?.id || member.userId,
              name: member.user?.name || "Unknown",
              role: member.user?.role || "Team Member",
              email: member.user?.email || "",
            }));

            setTeamMembersData(formattedMembers);
          }

          // Set projects
          if (teamData.projects) {
            const formattedProjects = teamData.projects.map((project: any) => ({
              id: project.id,
              name: project.name,
              status: project.status || "In Progress",
              deadline:
                project.deadline ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              progress: project.progress || Math.floor(Math.random() * 100),
            }));

            setRecentProjects(formattedProjects);
            setCompletionRate(calculateCompletionRate(formattedProjects));
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to load team data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "in review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "not started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
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
        Team Dashboard
      </h1>

      {teams.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Teams Found</h2>
          <p className="text-gray-600 mb-4">
            You are not currently leading any teams. Please contact the lab
            administrator.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Team Members"
              value={teamMembersData.length}
              icon={<Users className="h-6 w-6 text-white" />}
              color="bg-blue-500"
              trend={
                teamMembersData.length > 0
                  ? `${teamMembersData.length} active members`
                  : "No members yet"
              }
            />
            <StatCard
              title="Active Projects"
              value={
                recentProjects.filter(
                  (p) => p.status.toLowerCase() !== "completed"
                ).length
              }
              icon={<FileText className="h-6 w-6 text-white" />}
              color="bg-purple-500"
              trend={
                recentProjects.length > 0
                  ? `${recentProjects.length} total projects`
                  : "No projects yet"
              }
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
                to="/dashboard/TeamLeader/projects"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No projects found for this team.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border-b dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {project.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColorClass(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Deadline: {formatDate(project.deadline)}
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
              <Link
                to="/dashboard/TeamLeader/team"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
              >
                Manage Team <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {teamMembersData.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No team members found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembersData.map((member) => (
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
        </>
      )}
    </div>
  );
};

export default TeamLeaderOverview;
