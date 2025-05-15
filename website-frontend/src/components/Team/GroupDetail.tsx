/**
 * GroupDetail Component
 *
 * This component represents the detailed view of a team, displaying:
 * - Team leader information with enhanced visibility
 * - Team members in a grid layout
 * - Related team articles and publications
 * - Responsive design for various screen sizes
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { TeamCard } from "./TeamCard";
import { TeamArticles } from "./TeamArticles";
import { ArticleSection } from "../Article/ArticleSection";
import { teamsService, Team, TeamMember } from "../../services/teamsService";
import "./GroupDetail.css";

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
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Team ID is required");
        }

        // Fetch team details
        const teamResponse = await teamsService.getById(parseInt(id));
        console.log(teamResponse);
        setTeam(teamResponse);

        // Setup team leader data
        if (teamResponse.leader) {
          setTeamLeader({
            id: teamResponse.leader.id,
            name: teamResponse.leader.name,
            email: teamResponse.leader.email,
            photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamResponse.leader.name)}&size=200&background=4a90e2&color=fff`,
            description: "Team Leader",
            isLeader: true,
          });
        }

        // Fetch all team members
        const membersResponse = await teamsService.getAllTeamMembers();

        // Transform members data - filter first for current team only
        const transformedMembers = membersResponse
          .filter(
            (member) =>
              member.teamId === parseInt(id) &&
              member.user &&
              member.userId !== teamResponse.leaderId
          )
          .map((member) => ({
            id: member.user!.id,
            name: member.user!.name,
            email: member.user!.email,
            description: member.user!.role || "Team Member",
            photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              member.user!.name
            )}&size=200&background=random&color=fff`,
          }));

        console.log(transformedMembers);
        setTeamMembers(transformedMembers);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching team data"
        );
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading team data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!team) {
    return <div className="not-found">Team not found</div>;
  }

  return (
    <div className="app">
      <header className="team-header">
        <Users size={48} className="team-icon" />
        <h1>{team.name}</h1>
        <p>
          {team.description || "Building the future of technology together"}
        </p>
      </header>

      {teamLeader && (
        <div className="leader-section">
          <div className="leader-content">
            <div className="leader-info">
              <h2 className="leader-title">Team Leader</h2>
              <p className="leader-description">{teamLeader.description}</p>
            </div>
            <div className="leader-card-container">
              <TeamCard
                name={teamLeader.name}
                description="Chief Technology Officer"
                isLeader={teamLeader.isLeader}
                photo={teamLeader.photo}
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="members-title">Team Members</h2>

      <section className="team-grid">
        {teamMembers.map((member, index) => (
          <TeamCard
            key={index}
            name={member.name}
            description={member.description}
            photo={member.photo}
            isLeader={false}
          />
        ))}
      </section>

      <TeamArticles />
      <ArticleSection />
    </div>
  );
}

export default GroupDetail;
