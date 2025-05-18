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
import LoadingState from "../Common/LoadingState";

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
    return <LoadingState type="detail" className="dark:bg-gray-800" />;
  }

  if (error || !currentNews) {
    return (
      <div className="news-detail error-container dark:bg-gray-800">
        <div className="error-message dark:bg-gray-700 dark:text-white">
          <div className="error-icon dark:bg-gray-600">!</div>
          <h3>{error || "News article not found"}</h3>
          <p className="dark:text-gray-300">
            We couldn't find the news article you were looking for.
          </p>
          <button
            onClick={() => navigate("/news")}
            className="back-button dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
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
    <div className="news-detail dark:bg-gray-800">
      <div className="news-header dark:bg-gray-800">
        <Link
          to="/news"
          className="back-button dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          <FaArrowLeft className="arrow-icon" />
          Back to News
        </Link>
        <div className="news-meta dark:text-gray-300">
          <span className="meta-item dark:text-gray-300">
            <FaCalendar className="meta-icon" />
            {formattedDate}
          </span>
          <span className="meta-item dark:text-gray-300">
            <FaUser className="meta-icon" />
            {currentNews.author?.name || "Research Team"}
          </span>
          <span className="meta-item dark:text-gray-300">
            <FaTag className="meta-icon" />
            {currentNews.category || "Research"}
          </span>
        </div>
      </div>

      <div className="news-content dark:bg-gray-800">
        <div className="news-hero dark:bg-gray-800">
          <div className="news-image dark:border-gray-700">
            <img src={newsImage} alt={currentNews.title} />
          </div>

          <div className="news-info dark:bg-gray-800 dark:text-white">
            <h1 className="dark:text-white">{currentNews.title}</h1>
            <p className="news-description dark:text-gray-300">
              Published on {formattedDate}
              {currentNews.author ? ` by ${currentNews.author.name}` : ""}
            </p>

            <div className="news-tags">
              <span className="news-tag primary-tag dark:bg-blue-800 dark:text-white">
                {currentNews.category || "Research"}
              </span>
              <span className="news-tag dark:bg-gray-700 dark:text-white">
                News
              </span>
              {currentNews.status && (
                <span className="news-tag status-tag dark:bg-green-800 dark:text-white">
                  {currentNews.status}
                </span>
              )}
            </div>

            <div className="news-actions">
              <button className="action-button dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                <FaShare className="action-icon" />
                Share
              </button>
              <button className="action-button dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                <FaBookmark className="action-icon" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="news-body dark:bg-gray-800 dark:text-gray-200">
          <div
            dangerouslySetInnerHTML={{ __html: currentNews.content || "" }}
          />
        </div>

        {relatedNews.length > 0 && (
          <div className="related-news dark:bg-gray-800">
            <h3 className="dark:text-white">Related News</h3>
            <div className="related-grid">
              {relatedNews.map((related) => (
                <Link
                  to={`/news/${related.id}`}
                  key={related.id}
                  className="related-card dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
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
                  <div className="related-content dark:text-white">
                    <span className="related-date dark:text-gray-300">
                      {new Date(related.createdAt).toLocaleDateString()}
                    </span>
                    <h4 className="dark:text-white">{related.title}</h4>
                    <span className="related-link dark:text-blue-400">
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
