import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { FaUserPlus, FaTrash, FaEdit, FaEnvelope } from 'react-icons/fa';

const TeamManagement: React.FC = () => {
  const { currentUser, teams, members } = useApp();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the team members from the API
    // For now, let's simulate it with the data we have
    try {
      const team = teams.find(team => team.leader?.id === currentUser?.id);
      if (team) {
        setTeamMembers(team.members || []);
      } else {
        setTeamMembers([]);
      }
    } catch (err) {
      setError('Failed to load team members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teams, currentUser]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, you would call an API endpoint
      // For now, just update the local state
      const newMember = {
        id: `mem-${Date.now()}`,
        name: newMemberEmail.split('@')[0], // Just for demo, use email prefix as name
        email: newMemberEmail,
        role: 'member',
        type: 'member'
      };
      
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail('');
      setIsAddingMember(false);
    } catch (err) {
      setError('Failed to add team member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        // In a real application, you would call an API endpoint
        setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      } catch (err) {
        setError('Failed to remove team member');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading team members...</div>;
  }

  return (
    <div className="team-management-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setIsAddingMember(!isAddingMember)}
        >
          <FaUserPlus className="mr-2" /> {isAddingMember ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {error && (
        <div className="error-message mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isAddingMember ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Add New Team Member</h2>
          <form onSubmit={handleAddMember}>
            <div className="mb-4">
              <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member Email
              </label>
              <input
                type="email"
                id="memberEmail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member's email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsAddingMember(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Team Members</h2>
        
        {teamMembers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No team members found. Add members to your team.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <div 
                key={member.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.role || member.type}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove member"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                  <FaEnvelope className="mr-2" />
                  <span>{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement; 