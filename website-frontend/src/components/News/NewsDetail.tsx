import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaTag,
  FaShare,
  FaBookmark,
  FaChevronRight,
} from "react-icons/fa";
import "./NewsDetail.css";
import { newsService, News } from "../../services/newsService";

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        if (!id) {
          setError("News ID not provided");
          return;
        }

        // Fetch the news article
        const newsItem = await newsService.getById(parseInt(id));
        setCurrentNews(newsItem);

        // Fetch related news based on category if available
        const allNews = await newsService.getAll();
        const related = allNews
          .filter((item) => item.id !== parseInt(id))
          .sort(() => 0.5 - Math.random()) // Simple randomization
          .slice(0, 3); // Limit to 3 related items

        setRelatedNews(related);
        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news article. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="news-detail loading-container">
        <div className="news-header skeleton-header">
          <div className="back-button-skeleton"></div>
          <div className="meta-skeleton">
            <div className="meta-item-skeleton"></div>
            <div className="meta-item-skeleton"></div>
            <div className="meta-item-skeleton"></div>
          </div>
        </div>

        <div className="news-content">
          <div className="news-image skeleton-image">
            <div className="loading-pulse"></div>
          </div>

          <div className="news-info skeleton-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>

            <div className="skeleton-tags">
              <div className="skeleton-tag"></div>
              <div className="skeleton-tag"></div>
              <div className="skeleton-tag"></div>
            </div>

            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>

            <div className="skeleton-content">
              <div className="skeleton-paragraph"></div>
              <div className="skeleton-paragraph"></div>
              <div className="skeleton-paragraph"></div>
              <div className="skeleton-paragraph"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentNews) {
    return (
      <div className="news-detail error-container">
        <div className="error-message">
          <div className="error-icon">!</div>
          <h3>{error || "News article not found"}</h3>
          <p>We couldn't find the news article you were looking for.</p>
          <button onClick={() => navigate("/news")} className="back-button">
            <FaArrowLeft className="arrow-icon" />
            Back to News
          </button>
        </div>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(currentNews.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Generate image if not provided
  const newsImage =
    currentNews.image || `https://picsum.photos/seed/${currentNews.id}/800/500`;

  return (
    <div className="news-detail">
      <div className="news-header">
        <Link to="/news" className="back-button">
          <FaArrowLeft className="arrow-icon" />
          Back to News
        </Link>
        <div className="news-meta">
          <span className="meta-item">
            <FaCalendar className="meta-icon" />
            {formattedDate}
          </span>
          <span className="meta-item">
            <FaUser className="meta-icon" />
            {currentNews.author?.name || "Research Team"}
          </span>
          <span className="meta-item">
            <FaTag className="meta-icon" />
            {currentNews.category || "Research"}
          </span>
        </div>
      </div>

      <div className="news-content">
        <div className="news-hero">
          <div className="news-image">
            <img src={newsImage} alt={currentNews.title} />
          </div>

          <div className="news-info">
            <h1>{currentNews.title}</h1>
            <p className="news-description">
              Published on {formattedDate}
              {currentNews.author ? ` by ${currentNews.author.name}` : ""}
            </p>

            <div className="news-tags">
              <span className="news-tag primary-tag">
                {currentNews.category || "Research"}
              </span>
              <span className="news-tag">News</span>
              {currentNews.status && (
                <span className="news-tag status-tag">
                  {currentNews.status}
                </span>
              )}
            </div>

            <div className="news-actions">
              <button className="action-button">
                <FaShare className="action-icon" />
                Share
              </button>
              <button className="action-button">
                <FaBookmark className="action-icon" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="news-body">
          <div
            dangerouslySetInnerHTML={{ __html: currentNews.content || "" }}
          />
        </div>

        {relatedNews.length > 0 && (
          <div className="related-news">
            <h3>Related News</h3>
            <div className="related-grid">
              {relatedNews.map((related) => (
                <Link
                  to={`/news/${related.id}`}
                  key={related.id}
                  className="related-card"
                >
                  <div className="related-image">
                    <img
                      src={
                        related.image ||
                        `https://picsum.photos/seed/${related.id}/400/300`
                      }
                      alt={related.title}
                    />
                  </div>
                  <div className="related-content">
                    <span className="related-date">
                      {new Date(related.createdAt).toLocaleDateString()}
                    </span>
                    <h4>{related.title}</h4>
                    <span className="related-link">
                      Read more <FaChevronRight className="chevron-icon" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
