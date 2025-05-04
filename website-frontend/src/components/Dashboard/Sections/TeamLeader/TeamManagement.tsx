import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChartBar,
} from "react-icons/fa";
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

interface LabMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
  teamId?: string; // If null/undefined, means the member is not assigned to any team
}

// Extended Team interface with additional properties returned from API
interface ExtendedTeam extends Team {
  members?: any[];
  projects?: any[];
}

interface TeamManagementProps {
  mode?: "view" | "add";
}

const TeamManagement: React.FC<TeamManagementProps> = ({ mode = "view" }) => {
  const { user } = useAuth();

  // State for teams and members
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ExtendedTeam | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [unassignedMembers, setUnassignedMembers] = useState<LabMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await teamsService.getAll();
        // Filter teams where user is the leader
        const leaderTeams = (response as any).data.filter(
          (team: ExtendedTeam) => team.leader && team.leader.id === user?.id
        );

        setTeams(leaderTeams);

        // Set first team as selected by default if available
        if (leaderTeams.length > 0) {
          setSelectedTeam(leaderTeams[0]);
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
        const teamData = (response as any).data as ExtendedTeam;

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

        // Fetch unassigned lab members (this would need an API endpoint)
        // For now, we'll use mock data
        const mockUnassignedMembers = [
          {
            id: "3",
            name: "David Johnson",
            role: "PhD Student",
            email: "david.johnson@example.com",
            joinDate: "2023-05-10",
          },
          {
            id: "4",
            name: "Sarah Williams",
            role: "Research Assistant",
            email: "sarah.williams@example.com",
            joinDate: "2023-06-22",
          },
          {
            id: "5",
            name: "Michael Brown",
            role: "Lab Technician",
            email: "michael.brown@example.com",
            joinDate: "2023-04-15",
          },
          {
            id: "6",
            name: "Emily Davis",
            role: "PhD Student",
            email: "emily.davis@example.com",
            joinDate: "2023-07-03",
          },
        ];

        setUnassignedMembers(mockUnassignedMembers);
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
    }
  };

  const handleAddMembersToTeam = async () => {
    if (!selectedTeam) {
      alert("Please select a team first");
      return;
    }

    if (selectedMembers.length === 0) {
      alert("Please select at least one member to add to your team");
      return;
    }

    try {
      setLoading(true);

      // Process each selected member
      for (const memberId of selectedMembers) {
        await teamsService.addMember(selectedTeam.id, {
          userId: Number(memberId),
        });
      }

      // Get the members to add (for UI update)
      const membersToAdd = unassignedMembers
        .filter((member) => selectedMembers.includes(member.id))
        .map((member) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          email: member.email,
          joinDate: member.joinDate,
          status: "active" as const,
        }));

      // Add to team members
      setTeamMembers([...teamMembers, ...membersToAdd]);

      // Remove from unassigned members
      setUnassignedMembers(
        unassignedMembers.filter(
          (member) => !selectedMembers.includes(member.id)
        )
      );

      // Clear selection
      setSelectedMembers([]);

      setLoading(false);
      alert(`Successfully added ${membersToAdd.length} member(s) to your team`);
    } catch (err) {
      console.error("Error adding members to team:", err);
      setError("Failed to add members to team. Please try again later.");
      setLoading(false);
    }
  };

  const toggleSelectMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
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

        // Get the member to remove
        const memberToRemove = teamMembers.find(
          (member) => member.id === memberId
        );

        if (memberToRemove) {
          // Add back to unassigned members
          setUnassignedMembers([
            ...unassignedMembers,
            {
              id: memberToRemove.id,
              name: memberToRemove.name,
              role: memberToRemove.role,
              email: memberToRemove.email,
              joinDate: memberToRemove.joinDate,
            },
          ]);

          // Remove from team members
          setTeamMembers(
            teamMembers.filter((member) => member.id !== memberId)
          );
        }

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === "add" ? "Add Team Member" : "Team Management"}
      </h1>

      {/* Team Selection */}
      {teams.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => handleTeamChange(team.id)}
                className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                  selectedTeam?.id === team.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <h3 className="font-medium">{team.name}</h3>
                <p className="text-sm text-gray-500">{team.acro}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {team.members?.length || 0} members
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {team.projects?.length || 0} projects
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Teams Found</h2>
          <p className="text-gray-600 mb-4">
            You are not currently leading any teams. Please contact the lab
            administrator.
          </p>
        </div>
      )}

      {selectedTeam && mode === "add" ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Available Lab Members
            </h2>
            <p className="text-gray-600 mb-4">
              Select members to add to your team. These are lab members who are
              not currently assigned to any team.
            </p>

            {unassignedMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  There are no available unassigned members at this time.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unassignedMembers.map((member) => (
                        <tr
                          key={member.id}
                          className={`${selectedMembers.includes(member.id) ? "bg-blue-50" : ""} transition-colors duration-300`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => toggleSelectMember(member.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-700 font-medium">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {member.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.joinDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddMembersToTeam}
                    disabled={selectedMembers.length === 0}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      selectedMembers.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } transition-colors duration-300`}
                  >
                    <FaPlus className="mr-2" />
                    Add{" "}
                    {selectedMembers.length > 0
                      ? `${selectedMembers.length} `
                      : ""}
                    Selected Members
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Current Team Members</h2>
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Your team currently has no members. Add some members from the
                  list above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-700 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : selectedTeam ? (
        <div className="space-y-6">
          {/* Team Stats */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Team Statistics</h2>
              <FaChartBar className="text-blue-500 text-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-500 font-medium">
                  Total Members
                </p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-500 font-medium">
                  Active Projects
                </p>
                <p className="text-2xl font-bold">
                  {selectedTeam.projects?.length || 0}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-500 font-medium">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Team Members</h2>
              <button
                onClick={() =>
                  (window.location.href = "/dashboard/TeamLeader/team/add")
                }
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                <FaUserPlus className="mr-2" />
                Add Member
              </button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Your team currently has no members. Click "Add Member" to add
                  some.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-700 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          >
                            Remove
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
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Team Projects</h2>
                <button
                  onClick={() =>
                    (window.location.href = "/dashboard/TeamLeader/projects")
                  }
                  className="text-blue-600 hover:text-blue-900 transition-colors duration-300"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTeam.projects.map((project: any) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {project.status || "In Progress"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
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
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Please select a team to manage.</p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
