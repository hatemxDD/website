import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import LoadingSkeleton from "../Common/LoadingSkeleton";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import "./ArticleDetails.css";

interface Article {
  id: number;
  title: string;
  author: {
    name: string;
  };
  publishDate: string;
  content: string;
  pdfLink?: string;
  journalLink?: string;
}

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) {
          throw new Error("Article not found");
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="article-details">
        <div className="article-header">
          <LoadingSkeleton type="title" width="70%" />
          <div className="article-meta">
            <LoadingSkeleton type="text" width="150px" />
            <LoadingSkeleton type="text" width="120px" />
          </div>
        </div>

        <div className="article-content">
          <LoadingSkeleton type="paragraph" count={5} fullWidth />
        </div>

        <div className="article-actions">
          <LoadingSkeleton type="button" width="150px" />
          <LoadingSkeleton type="button" width="150px" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>{error || "The requested article could not be found."}</p>
      </div>
    );
  }

  return (
    <div className="article-details">
      <button
        onClick={toggleDarkMode}
        className="theme-toggle-article"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>

      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className="author">By {article.author.name}</span>
          <span className="date">
            {new Date(article.publishDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="article-content">
        {article.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
      </div>

      <div className="article-actions">
        {article.pdfLink && (
          <a href={article.pdfLink} className="action-button" download>
            <FaDownload /> Download PDF
          </a>
        )}
        {article.journalLink && (
          <a
            href={article.journalLink}
            className="action-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt /> View in Journal
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleDetails;
