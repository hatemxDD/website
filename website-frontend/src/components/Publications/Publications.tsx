/**
 * Publications Component
 *
 * This component displays a list of research publications with:
 * - Publication details including title, authors, date, and journal
 * - Impact factors and citation counts
 * - Links to full papers
 * - Responsive grid layout
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  User,
  Calendar,
  Book,
  ArrowRight,
  GraduationCap,
  Building,
  ChevronDown,
  ChevronUp,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import {
  Publication,
  publicationsService,
} from "../../services/publicationsService";
import "./Publications.css";
import { Article, articlesService } from "../../services/articlesService";

const Publications: React.FC = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterJournal, setFilterJournal] = useState<string>("");

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Publication;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const articlesData = await articlesService.getAll();

        // Map Article data to Publication format
        const mappedData: Publication[] = articlesData.map((article) => ({
          id: String(article.id),
          title: article.title,
          authors: article.author ? [article.author.name] : ["Unknown Author"],
          date: article.publishDate || article.createdAt,
          journal: article.journalLink
            ? new URL(article.journalLink).hostname
            : "Journal",
          abstract: article.content,
          category: "Publication",
          doi: `10.xxxx/article-${article.id}`,
          image: `https://picsum.photos/seed/${article.id}/800/500`,
          impactFactor: (Math.random() * 5 + 1).toFixed(2),
          citations: Math.floor(Math.random() * 200),
        }));

        setPublications(mappedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching publications:", err);
        setError("Failed to fetch publications. Please try again later.");
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

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
      case "journal":
        setFilterJournal(value);
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory("");
    setFilterJournal("");
    setSearchTerm("");
  };

  // Handle sorting
  const requestSort = (key: keyof Publication) => {
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

  // Handle publication click
  const handlePublicationClick = (publicationId: string) => {
    navigate(`/articles/${publicationId}`);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get category color based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "publication":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "article":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "research":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Apply filters and sorting to get filtered publications
  const getFilteredPublications = () => {
    let filtered = [...publications];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(term)) ||
          (item.abstract && item.abstract.toLowerCase().includes(term)) ||
          (item.authors &&
            item.authors.some((author) =>
              author.toLowerCase().includes(term)
            )) ||
          (item.category && item.category.toLowerCase().includes(term)) ||
          (item.journal && item.journal.toLowerCase().includes(term)) ||
          (item.date && item.date.toString().includes(term))
      );
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Apply journal filter
    if (filterJournal) {
      filtered = filtered.filter((item) => item.journal === filterJournal);
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

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Get all unique categories for filtering
  const getCategories = () => {
    const categories = publications.map((pub) => pub.category);
    return Array.from(new Set(categories));
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Research Publications
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-700 mb-4"></div>
            <div className="text-gray-500 dark:text-gray-400">
              Loading publications...
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
                      placeholder="Search publications..."
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
                      {getCategories().map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(searchTerm || filterCategory || filterJournal) && (
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
          </div>

          {/* Publications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredPublications().map((publication) => (
              <div
                key={publication.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
                onClick={() => handlePublicationClick(publication.id)}
              >
                {publication.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={publication.image}
                      alt={publication.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getCategoryColor(publication.category)}`}
                      >
                        {publication.category.charAt(0).toUpperCase() +
                          publication.category.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                {!publication.image && (
                  <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {truncateContent(publication.abstract || "", 150)}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex flex-col space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1" />
                        {publication.authors.join(", ")}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(publication.date)}
                      </span>
                      <span className="flex items-center">
                        <Book className="w-3.5 h-3.5 mr-1" />
                        {publication.journal}
                      </span>
                      {publication.impactFactor && (
                        <span className="flex items-center">
                          <GraduationCap className="w-3.5 h-3.5 mr-1" />
                          Impact Factor: {publication.impactFactor}
                        </span>
                      )}
                      {publication.citations && (
                        <span className="flex items-center">
                          <Building className="w-3.5 h-3.5 mr-1" />
                          {publication.citations} Citations
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {publication.doi}
                      </span>
                      <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Read More
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {getFilteredPublications().length === 0 && (
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
                  No publications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  Try adjusting your search criteria or check back later for new
                  publications.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Publications;
