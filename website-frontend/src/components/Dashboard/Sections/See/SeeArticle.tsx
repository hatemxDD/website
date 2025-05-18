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
  Eye,
  ChevronRight,
  Users,
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


        // Fetch only articles by the current user
        const response = await articlesService.getByAuthor(user?.id || 0);
        console.log("User's articles from API:", response);
        console.log("User's ID:", user?.id);
        // Ensure coAuthors property exists even if it's not returned from backend
        const articlesWithCoAuthors = response.map((article) => ({
          ...article,
          coAuthors: article.coAuthors || [],
        }));

        setArticles(articlesWithCoAuthors);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load your articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

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
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
          <span className="text-gray-600 font-medium">Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800">
          <span className="text-blue-600">Your</span> Articles
        </h2>
        <button
          onClick={handleAddArticle}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add Article</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm flex items-start">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {articles.length === 0 && !loading ? (
        <div className="bg-amber-50 border-l-4 border-amber-400 text-amber-800 px-6 py-8 rounded-lg text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
            <p className="mb-4">
              Create your first article by clicking the "Add Article" button
              above.
            </p>
            <button
              onClick={handleAddArticle}
              className="px-4 py-2 bg-amber-600 text-white rounded-md flex items-center mx-auto gap-2 hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <h3
                  className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleViewArticle(article.id)}
                >
                  {article.title}
                </h3>

                <div className="flex flex-col space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500 space-x-5">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-1.5 mt-0.5 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {article.author?.name || "Unknown Author"}
                      </div>

                      <div className="mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3.5 w-3.5 mr-1 text-blue-400" />
                          <span className="font-medium">Co-authors:</span>
                        </div>

                        {article.coAuthors && article.coAuthors.length > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {article.coAuthors.map((coAuthor) => (
                              <span
                                key={coAuthor.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                              >
                                {coAuthor.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-gray-500 italic">
                            No co-authors
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm line-clamp-3 mb-5 text-gray-600">
                  {/* Strip HTML tags for preview */}
                  {article.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                  {article.content.length > 150 ? "..." : ""}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => handleViewArticle(article.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditArticle(article.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit Article"
                  >
                    <Edit className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteArticle(article.id)}
                    disabled={isDeleting && deleteArticleId === article.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Delete Article"
                  >
                    {isDeleting && deleteArticleId === article.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
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
