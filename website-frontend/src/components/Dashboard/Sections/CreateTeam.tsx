import React, { useState, useEffect } from 'react';
import { Building, Users, ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface CreateTeamProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const CreateTeam: React.FC<CreateTeamProps> = ({ onCancel, onSuccess }) => {
  const { currentUser, createTeam } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamLeader: '',
  });
  
  const [availableMembers, setAvailableMembers] = useState<Array<{id: string, name: string}>>([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alex Johnson' },
    { id: '4', name: 'Maria Garcia' },
    { id: '5', name: 'Robert Chen' },
  ]);
  
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      const newErrors = {...errors};
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.teamLeader) {
      newErrors.teamLeader = 'Team leader is required';
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
    setSuccessMessage('');

    try {
      // Convert selected member IDs to actual member objects (in a real app)
      const members = selectedMembers.map(id => {
        const member = availableMembers.find(m => m.id === id);
        return {
          id,
          name: member?.name || ''
        };
      });

      await createTeam({
        name: formData.name,
        description: formData.description,
        leader: formData.teamLeader,
        members: members,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.id || '',
      });

      setSuccessMessage('Team created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        teamLeader: '',
      });
      setSelectedMembers([]);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setErrors({
        submit: 'Failed to create team. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
          <Building className="mr-2" size={24} />
          Create New Team
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter team name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the team's purpose, goals, and research focus"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="teamLeader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Leader*
            </label>
            <select
              id="teamLeader"
              name="teamLeader"
              value={formData.teamLeader}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.teamLeader ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a team leader</option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.teamLeader && (
              <p className="mt-1 text-sm text-red-600">{errors.teamLeader}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Members
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 max-h-60 overflow-y-auto">
              {availableMembers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No members available</p>
              ) : (
                <div className="space-y-2">
                  {availableMembers.map(member => (
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
                        {member.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Selected: {selectedMembers.length} members
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Creating Team...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Create Team
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam; 