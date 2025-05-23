import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { TeamCard } from "./TeamCard";
import { teamsService, Team } from "../../services/teamsService";
import { usersService } from "../../services/usersService";
import "./GroupDetail.css";

// Extend the user interface to include profilePicture
interface UserWithProfile {
  id: number;
  name: string;
  email: string;
  role?: string;
  profilePicture?: string;
  photo?: string;
  image?: string;
  phoneNumber?: string;
}

interface TeamLeader {
  id: number;
  name: string;
  email: string;
  photo: string;
  description: string;
  isLeader: boolean;
  role?: string;
  phoneNumber?: string;
  joinDate?: string;
  expertise?: string[];
}

interface TeamMemberExtended {
  id: number;
  name: string;
  email: string;
  description: string;
  photo: string;
}

// Interface for team projects
interface Project {
  id: number;
  name: string;
  description: string;
  status: "planned" | "in-progress" | "completed" | string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  teamId: number;
  technologies?: string[];
}

function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamLeader, setTeamLeader] = useState<TeamLeader | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberExtended[]>([]);
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!id) {
        setError("Team ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const teamId = parseInt(id);

        // Fetch team and users data in parallel
        const [teamResponse, allUsers] = await Promise.all([
          teamsService.getById(teamId),
          usersService.getAll(),
        ]);

        setTeam(teamResponse);

        // Set up team leader
        setTeamLeaderData(teamResponse, allUsers);

        // Fetch and set up team members
        await setTeamMembersData(teamId, allUsers);

        // Fetch team projects
        await fetchTeamProjects(teamId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching team data"
        );
      } finally {
        setLoading(false);
      }
    };

    // Helper function to set team leader data
    const setTeamLeaderData = (
      teamResponse: Team,
      allUsers: UserWithProfile[]
    ) => {
      const teamLeader = allUsers.find(
        (user) => user.id === teamResponse.leaderId
      );

      if (teamLeader) {
        // Format the date to show only day, month, and year
        let formattedDate = "January 2022"; // Default fallback
        if (teamResponse.createdAt) {
          const date = new Date(teamResponse.createdAt);
          formattedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }

        setTeamLeader({
          id: teamLeader.id,
          name: teamLeader.name,
          email: teamLeader.email,
          photo: teamLeader.image || "/default-profile.png",
          description: "Team Leader",
          isLeader: true,
          role: teamLeader.role || "Chief Technology Officer",
          joinDate: formattedDate,
          expertise: [
            "Project Management",
            "System Architecture",
            "Team Leadership",
          ],
        });
      }
    };

    // Helper function to fetch and set team members
    const setTeamMembersData = async (
      teamId: number,
      allUsers: UserWithProfile[]
    ) => {
      const membersResponse = await teamsService.getAllTeamMembers();

      const transformedMembers = membersResponse
        .filter((member) => member.teamId === teamId)
        .map((member) => {
          const userDetails = allUsers.find(
            (user) => user.id === member.userId
          );
          return {
            id: member.userId,
            name: userDetails?.name || "Unknown",
            email: userDetails?.email || "",
            description: member.user?.role || "Team Member",
            photo: userDetails?.image || "/default-profile.png",
          };
        });

      setTeamMembers(transformedMembers);
    };

    // Helper function to fetch team projects
    const fetchTeamProjects = async (teamId: number) => {
      try {
        // This would normally be an API call to get projects by team ID
        // For now, we'll simulate with mock data
        const mockProjects: Project[] = [
          {
            id: 1,
            name: "Company Website Redesign",
            description:
              "Redesigning the company website with modern UI/UX principles for better user engagement and conversion rates.",
            status: "in-progress",
            startDate: "2023-06-15",
            teamId: teamId,
            imageUrl:
              "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            technologies: ["React", "TypeScript", "TailwindCSS"],
          },
          {
            id: 2,
            name: "Mobile Application Development",
            description:
              "Creating a mobile application for both iOS and Android platforms to complement our web service offerings.",
            status: "planned",
            startDate: "2023-08-01",
            teamId: teamId,
            imageUrl:
              "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            technologies: ["React Native", "Firebase", "Redux"],
          },
          {
            id: 3,
            name: "Database Optimization",
            description:
              "Optimizing database queries and structure to improve application performance and response times.",
            status: "completed",
            startDate: "2023-03-10",
            endDate: "2023-05-20",
            teamId: teamId,
            imageUrl:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            technologies: ["PostgreSQL", "MongoDB", "Redis"],
          },
        ];

        // In a real application, you would fetch projects from an API
        // const projectsResponse = await projectsService.getByTeamId(teamId);
        setTeamProjects(mockProjects);
      } catch (error) {
        console.error("Error fetching team projects:", error);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container dark:bg-gray-800">
        <div className="loading-spinner"></div>
        <p className="loading-text dark:text-gray-300">Loading team data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container dark:bg-gray-800">
        <div className="error-icon">❌</div>
        <p className="error-message dark:text-red-300">Error: {error}</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="not-found-container dark:bg-gray-800">
        <div className="not-found-icon">🔍</div>
        <p className="not-found-message dark:text-gray-300">Team not found</p>
      </div>
    );
  }

  return (
    <div className="app dark:bg-gray-800">
      <header className="team-header dark:bg-gray-900 dark:border-b dark:border-gray-700">
        <div className="header-content">
          <div className="header-text" style={{ marginLeft: "2rem" }}>
            <h1 className="dark:text-white">{team.name}</h1>
            <p className="dark:text-gray-300">
              {team.description || "Building the future of technology together"}
            </p>
          </div>
        </div>
      </header>

      <div className="team-structure-container">
        {teamLeader && (
          <div className="leader-section dark:bg-gradient-to-br from-gray-800 to-gray-900 mb-8 rounded-xl shadow-2xl overflow-hidden border border-blue-500/30">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6">
              <h2 className="text-white text-2xl font-bold flex items-center">
                Leadership
              </h2>
            </div>

            <div className="leader-content p-8">
              <div className="leader-detailed-info flex flex-col md:flex-row gap-10">
                {/* Left column - Profile image and basic info */}
                <div className="leader-profile flex-shrink-0 flex flex-col items-center">
                  <div className="mb-5 relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-30 transform scale-110"></div>
                    <img
                      src={teamLeader.photo}
                      alt={`${teamLeader.name}'s profile`}
                      className="w-52 h-52 rounded-full object-cover border-4 border-blue-500 shadow-xl relative z-10"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-center dark:text-white mt-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {teamLeader.name}
                  </h3>
                </div>

                {/* Right column - Details */}
                <div className="leader-details flex-grow bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                  <div>
                    {/* Contact Information */}
                    <div className="contact-info">
                      <h4 className="font-semibold text-xl mb-4 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-2 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Contact & Professional Details
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center p-3 rounded-lg transition-colors bg-blue-100/90 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-700/40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-gray-700 dark:text-gray-300 text-lg">
                            <span className="font-medium text-gray-900 dark:text-blue-300">
                              Email:
                            </span>{" "}
                            <a
                              href={`mailto:${teamLeader.email}`}
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {teamLeader.email}
                            </a>
                          </p>
                        </div>
                        <div className="flex items-center p-3 rounded-lg transition-colors bg-blue-100/90 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-700/40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400"
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
                          <p className="text-gray-700 dark:text-gray-300 text-lg">
                            <span className="font-medium text-gray-900 dark:text-blue-300">
                              Joined:
                            </span>{" "}
                            {teamLeader.joinDate}
                          </p>
                        </div>
                        <div className="flex items-center p-3 rounded-lg transition-colors bg-blue-100/90 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-700/40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-gray-700 dark:text-gray-300 text-lg">
                            <span className="font-medium text-gray-900 dark:text-blue-300">
                              Position:
                            </span>{" "}
                            {teamLeader.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Areas of Expertise */}
                  <div className="mt-8">
                    <h4 className="font-semibold text-xl mb-4 dark:text-gray-200 border-b border-gray-600 pb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {teamLeader.expertise?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="members-section dark:bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/30 rounded-xl shadow-2xl p-8 mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6 -m-8 mb-8">
            <h2 className="text-white text-2xl font-bold flex items-center">
              Team Members
            </h2>
          </div>
          <p className="members-subtitle dark:text-gray-400 mb-8 text-center text-lg">
            Working together to achieve team goals
          </p>

          {teamMembers.length > 0 ? (
            <div className="team-members-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="team-member-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-all hover:shadow-blue-500/20 hover:shadow-xl"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/20 z-10"></div>
                    <img
                      src={member.photo}
                      alt={`${member.name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-20"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 mb-4 text-sm font-medium">
                      {member.description}
                    </p>

                    <div className="flex items-center mt-4 text-gray-300 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-black dark:text-white hover:text-blue-400 dark:hover:text-blue-400 transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-members dark:text-gray-400 text-center p-10 border border-dashed border-gray-700 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-lg">No team members found</p>
            </div>
          )}
        </div>

        {/* Team Projects Section */}
        <div className="projects-section dark:bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/30 rounded-xl shadow-2xl p-8 mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6 -m-8 mb-8">
            <h2 className="text-white text-2xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Team Projects
            </h2>
          </div>

          <p className="projects-subtitle dark:text-gray-400 mb-8 text-center text-lg">
            Innovative projects our team is working on
          </p>

          {teamProjects.length > 0 ? (
            <div className="team-projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-all hover:shadow-blue-500/20 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    {project.imageUrl ? (
                      <>
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-blue-900/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-blue-400/50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          project.status === "completed"
                            ? "bg-green-500 text-white"
                            : project.status === "in-progress"
                              ? "bg-yellow-500 text-gray-900"
                              : "bg-blue-500 text-white"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      {project.name}
                    </h3>
                    <p className="dark:text-gray-300 mb-4 text-sm line-clamp-2">
                      {project.description}
                    </p>

                    {/* Project Timeline */}
                    <div className="flex items-center mb-4 text-sm dark:text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5 text-blue-400"
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
                      {new Date(project.startDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {project.endDate && (
                        <>
                          <span className="mx-2">—</span>
                          {new Date(project.endDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </>
                      )}
                    </div>

                    {/* Technologies */}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-blue-700/80 to-blue-900/80 text-white px-2.5 py-1 rounded-md text-xs font-medium border border-blue-400 shadow-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-projects dark:text-gray-400 text-center p-10 border border-dashed border-gray-700 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-lg">No projects found for this team</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupDetail;
