import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  teamsService,
  Team,
  TeamMember as TeamMemberType,
} from "../../../../services/teamsService";
import { useAuth } from "../../../../contexts/AuthContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
  status: "active" | "inactive";
}

// Extended Team interface with additional properties returned from API
interface ExtendedTeam extends Team {
  members?: any[];
  projects?: any[];
}

interface TeamManagementProps {
  mode?: "view" | "add";
}

// Add this interface to handle the MyTeams response format
interface MyTeamsResponse {
  led?: Team[];
  member?: Team[];
}

const TeamManagement: React.FC<TeamManagementProps> = ({ mode = "view" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for teams and members
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ExtendedTeam | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit team states
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState<{
    name: string;
    description: string;
    acro: string;
  }>({
    name: "",
    description: "",
    acro: "",
  });

  // Fetch user's teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        // Filter teams where user is the leader
        const leaderTeams = (await teamsService.getMyTeams()) as
          | Team[]
          | MyTeamsResponse;

        // Since the API returns both led and member teams, extract just the led ones
        const myTeams = Array.isArray(leaderTeams)
          ? leaderTeams
          : leaderTeams.led || [];

        setTeams(myTeams);

        // Set first team as selected by default if available
        if (myTeams.length > 0) {
          setSelectedTeam(myTeams[0]);
          setEditedTeam({
            name: myTeams[0].name,
            description: myTeams[0].description || "",
            acro: myTeams[0].acro,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again later.");
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user]);

  // Fetch team members when selected team changes
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!selectedTeam) return;

      try {
        setLoading(true);
        const response = await teamsService.getById(selectedTeam.id);

        // Handle both response formats and type the result
        const teamData = (
          response && typeof response === "object" && "data" in response
            ? response.data
            : response
        ) as ExtendedTeam;

        if (teamData.members) {
          // Convert team members to the format expected by the component
          const formattedMembers = teamData.members.map((member: any) => ({
            id: member.user?.id.toString() || member.userId.toString(),
            name: member.user?.name || "Unknown",
            role: member.user?.role || "Team Member",
            email: member.user?.email || "",
            joinDate: member.joinedAt || new Date().toISOString(),
            status: "active" as const,
          }));

          setTeamMembers(formattedMembers);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching team details:", err);
        setError("Failed to load team details. Please try again later.");
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [selectedTeam]);

  const handleTeamChange = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setEditedTeam({
        name: team.name,
        description: team.description || "",
        acro: team.acro,
      });
      setIsEditing(false);
    }
  };

  const handleEditTeam = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (selectedTeam) {
      setEditedTeam({
        name: selectedTeam.name,
        description: selectedTeam.description || "",
        acro: selectedTeam.acro,
      });
    }
    setIsEditing(false);
  };

  const handleSaveTeam = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      const updatedTeam = await teamsService.update(selectedTeam.id, {
        name: editedTeam.name,
        description: editedTeam.description,
        acro: editedTeam.acro,
      });

      // Update the local state
      setTeams(
        teams.map((team) =>
          team.id === selectedTeam.id ? { ...team, ...updatedTeam } : team
        )
      );

      setSelectedTeam({ ...selectedTeam, ...updatedTeam });
      setIsEditing(false);
      setLoading(false);
      alert("Team updated successfully");
    } catch (err) {
      console.error("Error updating team:", err);
      setError("Failed to update team. Please try again later.");
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam) {
      alert("Please select a team first");
      return;
    }

    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        setLoading(true);

        // Call API to remove member
        await teamsService.removeMember(selectedTeam.id, Number(memberId));

        // Remove from team members
        setTeamMembers(teamMembers.filter((member) => member.id !== memberId));

        setLoading(false);
        alert("Team member removed successfully");
      } catch (err) {
        console.error("Error removing member from team:", err);
        setError("Failed to remove member from team. Please try again later.");
        setLoading(false);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Team Management
      </h1>

      {/* Team Selection */}
      {teams.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Select Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => handleTeamChange(team.id)}
                className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                  selectedTeam?.id === team.id
                    ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {team.acro}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                    {team.members?.length || 0} members
                  </span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                    {team.projects?.length || 0} projects
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            No Teams Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You are not currently leading any teams. Please contact the lab
            administrator.
          </p>
        </div>
      )}

      {selectedTeam && (
        <div className="space-y-6">
          {/* Team Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Team Details
              </h2>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveTeam}
                    className="flex items-center px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-300"
                  >
                    <FaSave className="mr-1" /> Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
                  >
                    <FaTimes className="mr-1" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditTeam}
                  className="flex items-center px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300"
                >
                  <FaEdit className="mr-1" /> Edit Team
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Team Name
                  </label>
                  <input
                    id="teamName"
                    type="text"
                    value={editedTeam.name}
                    onChange={(e) =>
                      setEditedTeam({ ...editedTeam, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="teamAcro"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Team Acronym
                  </label>
                  <input
                    id="teamAcro"
                    type="text"
                    value={editedTeam.acro}
                    onChange={(e) =>
                      setEditedTeam({ ...editedTeam, acro: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="teamDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="teamDescription"
                    value={editedTeam.description}
                    onChange={(e) =>
                      setEditedTeam({
                        ...editedTeam,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Team Name
                    </h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                      {selectedTeam.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Team Acronym
                    </h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                      {selectedTeam.acro}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {selectedTeam.description || "No description available"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-blue-500 dark:text-blue-300 font-medium">
                      Total Members
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {teamMembers.length}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-green-500 dark:text-green-300 font-medium">
                      Active Projects
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedTeam.projects?.length || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <p className="text-sm text-purple-500 dark:text-purple-300 font-medium">
                      Created
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {new Date(selectedTeam.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Members Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Team Members
            </h2>

            {teamMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Your team currently has no members.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {member.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.status === "active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="flex items-center text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300"
                          >
                            <FaTrash className="mr-1" /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Team Projects */}
          {selectedTeam.projects && selectedTeam.projects.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Team Projects
                </h2>
                <button
                  onClick={() => navigate("/dashboard/TeamLeader/projects")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  View All Projects
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedTeam.projects.map((project: any) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {project.status || "In Progress"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      {!selectedTeam && teams.length > 0 && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Please select a team to manage.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
