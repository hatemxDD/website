/**
 * Group Component
 *
 * Displays a list of research teams/groups.
 * Features:
 * - Grid layout of team cards
 * - Team information display
 * - Navigation to team details
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUsers,
  FaProjectDiagram,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import "./Group.css";
import { teamsService, Team } from "../../services/teamsService";
import { projectsService } from "../../services/projectsService";

interface TeamWithCounts extends Team {
  memberCount: number;
  projectCount: number;
}

const Group: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [teams, setTeams] = useState<TeamWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        // Fetch teams from the backend
        const teamsData = await teamsService.getAll();

        // Add member and project counts for each team
        const teamsWithCounts = await Promise.all(
          teamsData.map(async (team) => {
            // Get team members count
            const members = await teamsService.getMembers(team.id);

            // Get projects for this team
            const projects = await projectsService.getByTeam(team.id);

            return {
              ...team,
              memberCount: members.length,
              projectCount: projects.length,
            };
          })
        );

        setTeams(teamsWithCounts);
        setError(null);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && team.projectCount > 0;
    if (filter === "members") return matchesSearch && team.memberCount >= 3;
    return matchesSearch;
  });

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>Research Teams</h1>
        <p>Explore our specialized research teams and their innovative work</p>
      </div>

      <div className="search-filter">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or description..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Teams</option>
          <option value="active">Active Projects</option>
          <option value="members">Large Teams (3+ members)</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading teams...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="groups-list">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="group-card"
                onClick={() => navigate(`/teams/${team.id}`)}
              >
                <div className="group-image">
                  {/* Use a generic image or based on team acronym */}
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(team.acro)}&size=200&background=random&bold=true&color=fff`}
                    alt={team.name}
                  />
                  <div className="group-overlay">
                    <span className="group-focus">{team.acro}</span>
                  </div>
                </div>
                <div className="group-content">
                  <div className="group-header">
                    <h2>{team.name}</h2>
                    <span className="group-acronym">{team.acro}</span>
                  </div>
                  <p className="group-description">
                    {team.description || "No description available"}
                  </p>
                  <div className="group-meta">
                    <div className="meta-item">
                      <FaUsers />
                      <span>{team.memberCount} Members</span>
                    </div>
                    <div className="meta-item">
                      <FaProjectDiagram />
                      <span>{team.projectCount} Projects</span>
                    </div>
                  </div>
                  <div className="group-action">
                    <span>View Details</span>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="empty-state">
              <h3>No teams found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Group;
