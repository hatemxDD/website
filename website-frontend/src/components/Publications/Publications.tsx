import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Calendar,
  Book,
  ArrowRight,
  Award,
  FileText,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import { Publication } from "../../services/publicationsService";
import "./Publications.css";
import { articlesService } from "../../services/articlesService";
import Footer from "../Layout/Footer";

const Publications: React.FC = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePublication, setActivePublication] = useState<string | null>(
    null
  );

  // States for searching
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Publication;
    direction: "ascending" | "descending";
  } | null>({ key: "date", direction: "descending" });

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
          image: `https://picsum.photos/seed/${article.id}/800/500`,
          citations: Math.floor(Math.random() * 200),
          impactFactor: (Math.random() * 5 + 1).toFixed(2),
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

  // Clear search
  const clearSearch = () => {
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

  // Apply search and sorting to get filtered publications
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
          (item.journal && item.journal.toLowerCase().includes(term)) ||
          (item.date && item.date.toString().includes(term))
      );
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

  // Get all unique journals for filtering
  const getJournals = () => {
    const journals = publications.map((pub) => pub.journal);
    return Array.from(new Set(journals));
  };

  // Toggle card expansion
  const toggleCardExpansion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePublication(activePublication === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section - Styled like Group.tsx */}
            <div className="groups-header dark:bg-gray-800">
              <h1 className="text-gradient dark:text-white">
                Research Publications
              </h1>
              <div className="header-decoration">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="dark:text-gray-300">
                Explore our collection of cutting-edge research papers,
                articles, and publications from renowned authors and journals
              </p>
            </div>

            {/* Search Section */}
            <div className="search-filter-container">
              <div className="search-filter dark:bg-gray-700">
                <div className="search-wrapper dark:bg-gray-600">
                  <Search className="search-icon dark:text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search by title, author, or keyword..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Results Stats */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {getFilteredPublications().length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {publications.length}
                </span>{" "}
                publications
              </p>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <button
                  onClick={() =>
                    setSortConfig({ key: "date", direction: "descending" })
                  }
                  className={`px-3 py-1 rounded-md mr-2 ${
                    sortConfig?.key === "date" &&
                    sortConfig?.direction === "descending"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() =>
                    setSortConfig({
                      key: "impactFactor",
                      direction: "descending",
                    })
                  }
                  className={`px-3 py-1 rounded-md ${
                    sortConfig?.key === "impactFactor" &&
                    sortConfig?.direction === "descending"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Highest Impact
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-4"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-6 py-8 rounded-md shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                      Error Loading Publications
                    </h3>
                    <p className="mt-2 text-red-700 dark:text-red-400">
                      {error}
                    </p>
                    <button
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-200 dark:bg-red-800/40 dark:hover:bg-red-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Publications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredPublications().map((publication) => (
                    <div
                      key={publication.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl ${
                        activePublication === publication.id
                          ? "ring-2 ring-indigo-500 transform scale-[1.02]"
                          : "hover:transform hover:scale-[1.01]"
                      }`}
                    >
                      <div
                        className="cursor-pointer group"
                        onClick={(e) => toggleCardExpansion(publication.id, e)}
                      >
                        {publication.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={publication.image}
                              alt={publication.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/50 to-transparent opacity-70"></div>
                            <div className="absolute top-4 right-4 flex space-x-2">
                              <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md text-xs font-medium flex items-center text-amber-600 dark:text-amber-400">
                                <Award className="w-3.5 h-3.5 mr-1" />
                                {publication.impactFactor}
                              </span>
                              <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md text-xs font-medium flex items-center text-blue-600 dark:text-blue-400">
                                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                                {Math.floor(Math.random() * 200)}
                              </span>
                            </div>
                          </div>
                        )}
                        {!publication.image && (
                          <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-indigo-400 dark:text-indigo-500" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="mb-3 flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                              {publication.title}
                            </h3>
                            <button className="ml-2 mt-1 flex-shrink-0 text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors duration-200">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                            {formatDate(publication.date)}
                            <span className="mx-2">•</span>
                            <Book className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                            {publication.journal}
                          </div>

                          <p
                            className={`text-gray-600 dark:text-gray-300 text-sm mb-4 ${
                              activePublication === publication.id
                                ? ""
                                : "line-clamp-3"
                            }`}
                          >
                            {truncateContent(
                              publication.abstract || "",
                              activePublication === publication.id ? 500 : 150
                            )}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {publication.authors.map((author, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                <User className="w-3 h-3 mr-1" />
                                {author}
                              </span>
                            ))}
                          </div>

                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end items-center">
                            <button
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 rounded-md transition-colors duration-200"
                              onClick={() =>
                                handlePublicationClick(publication.id)
                              }
                            >
                              Read Paper
                              <ArrowRight className="ml-1.5 w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getFilteredPublications().length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 border border-gray-100 dark:border-gray-700">
                      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                        <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                        No publications found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                        We couldn't find any publications matching your search
                        criteria. Try a different search term.
                      </p>
                      <button
                        onClick={clearSearch}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Publications;
