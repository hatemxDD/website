import React, { useState, useEffect, useRef } from "react";
import { usersService, User } from "../../../services/usersService";
import { useAuth, ExtendedUser } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaIdBadge,
  FaCamera,
  FaBuilding,
  FaGraduationCap,
  FaMedal,
  FaBook,
  FaLink,
  FaUpload,
} from "react-icons/fa";

// Combined user type to handle both API user and auth user
type CombinedUser = User & Partial<ExtendedUser>;

// Define a maximum image size (3MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState<CombinedUser | null>(
    authUser as CombinedUser | null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<CombinedUser>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "teams" | "research">(
    "overview"
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // If we already have the user from auth context, use it
        if (authUser) {
          setUser(authUser as CombinedUser);
          setEditedData(authUser as CombinedUser);
          setLoading(false);
          return;
        }

        // Otherwise, fetch from API
        const userData = await usersService.getProfile();
        setUser(userData as CombinedUser);
        setEditedData(userData as CombinedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data. Please try again later.");
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  const handleEdit = () => {
    setIsEditing(true);
    // Reset image preview when starting edit
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let updatedData = { ...editedData };

      // If we have a new image file, handle the upload
      if (imageFile) {
        try {
          // First try to use the dedicated upload endpoint
          const formData = new FormData();
          formData.append("image", imageFile);

          const token = localStorage.getItem("token");

          const uploadResponse = await fetch("/api/users/upload-image", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (uploadResponse.ok) {
            const data = await uploadResponse.json();
            // If the upload was successful, use the returned URL
            updatedData.image = data.imageUrl;
          } else {
            // Fallback to base64 if the server doesn't support direct uploads
            console.log("Direct upload failed, using base64 encoding");
            const reader = new FileReader();
            const imageDataPromise = new Promise<string>((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(imageFile);
            });

            updatedData.image = await imageDataPromise;
          }
        } catch (uploadError) {
          console.error("Error during image upload:", uploadError);
          toast.warning(
            "Could not upload image directly, trying alternative method"
          );

          // Last resort fallback - encode the image as base64
          const reader = new FileReader();
          const imageDataPromise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(imageFile);
          });

          updatedData.image = await imageDataPromise;
        }
      }

      // Update user profile with all the data including the image
      await usersService.updateProfile(updatedData);

      // Refresh user data
      const updatedUser = await usersService.getProfile();
      setUser(updatedUser as CombinedUser);
      setIsEditing(false);
      setImagePreview(null);
      setImageFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setEditedData(user || {});
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `Image is too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
        );
        return;
      }

      // Store the file for upload later
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl shadow-md"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-lg font-semibold">Error Loading Profile</span>
        </div>
        <p className="mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header with gradient */}
      <div className={`rounded-2xl shadow-lg overflow-hidden`}>
        <div
          className={`${
            isDarkMode
              ? "bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800"
              : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500"
          } p-8 relative`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            <div
              className="relative group cursor-pointer"
              onClick={handleImageClick}
            >
              {imagePreview ? (
                // Show image preview if available
                <img
                  src={imagePreview}
                  alt={user?.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-black/10"
                />
              ) : user?.image ? (
                // Show user image if available
                <img
                  src={user.image}
                  alt={user?.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-black/10"
                />
              ) : (
                // Show initial if no image
                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-blue-500 text-3xl font-bold border-4 border-white shadow-xl ring-4 ring-black/10">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <div className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-xl cursor-pointer hover:bg-blue-700 transition-colors">
                  <FaCamera size={16} />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                  <div className="text-white opacity-0 group-hover:opacity-100 flex flex-col items-center">
                    <FaUpload size={24} />
                    <span className="text-xs mt-1">Upload</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mt-2">
                <div className="flex items-center space-x-2 text-blue-100 opacity-90">
                  <FaEnvelope />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100 opacity-90">
                  <FaIdBadge />
                  <span>{user?.position || user?.role}</span>
                </div>
              </div>
            </div>

            <div className="md:ml-auto">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors shadow-lg"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
                  >
                    <FaSave className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors shadow-lg"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="flex mt-8 border-b border-white/20">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-white border-b-2 border-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "teams"
                  ? "text-white border-b-2 border-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab("research")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "research"
                  ? "text-white border-b-2 border-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Research
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} p-8`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user?.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user?.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FaIdBadge className="mr-2 text-blue-500" />
                      Role
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user?.position || user?.role}
                    </p>
                  </div>

                  {(user?.department || isEditing) && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <FaBuilding className="mr-2 text-blue-500" />
                        Department
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.department || ""}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {user?.department || "Research"}
                        </p>
                      )}
                    </div>
                  )}

                  {(user?.bio || isEditing) && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <FaBook className="mr-2 text-blue-500" />
                        Biography
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedData.bio || ""}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {user?.bio}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  Research & Teams
                </h3>

                <div className="space-y-4">
                  {user?.team && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <FaUsers className="mr-2 text-blue-500" />
                        Team
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user.team}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      Joined on
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user?.joinDate
                        ? new Date(user.joinDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long", day: "numeric" }
                            )
                          : "Unknown"}
                    </p>
                  </div>

                  {user?.researchInterests &&
                    user.researchInterests.length > 0 && (
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <FaGraduationCap className="mr-2 text-blue-500" />
                          Research Interests
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {user.researchInterests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium dark:bg-blue-900 dark:text-blue-200"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {user?.education && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <FaMedal className="mr-2 text-blue-500" />
                        Education
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user.education}
                      </p>
                    </div>
                  )}

                  {/* A placeholder for additional user content */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Connect
                      </h4>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                        Add Links
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <FaLink />
                      </button>
                      <span className="text-gray-500 dark:text-gray-400">
                        No links added yet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} p-8`}>
            <div className="text-center py-8">
              <FaUsers className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">
                No Teams Available
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You are not currently assigned to any teams.
              </p>
              <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse Teams
              </button>
            </div>
          </div>
        )}

        {activeTab === "research" && (
          <div className={`${isDarkMode ? "bg-gray-900" : "bg-white"} p-8`}>
            <div className="text-center py-8">
              <FaBook className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" />
              <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">
                No Research Publications
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You don't have any research publications yet.
              </p>
              <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Publication
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
