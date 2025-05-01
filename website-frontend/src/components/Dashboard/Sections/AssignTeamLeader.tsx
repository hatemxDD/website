import React, { useState, useEffect } from 'react';
import { Award, Search, Check, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Team as ContextTeam } from '../../../types';
import '../../../styles/tailwind-output.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  leader: string;
  description: string;
  members: TeamMember[];
  creationDate: string;
}

const AssignTeamLeader: React.FC = () => {
  const { teams } = useApp();
  
  // State for teams data
  const [teamsData, setTeamsData] = useState<Team[]>([
    {
      id: '1',
      name: 'AI Research',
      leader: 'Jane Smith',
      description: 'Focusing on artificial intelligence and machine learning research',
      members: [
        { id: '2', name: 'Jane Smith', role: 'Team Leader' },
        { id: '4', name: 'Maria Garcia', role: 'Member' },
        { id: '6', name: 'David Wilson', role: 'Member' }
      ],
      creationDate: '2022-01-10',
      status: 'active'
    },
    {
      id: '2',
      name: 'Data Science',
      leader: 'Robert Chen',
      description: 'Working on data analysis and visualization for research projects',
      members: [
        { id: '5', name: 'Robert Chen', role: 'Team Leader' },
        { id: '3', name: 'Alex Johnson', role: 'Member' },
        { id: '7', name: 'Emily Zhang', role: 'Member' }
      ],
      creationDate: '2022-02-15'
    },
    {
      id: '3',
      name: 'Robotics',
      leader: 'Miguel Rodriguez',
      description: 'Developing autonomous robotic systems and sensors',
      members: [
        { id: '8', name: 'Miguel Rodriguez', role: 'Team Leader' },
        { id: '9', name: 'Sarah Park', role: 'Member' },
        { id: '10', name: 'James Brown', role: 'Member' }
      ],
      creationDate: '2022-03-20'
    },
    {
      id: '4',
      name: 'Quantum Computing',
      leader: 'Elizabeth Taylor',
      description: 'Researching quantum algorithms and applications',
      members: [
        { id: '11', name: 'Elizabeth Taylor', role: 'Team Leader' },
        { id: '12', name: 'Thomas Lee', role: 'Member' }
      ],
      creationDate: '2022-06-05'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter teams by search term
  const filteredTeams = teamsData.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Select a team to assign a leader to
  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setSelectedMember(null); // Reset selected member when team changes
  };
  
  // Get available members for leadership role (excluding current leader)
  const getAvailableMembers = () => {
    if (!selectedTeam) return [];
    return selectedTeam.members.filter(member => 
      member.role !== 'Team Leader'
    );
  };
  
  // Handle leader assignment
  const assignLeader = () => {
    if (!selectedTeam || !selectedMember) {
      setNotification({
        type: 'error',
        message: 'Please select both a team and a member'
      });
      return;
    }
    
    // Update teams data
    const updatedTeams = teamsData.map(team => {
      if (team.id === selectedTeam.id) {
        // Find current leader and change their role
        const updatedMembers = team.members.map(member => {
          if (member.role === 'Team Leader') {
            return { ...member, role: 'Member' };
          }
          if (member.id === selectedMember.id) {
            return { ...member, role: 'Team Leader' };
          }
          return member;
        });
        
        return {
          ...team,
          leader: selectedMember.name,
          members: updatedMembers
        };
      }
      return team;
    });
    
    setTeamsData(updatedTeams);
    setNotification({
      type: 'success',
      message: `${selectedMember.name} has been assigned as the leader of ${selectedTeam.name}`
    });
    
    // Reset selection
    setSelectedTeam(null);
    setSelectedMember(null);
    
    // Clear notification after a few seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
        <Award className="mr-2" size={24} />
        Assign Team Leader
      </h2>
      
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-3 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <Check className="h-5 w-5 mr-2" /> : 
              <AlertTriangle className="h-5 w-5 mr-2" />
            }
            <p>{notification.message}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Selection */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Select Team</h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search teams..."
            />
          </div>
          
          {/* Teams List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredTeams.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredTeams.map(team => (
                  <li 
                    key={team.id}
                    className={`py-3 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded ${selectedTeam?.id === team.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    onClick={() => handleSelectTeam(team)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{team.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current leader: {team.leader}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${team.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {team.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No teams found matching your search
              </div>
            )}
          </div>
        </div>
        
        {/* Member Selection */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            {selectedTeam ? `Assign leader for ${selectedTeam.name}` : 'Select a team first'}
          </h3>
          
          {selectedTeam ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Current leader: <span className="font-medium">{selectedTeam.leader}</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Select a team member to assign as the new leader:</p>
              </div>
              
              {/* Members List */}
              <div className="max-h-80 overflow-y-auto mb-4">
                {getAvailableMembers().length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {getAvailableMembers().map(member => (
                      <li 
                        key={member.id}
                        className={`py-3 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded ${selectedMember?.id === member.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                        onClick={() => setSelectedMember(member)}
                      >
                        <p className="font-medium text-gray-800 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No available members to assign as leader
                  </div>
                )}
              </div>
              
              {/* Assign Button */}
              <button
                onClick={assignLeader}
                disabled={!selectedMember}
                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none 
                  ${selectedMember 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                <Award className="mr-2 h-4 w-4" />
                Assign as Team Leader
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <Award className="h-10 w-10 mb-2" />
              <p>Please select a team first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTeamLeader; 