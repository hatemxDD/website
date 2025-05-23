import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUsers,
  FaProjectDiagram,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import "./Group.css";
import { teamsService, Team } from "../../services/teamsService";
import { projectsService } from "../../services/projectsService";
import LoadingState from "../Common/LoadingState";
import Footer from "../Layout/Footer";

interface TeamWithCounts extends Team {
  memberCount: number;
  projectCount: number;
}

const Group: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState<TeamWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        // Fetch teams from the backend
        const teamsData = await teamsService.getAll();
        const projectsData = await projectsService.getAll();
        // Add member and project counts for each team
        const teamsWithCounts = await Promise.all(
          teamsData.map(async (team) => {
            // Get projects for this team
            const projects = projectsData.filter(
              (project) => project.teamId === team.id
            );
            return {
              ...team,
              memberCount: team.members?.length || 0,
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
    return (
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="groups-container dark:bg-gray-800">
          <div className="groups-header dark:bg-gray-800">
            <h1 className="text-gradient dark:text-white">Research Teams</h1>
            <div className="header-decoration">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="dark:text-gray-300">
              Explore our specialized research teams and their innovative work
            </p>
          </div>

          <div className="search-filter-container">
            <div className="search-filter dark:bg-gray-700">
              <div className="search-wrapper dark:bg-gray-600">
                <FaSearch className="search-icon dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="search-input dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingState
              type="grid"
              count={6}
              withImage={true}
              withActions={true}
              className="groups-loading"
            />
          ) : error ? (
            <div className="error-state dark:bg-gray-800 dark:text-gray-300">
              <p>{error}</p>
              <button className="retry-button">Try Again</button>
            </div>
          ) : (
            <>
              <div className="groups-list">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="group-card dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <div className="group-image">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(team.acro)}&size=200&background=random&bold=true&color=fff`}
                        alt={team.name}
                      />
                      <div className="group-overlay dark:bg-opacity-70">
                        <div className="overlay-top">
                          <span className="group-focus dark:bg-blue-600 dark:text-white">
                            {team.acro}
                          </span>
                          {team.projectCount > 0 && (
                            <span className="featured-badge">
                              <FaStar /> Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="group-content dark:text-white">
                      <div className="group-header">
                        <h2 className="group-title dark:text-white">
                          {team.name}
                        </h2>
                        <span className="group-acronym dark:text-gray-300">
                          {team.acro}
                        </span>
                      </div>
                      <p className="group-description dark:text-gray-300">
                        {team.description || "No description available"}
                      </p>
                      <div className="group-meta dark:text-gray-300">
                        <div className="meta-item dark:text-gray-300">
                          <FaUsers className="meta-icon" />
                          <span className="dark:text-gray-300">
                            {team.memberCount} Members
                          </span>
                        </div>
                        <div className="meta-item dark:text-gray-300">
                          <FaProjectDiagram className="meta-icon" />
                          <span className="dark:text-gray-300">
                            {team.projectCount} Projects
                          </span>
                        </div>
                      </div>
                      <div className="group-action dark:text-blue-400 dark:hover:text-blue-300">
                        <span>View Details</span>
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTeams.length === 0 && (
                <div className="empty-state dark:bg-gray-700 dark:text-white">
                  <h3 className="dark:text-white">No teams found</h3>
                  <p className="dark:text-gray-300">
                    Try adjusting your search criteria
                  </p>
                  <button
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchTerm("");
                    }}
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Group;
