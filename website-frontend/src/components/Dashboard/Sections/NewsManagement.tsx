import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import CreateNews from "./CreateNews";
import EditNews from "./Edit/EditNews";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  image?: string;
  createdAt: Date;
}

const NewsManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const articlesPerPage = 5;

  // Mock data for demonstration
  const mockArticles: Article[] = [
    {
      id: "1",
      title: "Lab receives new research grant",
      content:
        "Our lab has been awarded a substantial grant to further our research in machine learning applications.",
      author: "Dr. Smith",
      publishDate: "2023-05-15",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      createdAt: new Date("2023-05-15T10:30:00"),
    },
    {
      id: "2",
      title: "New team members joined",
      content:
        "We are happy to welcome three new researchers to our team this month.",
      author: "Lab Admin",
      publishDate: "2023-06-02",
      createdAt: new Date("2023-06-02T14:15:00"),
    },
    {
      id: "3",
      title: "Upcoming conference participation",
      content:
        "Our team will be presenting recent findings at the International Conference next month.",
      author: "Dr. Johnson",
      publishDate: "2023-06-20",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      createdAt: new Date("2023-06-20T09:45:00"),
    },
    {
      id: "4",
      title: "Lab renovation completed",
      content:
        "The renovation of our main research facility has been completed, providing improved workspace.",
      author: "Facilities Manager",
      publishDate: "2023-07-05",
      createdAt: new Date("2023-07-05T16:00:00"),
    },
    {
      id: "5",
      title: "Publication in Nature journal",
      content:
        "Our recent research on quantum computing has been published in Nature.",
      author: "Research Team",
      publishDate: "2023-07-18",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      createdAt: new Date("2023-07-18T11:20:00"),
    },
    {
      id: "6",
      title: "Annual lab symposium date announced",
      content:
        "Mark your calendars for our annual symposium scheduled for September 15-17.",
      author: "Events Committee",
      publishDate: "2023-08-01",
      createdAt: new Date("2023-08-01T13:10:00"),
    },
  ];

  useEffect(() => {
    // Simulate fetching news articles from an API
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setArticles(mockArticles);
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      setIsDeleting(id);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setArticles(articles.filter((article) => article.id !== id));
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // Refresh articles list (would fetch from API in real app)
    // For now, just simulate adding a new article to the list
    const newArticle: Article = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Article Title",
      content: "This is a newly created article content.",
      author: "Current User",
      publishDate: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    };
    setArticles([newArticle, ...articles]);
  };

  const handleEditSuccess = () => {
    setEditingArticleId(null);
    // In a real app, you would refresh the articles list
    // For now, we'll just leave it as is
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Render different views based on state
  if (showCreateForm) {
    return (
      <CreateNews
        onCancel={() => setShowCreateForm(false)}
        onSuccess={handleCreateSuccess}
      />
    );
  }

  if (editingArticleId) {
    return (
      <EditNews
        articleId={editingArticleId}
        onCancel={() => setEditingArticleId(null)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">News Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Article
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery
              ? "No articles match your search criteria"
              : "No articles available"}
          </div>
        ) : (
          <div className="space-y-6">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {article.image && (
                  <div className="w-full md:w-64 h-48 flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <div className="flex items-center mr-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.publishDate}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingArticleId(article.id)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        disabled={isDeleting === article.id}
                      >
                        {isDeleting === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstArticle + 1}-
                  {Math.min(indexOfLastArticle, filteredArticles.length)} of{" "}
                  {filteredArticles.length} articles
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;
