import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { TeamCard } from "./TeamCard";
import { TeamArticles } from "./TeamArticles";
import { ArticleSection } from "../Article/ArticleSection";
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
}

interface TeamLeader {
  id: number;
  name: string;
  email: string;
  photo: string;
  description: string;
  isLeader: boolean;
}

interface TeamMemberExtended {
  id: number;
  name: string;
  email: string;
  description: string;
  photo: string;
}

function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teamLeader, setTeamLeader] = useState<TeamLeader | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberExtended[]>([]);

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
        setTeamLeader({
          id: teamLeader.id,
          name: teamLeader.name,
          email: teamLeader.email,
          photo: teamLeader.image || "/default-profile.png",
          description: "Team Leader",
          isLeader: true,
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
          <Users size={48} className="team-icon dark:text-blue-400" />
          <div className="header-text">
            <h1 className="dark:text-white">{team.name}</h1>
            <p className="dark:text-gray-300">
              {team.description || "Building the future of technology together"}
            </p>
          </div>
        </div>
      </header>

      <div className="team-structure-container">
        {teamLeader && (
          <div className="leader-section dark:bg-gray-700 dark:border dark:border-gray-600 mb-8 rounded-lg">
            <div className="leader-content p-6">
              <div className="leader-info mb-4">
                <h2 className="leader-title dark:text-white text-2xl font-bold">
                  Team Leader
                </h2>
                <p className="leader-description dark:text-gray-300">
                  {teamLeader.description}
                </p>
              </div>
              <div className="leader-card-container">
                <TeamCard
                  name={teamLeader.name}
                  description="Chief Technology Officer"
                  isLeader={teamLeader.isLeader}
                  photo={teamLeader.photo}
                  email={teamLeader.email}
                />
              </div>
            </div>
          </div>
        )}

        <div className="members-section dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 mt-8">
          <h2 className="members-title dark:text-white text-2xl font-bold mb-2">
            Team Members
          </h2>
          <p className="members-subtitle dark:text-gray-400 mb-6">
            Working together to achieve team goals
          </p>

          <section className="team-grid">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <TeamCard
                  key={index}
                  name={member.name}
                  description={member.description}
                  photo={member.photo}
                  isLeader={false}
                  email={member.email}
                />
              ))
            ) : (
              <div className="no-members dark:text-gray-400">
                No team members found
              </div>
            )}
          </section>
        </div>
      </div>

      <TeamArticles />
      <ArticleSection />
    </div>
  );
}

export default GroupDetail;
