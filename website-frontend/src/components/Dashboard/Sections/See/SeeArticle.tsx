import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import { articlesService, Article } from "../../../../services/articlesService";
import { useAuth } from "../../../../contexts/AuthContext";

const SeeArticle: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await articlesService.getAll();
        setArticles(response);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleAddArticle = () => {
      navigate(`/dashboard/${user?.role}/articles/add`);
  };

  const handleEditArticle = (id: number) => {
    navigate(`/dashboard/${user?.role}/articles/edit/${id}`);
  };

  const handleViewArticle = (id: number) => {
    navigate(`/articles/${id}`);
  };

  const handleDeleteArticle = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this article? This will remove it from the database."
      )
    ) {
      try {
        setDeleteArticleId(id);
        setIsDeleting(true);

        await articlesService.delete(id);

        // Remove the deleted article from the state
        setArticles(articles.filter((article) => article.id !== id));
      } catch (err) {
        console.error("Error deleting article:", err);
        setError("Failed to delete article. Please try again.");
      } finally {
        setIsDeleting(false);
        setDeleteArticleId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading articles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
        <button
          onClick={handleAddArticle}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Article</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {articles.length === 0 && !loading ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          No articles found. Create your first article by clicking the "Add
          Article" button.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => handleViewArticle(article.id)}
                >
                  {article.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{formatDate(article.publishDate)}</span>
                  </div>

                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1.5" />
                    <span>{article.author?.name || "Unknown Author"}</span>
                  </div>
                </div>

                <div className="prose prose-sm line-clamp-3 mb-4 text-gray-600">
                  {/* Strip HTML tags for preview */}
                  {article.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                  {article.content.length > 150 ? "..." : ""}
                </div>

                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleViewArticle(article.id)}
                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEditArticle(article.id)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    disabled={isDeleting && deleteArticleId === article.id}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center disabled:opacity-50"
                  >
                    {isDeleting && deleteArticleId === article.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeArticle;
