import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { usersService, User } from "../../../../services/usersService";
import { teamsService } from "../../../../services/teamsService";
import { Role } from "../../../../types/type";

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string;
}

const AddMemberToTeam = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [currentTeam, setCurrentTeam] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch all team members and current team
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch the current user to get their ID
        const currentUser = await usersService.getProfile();

        if (currentUser.role !== Role.TeamLeader) {
          setError("You must be a team leader to access this page.");
          return;
        }

        // Fetch all users and teams in parallel
        const [users, allTeams] = await Promise.all([
          usersService.getAll(),
          teamsService.getAll(),
        ]);

        // Get all team member IDs from all teams
        const teamMemberIds = new Set(
          allTeams.flatMap(
            (team) => team.members?.map((member) => member.userId) || []
          )
        );

        // Filter only TeamMember role users who are not in any team
        const availableTeamMembers = users
          .filter(
            (user) =>
              user.role === Role.TeamMember && // Only include TeamMember role users
              !teamMemberIds.has(user.id) && // Exclude users who are already in any team
              user.id !== currentUser.id // Exclude the current user
          )
          .map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ? user.role : Role.TeamMember,
          }));

        setMembers(availableTeamMembers);

        // Fetch team leader's team
        const myTeams = await teamsService.getMyTeams();

        if (!myTeams.led || myTeams.led.length === 0) {
          setError(
            "You don't have a team assigned. Please contact the administrator."
          );
          return;
        }

        // Since a team leader can only have one team, we take the first one
        const team = myTeams.led[0];
        if (!team || !team.id) {
          setError("Invalid team data received. Please try again later.");
          return;
        }

        setCurrentTeam(team.id);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle member selection
  const handleMemberSelect = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle adding members to team
  const handleAddMembers = async () => {
    if (!currentTeam) {
      setError("No team found. Please create a team first.");
      return;
    }

    if (selectedMembers.length === 0) {
      setError("Please select at least one member to add.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add each selected member to the team
      const addPromises = selectedMembers.map((memberId) =>
        teamsService.addMember(currentTeam, {
          userId: memberId, // This userId will be used as the TeamMember id
          email: "",
        })
      );

      await Promise.all(addPromises);
      setSuccessMessage("Members added successfully!");
      setSelectedMembers([]);

      setTimeout(() => {
        navigate("/dashboard/TeamLeader/my-team");
      }, 1000);
    } catch (err) {
      console.error("Error adding members:", err);
      setError("Failed to add members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search term
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add Members to Team
        </h2>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Select
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Member
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleMemberSelect(member.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleMemberSelect(member.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt={member.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {member.name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {member.email}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchTerm
                        ? "No members match your search criteria"
                        : "No members found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleAddMembers}
            disabled={loading || selectedMembers.length === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUserPlus className="mr-2" />
            Add Selected Members ({selectedMembers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberToTeam;
