import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  FileText,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import { articlesService } from "../../../../services/articlesService";
import { usersService, User } from "../../../../services/usersService";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTheme } from "../../../../contexts/ThemeContext";

const AddArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [journalLink, setJournalLink] = useState("");
  const [coAuthors, setCoAuthors] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!id;

  // Fetch all users for the co-authors selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const users = await usersService.getAll();
        // Filter out the current user
        const filteredUsers = users.filter((u) => u.id !== user?.id);
        setAvailableUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user?.id]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const articleId = parseInt(id);
        const article = await articlesService.getById(articleId);

        setTitle(article.title);
        setContent(article.content);
        setPdfLink(article.pdfLink || "");
        setJournalLink(article.journalLink || "");

        // Fetch co-authors if they exist
        if (article.coAuthors && article.coAuthors.length > 0) {
          setCoAuthors(article.coAuthors as User[]);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article for editing. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditMode) {
      fetchArticle();
    }
  }, [id, isEditMode]);

  const handleAddCoAuthor = (user: User) => {
    setCoAuthors((prev) => [...prev, user]);
  };

  const handleRemoveCoAuthor = (userId: number) => {
    setCoAuthors((prev) => prev.filter((author) => author.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError("You must be logged in to create an article");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // The current date will be used for the publish date
      const currentDate = new Date();

      // Get co-author IDs
      const coAuthorIds = coAuthors.map((author) => author.id);

      if (isEditMode && id) {
        await articlesService.update(parseInt(id), {
          title,
          content,
          publishDate: currentDate,
          pdfLink,
          journalLink,
          coAuthorIds,
        });
      } else {
        await articlesService.create({
          title,
          content,
          publishDate: currentDate,
          authorId: user.id,
          pdfLink,
          journalLink,
          coAuthorIds,
        });
      }

      navigate(`/dashboard/${user.role}/articles`);
    } catch (err) {
      console.error("Error saving article:", err);
      setError(
        `Failed to ${isEditMode ? "update" : "create"} article. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Loading article...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <FileText className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
          {isEditMode ? "Edit Article" : "Create New Article"}
        </h2>

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-md flex items-start animate-fadeIn">
            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all duration-200"
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all duration-200"
              placeholder="Write your article content here..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              Co-Authors
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2 min-h-[40px]">
              {coAuthors.length > 0 ? (
                coAuthors.map((author) => (
                  <div
                    key={author.id}
                    className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-900"
                  >
                    <span className="text-sm">{author.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoAuthor(author.id)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                      aria-label={`Remove ${author.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No co-authors selected
                </span>
              )}
            </div>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-white transition-all duration-200 appearance-none"
                onChange={(e) => {
                  const selectedUserId = Number(e.target.value);
                  if (selectedUserId) {
                    const selectedUser = availableUsers.find(
                      (u) => u.id === selectedUserId
                    );
                    if (
                      selectedUser &&
                      !coAuthors.some((author) => author.id === selectedUserId)
                    ) {
                      handleAddCoAuthor(selectedUser);
                    }
                    e.target.value = ""; // Reset select after adding
                  }
                }}
                value=""
              >
                <option value="">Add a co-author...</option>
                {availableUsers
                  .filter(
                    (u) => !coAuthors.some((author) => author.id === u.id)
                  )
                  .map((user) => (
                    <option key={user.id} value={user.id} className="py-1">
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Plus
                  className={`h-5 w-5 ${isLoadingUsers ? "hidden" : "text-gray-400 dark:text-gray-500"}`}
                />
                {isLoadingUsers && (
                  <Loader2 className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="pdfLink"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center"
              >
                <LinkIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                PDF Link
              </label>
              <input
                type="url"
                id="pdfLink"
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all duration-200"
                placeholder="Enter PDF link (optional)"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="journalLink"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center"
              >
                <LinkIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                Journal Link
              </label>
              <input
                type="url"
                id="journalLink"
                value={journalLink}
                onChange={(e) => setJournalLink(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-all duration-200"
                placeholder="Enter journal link (optional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/${user?.role}/articles`)}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="inline-block h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Article"
              ) : (
                "Create Article"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;
