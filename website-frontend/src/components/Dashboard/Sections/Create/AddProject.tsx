import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";
import {
  projectsService,
  ProjectState,
} from "../../../../services/projectsService";
import { teamsService, Team } from "../../../../services/teamsService";
import { useAuth } from "../../../../contexts/AuthContext";

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    state: "PLANNING" as ProjectState,
    teamId: "",
    expectedEndDate: "",
  });

  const [leadingTeams, setLeadingTeams] = useState<Team[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch teams led by the current user
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        if (currentUser?.id) {
          // Fetch all teams the user is involved with
          const myTeams = await teamsService.getMyTeams();
          // Get only the teams where the user is a leader
          setLeadingTeams(myTeams.led || []);

          // Set default teamId if there's at least one team
          if (myTeams.led && myTeams.led.length > 0) {
            setFormData((prev) => ({
              ...prev,
              teamId: myTeams.led[0].id.toString(),
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setErrors((prev) => ({
          ...prev,
          teams: "Failed to load teams. Please try again later.",
        }));
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [currentUser?.id]);

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

    // Clear error when field is edited
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.teamId) {
      newErrors.teamId = "Team selection is required";
    }

    if (formData.expectedEndDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(formData.expectedEndDate);

      if (endDate < today) {
        newErrors.expectedEndDate = "Expected end date cannot be before today";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Create the project
      await projectsService.create({
        name: formData.name,
        description: formData.description,
        state: formData.state,
        teamId: parseInt(formData.teamId),
        expectedEndDate: formData.expectedEndDate
          ? new Date(formData.expectedEndDate)
          : undefined,
      });

      setSuccessMessage("Project created successfully!");

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        state: "PLANNING",
        teamId: leadingTeams.length > 0 ? leadingTeams[0].id.toString() : "",
        expectedEndDate: "",
      });

      // Navigate back after a short delay to show the success message
      setTimeout(() => {
        navigate("/dashboard/TeamLeader/projects");
      }, 1500);
    } catch (error) {
      console.error("Error creating project:", error);
      setErrors({
        submit: "Failed to create project. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Project
        </h2>
        <button
          onClick={() => navigate("/dashboard/TeamLeader/projects")}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe the project's goals, scope, and expected outcomes"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="teamId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Team*
              </label>
              {loadingTeams ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading teams...
                  </span>
                </div>
              ) : (
                <>
                  <select
                    id="teamId"
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.teamId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a team</option>
                    {leadingTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.acro})
                      </option>
                    ))}
                  </select>
                  {leadingTeams.length === 0 && (
                    <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                      You don't lead any teams. You must be a team leader to
                      create projects.
                    </p>
                  )}
                </>
              )}
              {errors.teamId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.teamId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="expectedEndDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Expected End Date
              </label>
              <input
                type="date"
                id="expectedEndDate"
                name="expectedEndDate"
                value={formData.expectedEndDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.expectedEndDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.expectedEndDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.expectedEndDate}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The date when the project is expected to be completed.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/TeamLeader/projects")}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || leadingTeams.length === 0}
              className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading || leadingTeams.length === 0
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
