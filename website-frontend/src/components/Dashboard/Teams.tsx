import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Users, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './dashboard.css';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  leader: string;
  members: TeamMember[];
  created: string;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: ''
  });

  // Mock data for initial render
  useEffect(() => {
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'Machine Learning Research',
        description: 'Team focused on advanced machine learning algorithms and applications',
        leader: 'Dr. Sarah Johnson',
        created: '2023-06-15',
        members: [
          { id: '101', name: 'John Doe', email: 'john@example.com', role: 'Senior Researcher' },
          { id: '102', name: 'Emily Chen', email: 'emily@example.com', role: 'Data Scientist' }
        ]
      },
      {
        id: '2',
        name: 'Quantum Computing',
        description: 'Exploring quantum computing applications and algorithms',
        leader: 'Dr. Michael Ross',
        created: '2023-07-22',
        members: [
          { id: '201', name: 'Lisa Wang', email: 'lisa@example.com', role: 'Quantum Physicist' },
          { id: '202', name: 'Robert Smith', email: 'robert@example.com', role: 'Research Assistant' }
        ]
      }
    ];
    
    setTeams(mockTeams);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTeam) {
      // Update existing team
      setTeams(teams.map(team => 
        team.id === editingTeam.id ? 
        { 
          ...team, 
          name: formData.name, 
          description: formData.description, 
          leader: formData.leader 
        } : 
        team
      ));
    } else {
      // Add new team
      const newTeam: Team = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        leader: formData.leader,
        members: [],
        created: new Date().toISOString().split('T')[0]
      };
      
      setTeams([...teams, newTeam]);
    }
    
    resetForm();
  };

  const handleEditTeam = (team: Team) => {
    setFormData({
      name: team.name,
      description: team.description,
      leader: team.leader
    });
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
    if (expandedTeam === id) {
      setExpandedTeam(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', leader: '' });
    setEditingTeam(null);
    setShowForm(false);
  };

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teams Management</h1>
          <p className="text-gray-600 mt-1">Create and manage research teams</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Team</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search teams..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Form for adding/editing teams */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button 
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-semibold mb-4">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Team Leader
                </label>
                <input
                  type="text"
                  name="leader"
                  value={formData.leader}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Teams List */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-gray-600 text-lg font-medium">No teams found</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery ? 'Try a different search term or ' : ''}
            create a new team to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>Add Team</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTeams.map(team => (
            <div key={team.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" 
                onClick={() => toggleTeamExpansion(team.id)}
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-600">Team Leader: {team.leader}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 hidden sm:inline-block">
                    {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTeam(team);
                      }}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${team.name}"?`)) {
                          handleDeleteTeam(team.id);
                        }
                      }}
                      className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedTeam === team.id ? 
                      <ChevronUp size={20} className="text-gray-400" /> : 
                      <ChevronDown size={20} className="text-gray-400" />
                    }
                  </div>
                </div>
              </div>
              
              {expandedTeam === team.id && (
                <div className="border-t border-gray-200 p-4">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                    <p className="text-gray-600">{team.description}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700">Team Members</h4>
                      <span className="text-sm text-gray-500">Created: {team.created}</span>
                    </div>
                    
                    {team.members.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">No members assigned to this team</p>
                    ) : (
                      <div className="overflow-x-auto mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {team.members.map(member => (
                              <tr key={member.id}>
                                <td className="px-4 py-2 text-sm text-gray-800">{member.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{member.email}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{member.role}</td>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams; 