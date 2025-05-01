import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { newsService, News } from "../../services/newsService";
import "./NewsList.css";

export const NewsList: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await newsService.getAll();
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news data");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="newslist-container loading-state">
        <FaSpinner className="spinner" />
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="newslist-container error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="newslist-container">
      <div className="newslist-header">
        <h1>Latest Research News</h1>
        <p>
          Stay updated with our latest research breakthroughs and achievements
        </p>
      </div>

      {news.length === 0 ? (
        <div className="newslist-empty">
          <p>No news articles available at this time.</p>
        </div>
      ) : (
        <div className="newslist-grid">
          {news.map((newsItem) => (
            <div
              key={newsItem.id}
              className="newslist-card"
              onClick={() => navigate(`/news/${newsItem.id}`)}
            >
              <div className="newslist-image-wrapper">
                <img
                  src={
                    newsItem.image ||
                    `https://picsum.photos/seed/${newsItem.id}/800/600`
                  }
                  alt={newsItem.title}
                />
                <div className="newslist-overlay">
                  <span className="newslist-category">Research</span>
                  <span className="newslist-date">
                    {new Date(newsItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="newslist-content">
                <h2>{newsItem.title}</h2>
                <div className="newslist-author">
                  <span className="newslist-author-name">
                    {newsItem.author?.name || "Research Team"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
