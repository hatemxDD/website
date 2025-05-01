/**
 * Profile Component
 *
 * User profile page component.
 * Features:
 * - Display user information
 * - Publications list
 */

import React, { useState, useEffect } from "react";
import { FaEnvelope, FaUser, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import "./Profile.css";
import { usersService } from "../../services/usersService";
import { articlesService, Article } from "../../services/articlesService";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileProps {
  userId?: number;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use the provided userId, or the one from URL params, or the authenticated user's id
  const targetUserId = userId || (id ? parseInt(id) : authUser?.id || 0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (!targetUserId) {
          setError("User ID not provided");
          return;
        }

        // Fetch user data
        const userData = await usersService.getById(targetUserId);
        setUser(userData);

        // Fetch user's articles
        const articlesData = await articlesService.getByAuthor(targetUserId);
        setArticles(articlesData);

        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [targetUserId]);

  if (loading) {
    return <div className="p-4 text-center">Loading user data...</div>;
  }

  if (error || !user) {
    return (
      <div className="p-4 text-center text-red-600">
        {error || "User not found"}
      </div>
    );
  }

  // Generate avatar URL if not provided
  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

  // Format join date
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-info">
          <img src={avatar} alt={user.name} className="profile-avatar" />
          <h2>{user.name}</h2>
          <p className="role">{user.role}</p>

          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <span>Joined: {joinDate}</span>
          </div>
          <div className="info-item">
            <FaUser className="info-icon" />
            <span>{user.department || "Research Department"}</span>
          </div>
          <div className="info-item">
            <FaBriefcase className="info-icon" />
            <span>{user.position || "Researcher"}</span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <h3>{articles.length}</h3>
            <p>Articles</p>
          </div>
          <div className="stat-item">
            <h3>{user.memberOfTeams?.length || 0}</h3>
            <p>Teams</p>
          </div>
        </div>
      </div>

      <div className="profile-main">
        <section className="publications-section">
          <h2>Articles</h2>
          {articles.length === 0 ? (
            <p className="text-gray-500 italic p-4">
              No articles published yet.
            </p>
          ) : (
            <div className="publications-list">
              {articles.map((article) => (
                <div key={article.id} className="publication-card">
                  <h3>{article.name}</h3>
                  <p className="journal">
                    Published:{" "}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                  <p className="abstract">
                    {article.content.substring(0, 200)}...
                  </p>
                  <div className="publication-links">
                    <Link
                      to={`/articles/${article.id}`}
                      className="read-more-link"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
