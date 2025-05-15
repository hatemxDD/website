import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  Calendar,
  Trash2,
  Edit,
  Eye,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import { newsService } from "../../../../services/newsService";

interface News {
  id: number;
  title: string;
  content?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  category?: string;
  status?: string;
  publishDate: string;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

// Available categories for filtering
const categories = [
  "announcement",
  "event",
  "achievement",
  "publication",
  "general",
];

const SeeNews: React.FC = () => {
  const navigate = useNavigate();

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterAuthor, setFilterAuthor] = useState<string>("");
  const [expandedNews, setExpandedNews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<News[]>([]);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof News;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getAll();
        setNews(response as News[]);
        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Add state for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case "category":
        setFilterCategory(value);
        break;
      case "author":
        setFilterAuthor(value);
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory("");
    setFilterAuthor("");
    setSearchTerm("");
  };

  // Handle sorting
  const requestSort = (key: keyof News) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Toggle news expansion
  const toggleNewsExpansion = (newsId: string) => {
    setExpandedNews((prev) =>
      prev.includes(newsId)
        ? prev.filter((id) => id !== newsId)
        : [...prev, newsId]
    );
  };

  // Get category color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "announcement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "publication":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "event":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "achievement":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "general":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Apply filters and sorting to get filtered news
  const getFilteredNews = () => {
    let filtered = [...news];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(term)) ||
          (item.content && item.content.toLowerCase().includes(term)) ||
          (item.author?.name &&
            item.author.name.toLowerCase().includes(term)) ||
          (item.category && item.category.toLowerCase().includes(term)) ||
          (item.publishDate && item.publishDate.toLowerCase().includes(term)) ||
          (item.status && item.status.toLowerCase().includes(term)) ||
          (item.image && item.image.toString().includes(term))
      );
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // Apply author filter
    if (filterAuthor) {
      filtered = filtered.filter((item) => item.author?.name === filterAuthor);
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1; // Put undefined values at the end
        if (bValue === undefined) return -1; // Put undefined values at the end

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Add delete handler
  const handleDelete = async (newsId: number) => {
    if (deleteConfirm !== newsId) {
      setDeleteConfirm(newsId);
      return;
    }

    try {
      await newsService.delete(newsId);
      setNews((prev) => prev.filter((item) => item.id !== newsId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  // Add a function to handle navigation to news detail
  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  // Add handleEdit function
  const handleEdit = (newsId: number) => {
    navigate(`/dashboard/LabLeader/news/edit/${newsId}`);
  };

  // Whether to show delete controls (could be based on user role)
  const showDeleteControls = true;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          News Management
        </h2>
        <Link
          to="/dashboard/LabLeader/news/add"
          className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]"
        >
          <FaPlus className="mr-2" />
          Add News
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-700 mb-4"></div>
            <div className="text-gray-500 dark:text-gray-400">
              Loading news...
            </div>
          </div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="w-6 h-6 mr-4 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search news..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative min-w-[180px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(searchTerm || filterCategory || filterAuthor) && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="group px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("title")}
                      >
                        Title
                        {sortConfig?.key === "title" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="group px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("category")}
                      >
                        Category
                        {sortConfig?.key === "category" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="group px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("publishDate")}
                      >
                        Publish Date
                        {sortConfig?.key === "publishDate" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="group px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => requestSort("status")}
                      >
                        Status
                        {sortConfig?.key === "status" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {getFilteredNews().map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                        onClick={() => handleNewsClick(item.id)}
                      >
                        {item.title}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 cursor-pointer"
                        onClick={() => handleNewsClick(item.id)}
                      >
                        {truncateContent(item.content || "", 100)}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => handleNewsClick(item.id)}
                      >
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                            item.category === "announcement"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                              : item.category === "event"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : item.category === "achievement"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                  : item.category === "publication"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {(item.category || "general")
                            .charAt(0)
                            .toUpperCase() +
                            (item.category || "general").slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 cursor-pointer"
                        onClick={() => handleNewsClick(item.id)}
                      >
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {formatDate(item.publishDate)}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => handleNewsClick(item.id)}
                      >
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (item.status || "draft") === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {(item.status || "draft").charAt(0).toUpperCase() +
                            (item.status || "draft").slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleNewsClick(item.id)}
                            className="p-1.5 text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-200"
                            title="View news"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id);
                            }}
                            className="p-1.5 text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-200"
                            title="Edit news"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {showDeleteControls && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className={`p-1.5 ${
                                deleteConfirm === item.id
                                  ? "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
                                  : "text-gray-600 hover:text-red-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-red-300"
                              } rounded-md transition-colors duration-200`}
                              title={
                                deleteConfirm === item.id
                                  ? "Confirm delete"
                                  : "Delete news"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {getFilteredNews().length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9.663 17h4.673M12 3v1m0 16v1m-9-9h1m16 0h1m-2.947-7.053l-.708.708M5.654 7.655l-.708-.708M5.654 16.345l-.708.708m14.702-7.398l-.708-.708"
                            />
                          </svg>
                          <p className="font-medium">No news found</p>
                          <p className="mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* News Cards - Alternative View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredNews().map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {item.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          item.category === "announcement"
                            ? "bg-blue-100 text-blue-800"
                            : item.category === "event"
                              ? "bg-green-100 text-green-800"
                              : item.category === "achievement"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.category === "publication"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                        } bg-opacity-90`}
                      >
                        {(item.category || "general").charAt(0).toUpperCase() +
                          (item.category || "general").slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                {!item.image && (
                  <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                      onClick={() => handleNewsClick(item.id)}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {truncateContent(item.content || "", 150)}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1" />
                        {item.author?.name || "Unknown"}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(item.publishDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (item.status || "draft") === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {(item.status || "draft").charAt(0).toUpperCase() +
                          (item.status || "draft").slice(1)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleNewsClick(item.id)}
                          className="p-1.5 text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-200"
                          title="View news"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.id);
                          }}
                          className="p-1.5 text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-200"
                          title="Edit news"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {showDeleteControls && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className={`p-1.5 ${
                              deleteConfirm === item.id
                                ? "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
                                : "text-gray-600 hover:text-red-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-red-300"
                            } rounded-md transition-colors duration-200`}
                            title={
                              deleteConfirm === item.id
                                ? "Confirm delete"
                                : "Delete news"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {getFilteredNews().length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow p-12">
                <svg
                  className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.663 17h4.673M12 3v1m0 16v1m-9-9h1m16 0h1m-2.947-7.053l-.708.708M5.654 7.655l-.708-.708M5.654 16.345l-.708.708m14.702-7.398l-.708-.708"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No news found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  Try adjusting your search criteria or add some news to get
                  started.
                </p>
                <Link
                  to="/dashboard/LabLeader/news/add"
                  className="mt-6 flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="mr-2" />
                  Add News
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SeeNews;
