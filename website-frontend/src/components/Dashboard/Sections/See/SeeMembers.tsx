import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaSearch, FaFilter } from "react-icons/fa";
import { usersService, User } from "../../../../services/usersService";
import { teamsService } from "../../../../services/teamsService";
import { Role } from "../../../../types/type";

// Extend User interface to include team memberships
interface UserWithTeams extends User {
  memberOfTeams?: {
    id: number;
    teamId: number;
    userId: number;
    team?: {
      id: number;
      name: string;
    };
  }[];
  leadingTeams?: {
    id: number;
    name: string;
  }[];
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  team?: string;
  createdAt: string;
  academicGrade?: string;
  image?: string;
}

interface SeeMembersProps {
  title?: string;
}

const SeeMembers: React.FC<SeeMembersProps> = ({ title = "Lab Members" }) => {
  // State for members data
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterTeam, setFilterTeam] = useState<string>("");
  const [filterJoinDate, setFilterJoinDate] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Member;
    direction: "ascending" | "descending";
  } | null>(null);

  const navigate = useNavigate();

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await usersService.getAll();

        // Transform API data to match our Member interface
        const formattedMembers = data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: typeof user.role === "string" ? user.role : Role[user.role],
          team: user.team || "",
          createdAt: user.createdAt || new Date().toISOString().split("T")[0],
          academicGrade: "Member", // Default value
          image: user.image,
        }));

        setMembersData(formattedMembers);
        setError(null);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case "role":
        setFilterRole(value);
        break;
      case "team":
        setFilterTeam(value);
        break;
      case "joinDate":
        setFilterJoinDate(value);
        break;
      default:
        break;
    }
  };

  // Handle sorting
  const requestSort = (key: keyof Member) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting to get filtered members
  const getFilteredMembers = () => {
    let filtered = [...membersData];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(term) ||
          member.email.toLowerCase().includes(term) ||
          (member.academicGrade &&
            member.academicGrade.toLowerCase().includes(term))
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(
        (member) => member.role.toLowerCase() === filterRole.toLowerCase()
      );
    }

    // Apply team filter
    if (filterTeam) {
      filtered = filtered.filter((member) => member.team === filterTeam);
    }

    // Apply join date filter
    if (filterJoinDate) {
      filtered = filtered.filter(
        (member) => member.createdAt === filterJoinDate
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredMembers = getFilteredMembers();

  // Add a simple delete handler
  const handleDelete = async (id: number) => {
    try {
      // First, get detailed user information including team memberships
      const userDetails = (await usersService.getById(id)) as UserWithTeams;
      console.log("User details:", userDetails);

      let confirmMessage =
        "Are you sure you want to delete this member? This will remove them from all teams.";

      // Check if user is a team leader
      const isTeamLeader =
        userDetails.role === Role.TeamLeader ||
        (userDetails.leadingTeams && userDetails.leadingTeams.length > 0);

      if (isTeamLeader) {
        confirmMessage =
          "WARNING: This user is a Team Leader. Deleting this member will also delete their team. Are you sure you want to proceed?";
      }

      if (confirm(confirmMessage)) {
        try {
          // If user is a team leader, delete their teams first
          if (
            isTeamLeader &&
            userDetails.leadingTeams &&
            userDetails.leadingTeams.length > 0
          ) {
            try {
              const deleteTeamPromises = userDetails.leadingTeams.map((team) =>
                teamsService.delete(team.id)
              );

              // Wait for all team deletion operations to complete
              await Promise.all(deleteTeamPromises);
              console.log(
                `Deleted ${userDetails.leadingTeams.length} teams led by this user`
              );
            } catch (teamError) {
              console.error("Error deleting teams:", teamError);
              // Continue with user deletion even if team deletion fails
            }
          }
          // If user is part of any teams as a member, remove them from those teams
          else if (
            userDetails.memberOfTeams &&
            userDetails.memberOfTeams.length > 0
          ) {
            try {
              const removePromises = userDetails.memberOfTeams.map(
                (membership) => teamsService.removeMember(membership.teamId, id)
              );

              // Wait for all team removal operations to complete
              await Promise.all(removePromises);
              console.log(
                `User removed from ${userDetails.memberOfTeams.length} teams`
              );
            } catch (teamError) {
              console.error("Error removing user from teams:", teamError);
              // Continue with user deletion even if team removal fails
            }
          }
        } catch (userDetailsError) {
          console.error("Error processing user memberships:", userDetailsError);
          // If we can't process user details, proceed with just deleting the user
        }

        // Now delete the user
        await usersService.delete(id);
        setMembersData(membersData.filter((member) => member.id !== id));
        alert("Member deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Failed to delete member. Please try again.");
    }
  };

  const showDeleteControls = true;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
        <button
          onClick={() => {
            try {
              navigate("/dashboard/LabLeader/members/add");
            } catch (error) {
              console.error("Navigation error:", error);
              alert("Could not navigate to add member page");
            }
          }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaUserPlus className="mr-2" />
          Add Member
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="LabLeader">Lab Leader</option>
                  <option value="TeamLeader">Team Leader</option>
                  <option value="TeamMember">Team Member</option>
                </select>
              </div>
            </div>
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig?.key === "name" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {sortConfig?.key === "email" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("role")}
                  >
                    <div className="flex items-center">
                      Role
                      {sortConfig?.key === "role" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("team")}
                  >
                    <div className="flex items-center">
                      Team
                      {sortConfig?.key === "team" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Join Date
                      {sortConfig?.key === "createdAt" &&
                        (sortConfig.direction === "ascending" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.image ? (
                              <img
                                src={member.image}
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
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {member.academicGrade}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            member.role === "TeamLeader"
                              ? "bg-green-100 text-green-800"
                              : member.role === "TeamMember"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {member.team || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            try {
                              // For Lab Leader, go to profile page instead of edit page
                              if (member.role === "LabLeader") {
                                navigate(`/dashboard/LabLeader/profile`);
                              } else {
                                navigate(
                                  `/dashboard/LabLeader/members/edit/${member.id}`
                                );
                              }
                            } catch (error) {
                              console.error("Navigation error:", error);
                              alert("Could not navigate to edit page");
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        >
                          {member.role === "LabLeader"
                            ? "View Profile"
                            : "Edit"}
                        </button>
                        {showDeleteControls && member.role !== "LabLeader" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(member.id);
                            }}
                            className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchTerm ||
                      filterRole !== "all" ||
                      filterTeam ||
                      filterJoinDate
                        ? "No members match your search criteria"
                        : "No members found. Add some members to get started!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredMembers.length} of {membersData.length} members
      </div>
    </div>
  );
};

export default SeeMembers;
