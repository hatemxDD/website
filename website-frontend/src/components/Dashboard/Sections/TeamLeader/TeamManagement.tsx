import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUserFriends,
  FaProjectDiagram,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  teamsService,
  Team,
  TeamMember as TeamMemberType,
} from "../../../../services/teamsService";
import { useAuth } from "../../../../contexts/AuthContext";
import LoadingSkeleton from "../../../Common/LoadingSkeleton";

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
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <LoadingSkeleton type="title" width="250px" />
          <LoadingSkeleton type="button" width="150px" />
        </div>

        {/* Team Selection Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <LoadingSkeleton type="title" width="200px" className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700"
              >
                <LoadingSkeleton type="title" width="80%" className="mb-2" />
                <LoadingSkeleton type="text" width="40%" className="mb-4" />
                <div className="flex justify-between items-center">
                  <LoadingSkeleton type="tag" width="80px" />
                  <LoadingSkeleton type="tag" width="80px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Details Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <LoadingSkeleton type="title" width="200px" />
            <LoadingSkeleton type="button" width="120px" />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                <LoadingSkeleton type="text" width="100px" className="mb-2" />
                <LoadingSkeleton type="title" width="80%" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                <LoadingSkeleton type="text" width="100px" className="mb-2" />
                <LoadingSkeleton type="title" width="60%" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
              <LoadingSkeleton type="text" width="100px" className="mb-2" />
              <LoadingSkeleton type="paragraph" count={3} fullWidth />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <LoadingSkeleton type="text" width="100px" />
                    <LoadingSkeleton type="circle" width="20px" height="20px" />
                  </div>
                  <LoadingSkeleton type="title" width="40px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <LoadingSkeleton type="title" width="200px" className="mb-6" />

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <LoadingSkeleton type="text" width="80px" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <LoadingSkeleton type="text" width="60px" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <LoadingSkeleton type="text" width="70px" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <LoadingSkeleton type="text" width="70px" />
                  </th>
                  <th className="px-6 py-4 text-left">
                    <LoadingSkeleton type="text" width="80px" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <LoadingSkeleton
                          type="avatar"
                          width="40px"
                          height="40px"
                        />
                        <div className="ml-4">
                          <LoadingSkeleton type="text" width="120px" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LoadingSkeleton type="tag" width="80px" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LoadingSkeleton type="text" width="150px" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LoadingSkeleton type="text" width="100px" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LoadingSkeleton
                        type="button"
                        width="90px"
                        height="30px"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-800">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h1>
        {selectedTeam && (
          <button
            onClick={() => navigate("/dashboard/TeamLeader/projects")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <FaProjectDiagram /> View All Projects
          </button>
        )}
      </div>

      {/* Team Selection */}
      {teams.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <FaUserFriends className="text-indigo-500 dark:text-indigo-400" />
            <span>Your Teams</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => handleTeamChange(team.id)}
                className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-300 hover:shadow-md ${
                  selectedTeam?.id === team.id
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {team.name}
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {team.acro}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full">
                    {team.members?.length || 0} members
                  </span>
                  <span className="text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full">
                    {team.projects?.length || 0} projects
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <FaUserFriends className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            No Teams Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            You are not currently leading any teams. Please contact the lab
            administrator.
          </p>
        </div>
      )}

      {selectedTeam && (
        <div className="space-y-8">
          {/* Team Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {selectedTeam.acro.charAt(0)}
                  </span>
                </span>
                Team Details
              </h2>
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveTeam}
                    className="flex items-center px-5 py-2.5 bg-emerald-600 dark:bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FaSave className="mr-2" /> Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-5 py-2.5 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditTeam}
                  className="flex items-center px-5 py-2.5 bg-indigo-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FaEdit className="mr-2" /> Edit Team
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-5 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                <div>
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="teamAcro"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="teamDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Team Name
                    </h3>
                    <p className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
                      {selectedTeam.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Team Acronym
                    </h3>
                    <p className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
                      {selectedTeam.acro}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </h3>
                  <p className="mt-2 text-gray-900 dark:text-gray-100 leading-relaxed">
                    {selectedTeam.description || "No description available"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800 transition-transform hover:scale-[1.02] duration-300">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        Total Members
                      </p>
                      <FaUserFriends className="text-indigo-500 dark:text-indigo-400 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {teamMembers.length}
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800 transition-transform hover:scale-[1.02] duration-300">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        Active Projects
                      </p>
                      <FaProjectDiagram className="text-emerald-500 dark:text-emerald-400 h-5 w-5" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {selectedTeam.projects?.length || 0}
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-100 dark:border-amber-800 transition-transform hover:scale-[1.02] duration-300">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                        Created
                      </p>
                      <FaCalendarAlt className="text-amber-500 dark:text-amber-400 h-5 w-5" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                      {new Date(selectedTeam.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Members Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <FaUserFriends className="text-indigo-500 dark:text-indigo-400" />
              Team Members
            </h2>

            {teamMembers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <FaUserFriends className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Your team currently has no members.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {teamMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {member.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="flex items-center text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaProjectDiagram className="text-indigo-500 dark:text-indigo-400" />
                  Team Projects
                </h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedTeam.projects.map((project: any) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                            {project.status || "In Progress"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">
                            {project.progress || 0}% Complete
                          </span>
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
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <FaUserFriends className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Please select a team to manage.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
