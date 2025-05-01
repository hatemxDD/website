import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface LabMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
  teamId?: string; // If null/undefined, means the member is not assigned to any team
}

interface TeamManagementProps {
  mode?: 'view' | 'add';
}

const TeamManagement: React.FC<TeamManagementProps> = ({ mode = 'view' }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'Researcher',
      email: 'john.doe@example.com',
      joinDate: '2023-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Developer',
      email: 'jane.smith@example.com',
      joinDate: '2023-03-20',
      status: 'active',
    },
  ]);

  // Sample unassigned lab members data
  const [unassignedMembers, setUnassignedMembers] = useState<LabMember[]>([
    {
      id: '3',
      name: 'David Johnson',
      role: 'PhD Student',
      email: 'david.johnson@example.com',
      joinDate: '2023-05-10',
    },
    {
      id: '4',
      name: 'Sarah Williams',
      role: 'Research Assistant',
      email: 'sarah.williams@example.com',
      joinDate: '2023-06-22',
    },
    {
      id: '5',
      name: 'Michael Brown',
      role: 'Lab Technician',
      email: 'michael.brown@example.com',
      joinDate: '2023-04-15',
    },
    {
      id: '6',
      name: 'Emily Davis',
      role: 'PhD Student',
      email: 'emily.davis@example.com',
      joinDate: '2023-07-03',
    }
  ]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleAddMembersToTeam = () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member to add to your team');
      return;
    }

    // Get the members to add
    const membersToAdd = unassignedMembers
      .filter(member => selectedMembers.includes(member.id))
      .map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        email: member.email,
        joinDate: member.joinDate,
        status: 'active' as const
      }));

    // Add to team members
    setTeamMembers([...teamMembers, ...membersToAdd]);

    // Remove from unassigned members
    setUnassignedMembers(unassignedMembers.filter(
      member => !selectedMembers.includes(member.id)
    ));

    // Clear selection
    setSelectedMembers([]);

    alert(`Successfully added ${membersToAdd.length} member(s) to your team`);
  };

  const toggleSelectMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      // Get the member to remove
      const memberToRemove = teamMembers.find(member => member.id === memberId);
      
      if (memberToRemove) {
        // Add back to unassigned members
        setUnassignedMembers([...unassignedMembers, {
          id: memberToRemove.id,
          name: memberToRemove.name,
          role: memberToRemove.role,
          email: memberToRemove.email,
          joinDate: memberToRemove.joinDate,
        }]);
        
        // Remove from team members
        setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'add' ? 'Add Team Member' : 'Team Management'}
      </h1>
      
      {mode === 'add' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Available Lab Members</h2>
            <p className="text-gray-600 mb-4">
              Select members to add to your team. These are lab members who are not currently assigned to any team.
            </p>
            
            {unassignedMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">There are no available unassigned members at this time.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unassignedMembers.map((member) => (
                        <tr key={member.id} className={`${selectedMembers.includes(member.id) ? 'bg-blue-50' : ''} transition-colors duration-300`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => toggleSelectMember(member.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-700 font-medium">{member.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.joinDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAddMembersToTeam}
                    disabled={selectedMembers.length === 0}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      selectedMembers.length === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    } transition-colors duration-300`}
                  >
                    <FaPlus className="mr-2" />
                    Add {selectedMembers.length > 0 ? `${selectedMembers.length} ` : ''}Selected Members
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Current Team Members</h2>
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Your team currently has no members. Add some members from the list above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-700 font-medium">{member.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Team Members</h2>
              <button 
                onClick={() => window.location.href = '/dashboard/team-leader/team/add'}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                <FaUserPlus className="mr-2" />
                Add Member
              </button>
            </div>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Your team currently has no members. Click "Add Member" to add some.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projects
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-700 font-medium">{member.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-300">Edit</button>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement; 