import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { newsService, News } from "../../services/newsService";
import LoadingSkeleton from "../Common/LoadingSkeleton";
import "./NewsList.css";
import Footer from "../Layout/Footer";

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
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="newslist-container dark:bg-gray-800 dark:text-gray-200">
            <div className="groups-header dark:bg-gray-800 dark:text-white">
              <LoadingSkeleton type="title" width="60%" />
              <div className="header-decoration">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <LoadingSkeleton type="paragraph" width="80%" />
            </div>

            <div className="newslist-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="newslist-card dark:bg-gray-700 dark:border-gray-600"
                >
                  <LoadingSkeleton type="image" height="200px" />
                  <div className="newslist-content" style={{ padding: "15px" }}>
                    <LoadingSkeleton type="title" width="90%" />
                    <div style={{ marginTop: "10px" }}>
                      <LoadingSkeleton type="text" width="40%" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="newslist-container error-state dark:bg-gray-800 dark:text-gray-200">
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="newslist-container dark:bg-gray-800">
          <div className="groups-header dark:bg-gray-800 dark:text-white">
            <h1 className="text-gradient dark:text-white">
              Latest Research News
            </h1>
            <div className="header-decoration">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="dark:text-gray-300">
              Stay updated with our latest research breakthroughs and
              achievements
            </p>
          </div>

          {news.length === 0 ? (
            <div className="newslist-empty dark:text-gray-300">
              <p>No news articles available at this time.</p>
            </div>
          ) : (
            <div className="newslist-grid">
              {news.map((newsItem) => (
                <div
                  key={newsItem.id}
                  className="newslist-card dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
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
                    <div className="newslist-overlay dark:bg-opacity-70">
                      <span className="newslist-category dark:bg-blue-600 dark:text-white">
                        Research
                      </span>
                      <span className="newslist-date dark:text-gray-300">
                        {new Date(newsItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="newslist-content dark:text-white">
                    <h2 className="dark:text-white">{newsItem.title}</h2>
                    <div className="newslist-author">
                      <span className="newslist-author-name dark:text-gray-300">
                        {newsItem.author?.name || "Research Team"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
