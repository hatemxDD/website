import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaTag, FaSave, FaTimes } from "react-icons/fa";
import { newsService, News } from "../../../../services/newsService";
import { useToast } from "../../../../contexts/ToastContext";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  // Adjust for local timezone
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const EditNews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<News>>({
    title: "",
    content: "",
    image: "",
    category: "",
    status: "draft",
    publishDate: getCurrentDate(), // Use helper function to get current date
  });
  const [tagInput, setTagInput] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const newsId = parseInt(id, 10);
        if (isNaN(newsId)) {
          throw new Error("Invalid news ID");
        }

        const newsData = await newsService.getById(newsId);

        if (newsData) {
          // Format date to YYYY-MM-DD for the date input
          const formattedData = {
            id: newsData.id,
            title: newsData.title,
            content: newsData.content || "",
            image: newsData.image || "",
            authorId: newsData.authorId,
            category: newsData.category || "",
            status: newsData.status || "draft",
            publishDate:
              newsData.publishDate ||
              new Date(newsData.createdAt).toISOString().split("T")[0],
          };
          setFormData(formattedData);
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setError("Failed to load news item. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
      // Preview the image
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Ensure publishDate is provided
    if (!formData.publishDate) {
      setError("Publish date is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const newsId = parseInt(id, 10);
      if (isNaN(newsId)) {
        throw new Error("Invalid news ID");
      }

      // In a real implementation, you would upload the image if changed
      let imageUrl = formData.image;

      if (imageFile) {
        // This is where you would upload the image to your server or a cloud storage service
        // For example: const uploadResponse = await uploadImageToServer(imageFile);
        // imageUrl = uploadResponse.url;

        // For demonstration, we'll just use the file name
        imageUrl = `uploaded-image-${imageFile.name}`;
      }

      // Transform data to match backend expectations
      const updateData = {
        title: formData.title,
        content: formData.content,
        image: imageUrl,
        category: formData.category,
        status: formData.status,
        publishDate: formData.publishDate,
      };

      await newsService.update(newsId, updateData);
      showToast("News updated successfully", "success");
      navigate("/dashboard/LabLeader/news");
    } catch (err) {
      console.error("Error updating news item:", err);
      setError("Failed to update news item. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Ensure publishDate always has a value
  const currentPublishDate = formData.publishDate || getCurrentDate();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Edit News
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content || ""}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Image
            </label>
            <div className="flex items-center mt-1">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Category
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="achievement">Achievement</option>
                  <option value="publication">Publication</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="publishDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Publish Date <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="publishDate"
                  name="publishDate"
                  value={currentPublishDate}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue={getCurrentDate()}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || "draft"}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/LabLeader/news")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <FaTimes className="inline-block mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="inline-block mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNews;
