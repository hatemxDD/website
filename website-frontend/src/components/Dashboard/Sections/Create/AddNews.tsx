import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaTag,
  FaSave,
  FaTimes,
  FaImage,
  FaNewspaper,
  FaFileAlt,
} from "react-icons/fa";
import { newsService } from "../../../../services/newsService";
import { useToast } from "../../../../contexts/ToastContext";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  // Adjust for local timezone
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const AddNews: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    publishDate: getCurrentDate(), // Use helper function to get current date
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    setIsLoading(true);

    try {
      // In a real implementation, you would upload the image to a storage service
      // and get back a URL to store in the database
      // For now, we'll simulate this with a placeholder URL
      let imageUrl = "https://placeholder.com/news-image.jpg";

      if (imageFile) {
        // This is where you would upload the image to your server or a cloud storage service
        // For example: const uploadResponse = await uploadImageToServer(imageFile);
        // imageUrl = uploadResponse.url;

        // For demonstration, we'll just use the file name
        imageUrl = `uploaded-image-${imageFile.name}`;
      }

      // Call the API to create the news
      await newsService.create({
        title: formData.title,
        image: imageUrl,
        content: formData.content,
        publishDate: formData.publishDate,
        category: formData.category,
      });

      showToast("News created successfully", "success");
      navigate("/dashboard/labLeader/news");
    } catch (error) {
      console.error("Error creating news:", error);
      showToast("Failed to create news. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
        <FaNewspaper className="mr-2 text-blue-600" />
        Add News
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
      >
        <div className="grid grid-cols-1 gap-8">
          <div className="group">
            <label
              htmlFor="title"
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-blue-600 transition-colors duration-200"
            >
              <FaFileAlt className="mr-2 text-blue-500" />
              News Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
              placeholder="Enter a compelling title..."
              required
            />
          </div>

          <div className="group">
            <label
              htmlFor="content"
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-blue-600 transition-colors duration-200"
            >
              <FaFileAlt className="mr-2 text-blue-500" />
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
              placeholder="Write your news content here..."
              required
            />
          </div>

          <div className="group">
            <label
              htmlFor="image"
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-blue-600 transition-colors duration-200"
            >
              <FaImage className="mr-2 text-blue-500" />
              Featured Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600 hover:border-blue-500 transition-colors duration-200">
              <div className="space-y-1 text-center">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mx-auto h-48 w-auto object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop an image, or{" "}
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer text-blue-600 hover:text-blue-700 focus-within:outline-none"
                      >
                        <span>click to browse</span>
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={formData.image ? "hidden" : "sr-only"}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label
                htmlFor="category"
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-blue-600 transition-colors duration-200"
              >
                <FaTag className="mr-2 text-blue-500" />
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 shadow-sm appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                  required
                >
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="achievement">Achievement</option>
                  <option value="publication">Publication</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="publishDate"
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 group-focus-within:text-blue-600 transition-colors duration-200"
              >
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Publish Date
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/dashboard/LabLeader/news")}
            className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
          >
            <FaSave className="mr-2" />
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              "Save News"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNews;
