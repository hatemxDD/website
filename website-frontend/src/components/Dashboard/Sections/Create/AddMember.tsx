import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaGraduationCap,
  FaSave,
  FaTimes,
  FaUserTag,
  FaArrowLeft,
} from "react-icons/fa";
import {
  usersService,
  CreateUserData,
} from "./../../../../services/usersService";
import { Role } from "../../../../types/type";

interface MemberFormData {
  email: string;
  password: string;
  name: string;
  role: Role;
  department?: string;
  position?: string;
  photo?: string;
}

const AddMember: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MemberFormData>({
    email: "",
    password: "",
    name: "",
    role: Role.TeamMember,
    department: "",
    position: "",
    photo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (!formData.name) {
      setError("Name is required");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API - align with backend expectations
      const userData: CreateUserData = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        role: formData.role,
        // Additional fields mapped to backend expectations
        team: formData.department?.trim() || "",
        joinDate: new Date().toISOString().split("T")[0],
        photo: formData.photo?.trim() || "",
      };

      console.log("Sending user data to API:", userData);

      // Call API to create user
      const response = await usersService.create(userData);
      console.log("User created successfully:", response);

      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        email: "",
        password: "",
        name: "",
        role: Role.TeamMember,
        department: "",
        position: "",
        photo: "",
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard/LabLeader/members");
      }, 500);
    } catch (err: any) {
      console.error("Error creating user:", err);
      // Provide more specific error message if available
      if (err.message && err.message.includes("User already exists")) {
        setError("A user with this email already exists.");
      } else {
        setError(err.message || "Failed to add member. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Add New Member
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Create an account for a new team member
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/LabLeader/members")}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <FaArrowLeft className="mr-2" />
          Back to Members
        </button>
      </div>

      {/* Notification Alerts */}
      {error && (
        <div className="p-4 mb-6 flex items-center text-sm text-red-700 bg-red-100 rounded-lg border-l-4 border-red-500 dark:bg-red-900/50 dark:text-red-200">
          <div className="mr-3 flex-shrink-0 rounded-full p-1 bg-red-200 dark:bg-red-800">
            <FaTimes className="h-5 w-5 text-red-600 dark:text-red-300" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 flex items-center text-sm text-green-700 bg-green-100 rounded-lg border-l-4 border-green-500 dark:bg-green-900/50 dark:text-green-200">
          <div className="mr-3 flex-shrink-0 rounded-full p-1 bg-green-200 dark:bg-green-800">
            <FaSave className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
          <span className="font-medium">Member added successfully!</span>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8 border border-gray-200 dark:border-gray-700"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Required Fields Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b border-gray-200 dark:border-gray-700 mb-4">
              Basic Information
            </h3>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="member@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserTag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm appearance-none"
                required
              >
                <option value={Role.TeamMember}>Team Member</option>
                <option value={Role.TeamLeader}>Team Leader</option>
                <option value={Role.LabLeader}>Lab Leader</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="md:col-span-2 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b border-gray-200 dark:border-gray-700 mb-4">
              Additional Information{" "}
              <span className="text-sm font-normal text-gray-500">
                (Optional)
              </span>
            </h3>
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Department/Team
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="Research Department"
              />
            </div>
          </div>

          {/* Position Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Position
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
                placeholder="Researcher"
              />
            </div>
          </div>

          {/* Photo URL Field */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Photo URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 sm:text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              URL for profile avatar (JPG, PNG or GIF)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard/LabLeader/members")}
            className="mr-4 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
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
                Processing...
              </>
            ) : (
              <>
                <FaSave className="inline-block mr-2" />
                Add Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;
