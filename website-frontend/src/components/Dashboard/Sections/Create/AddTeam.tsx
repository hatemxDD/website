import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { teamsService } from "../../../../services/teamsService";
import { usersService } from "../../../../services/usersService";
import { User } from "../../../../services/usersService";

const AddTeam: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    acro: "",
    leaderId: "",
  });

  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch available members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const members = await usersService.getAll();
        setAvailableMembers(members);
      } catch (error) {
        console.error("Error fetching members:", error);
        setErrors((prev) => ({
          ...prev,
          members: "Failed to load members. Please try again later.",
        }));
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

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

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.acro.trim()) {
      newErrors.acro = "Team acronym is required";
    }

    // if (!formData.leaderId) {
    //   newErrors.leaderId = "Team leader is required";
    // }

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
      // First create the team
      const createdTeam = await teamsService.create({
        name: formData.name,
        description: formData.description,
        acro: formData.acro,
        leaderId: parseInt(formData.leaderId),
      });

      // Then set the team leader (if not already set during creation)
      if (
        formData.leaderId &&
        createdTeam.leaderId !== parseInt(formData.leaderId)
      ) {
        await teamsService.update(createdTeam.id, {
          leaderId: parseInt(formData.leaderId),
        });
      }

      // Then add all the selected members to the team
      await Promise.all(
        selectedMembers.map((userId) =>
          teamsService.addMember(createdTeam.id, { userId })
        )
      );

      setSuccessMessage("Team created successfully!");

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        acro: "",
        leaderId: "",
      });
      setSelectedMembers([]);

      // Navigate back after a short delay to show the success message
      setTimeout(() => {
        navigate("/dashboard/LabLeader/teams");
      }, 1500);
    } catch (error) {
      console.error("Error creating team:", error);
      setErrors({
        submit: "Failed to create team. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Team
        </h2>
        <button
          onClick={() => navigate("/dashboard/LabLeader/teams")}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
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
                Team Name*
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
                placeholder="Enter team name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="acro"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Team Acronym*
              </label>
              <input
                type="text"
                id="acro"
                name="acro"
                value={formData.acro}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.acro ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter team acronym (e.g., ML, DS, AI)"
              />
              {errors.acro && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.acro}
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
                placeholder="Describe the team's purpose, goals, and research focus"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="leaderId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Team Leader*
              </label>
              {loadingMembers ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading members...
                  </span>
                </div>
              ) : (
                <>
                  <select
                    id="leaderId"
                    name="leaderId"
                    value={formData.leaderId}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.leaderId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a team leader</option>
                    {availableMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                  {errors.leaderId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.leaderId}
                    </p>
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Members
              </label>
              {loadingMembers ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading members...
                  </span>
                </div>
              ) : (
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 max-h-60 overflow-y-auto">
                  {availableMembers.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No members available
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {availableMembers.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`member-${member.id}`}
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => handleMemberToggle(member.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`member-${member.id}`}
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            {member.name} ({member.email})
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/LabLeader/teams")}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
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
                  Create Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;
