import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Calendar, 
  Users, 
  ChevronDown, 
  ChevronUp,
  BadgeCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  team: string;
  startDate: string;
  endDate?: string;
  members?: string[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as const,
    team: '',
    startDate: '',
    endDate: '',
    members: [] as string[]
  });

  const teams = ['AI Research', 'Quantum Computing', 'ML Operations', 'Blockchain', 'Cybersecurity'];

  const navigate = useNavigate();

  // Sample initial data
  useEffect(() => {
    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'AI Research Platform',
        description: 'Developing a platform for collaborative AI research with integrated tools for experiment tracking.',
        status: 'active',
        team: 'AI Research',
        startDate: '2023-01-15',
        endDate: '2023-12-31',
        members: ['John Doe', 'Sarah Johnson', 'Robert Chen']
      },
      {
        id: '2',
        name: 'Quantum Computing Study',
        description: 'Research on quantum algorithms and their applications in cryptography.',
        status: 'completed',
        team: 'Quantum Computing',
        startDate: '2022-06-10',
        endDate: '2023-06-10',
        members: ['Emily Parker', 'Michael Zhang']
      },
      {
        id: '3',
        name: 'ML Model Deployment Pipeline',
        description: 'Creating an automated pipeline for deploying machine learning models to production.',
        status: 'on-hold',
        team: 'ML Operations',
        startDate: '2023-03-01',
        members: ['Lisa Wang', 'James Smith', 'Ana Rodriguez']
      }
    ];
    
    setProjects(sampleProjects);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      // Update existing project
      setProjects(projects.map(project => 
        project.id === editingProject.id 
          ? { 
              ...project, 
              name: formData.name,
              description: formData.description,
              status: formData.status,
              team: formData.team,
              startDate: formData.startDate,
              endDate: formData.endDate || undefined,
              members: formData.members
            }
          : project
      ));
    } else {
      // Add new project
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        team: formData.team,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        members: formData.members
      };
      
      setProjects([...projects, newProject]);
    }
    
    resetForm();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      team: project.team,
      startDate: project.startDate,
      endDate: project.endDate || '',
      members: project.members || []
    });
    setShowForm(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    if (expandedProject === id) {
      setExpandedProject(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      team: '',
      startDate: '',
      endDate: '',
      members: []
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <Clock size={16} className="text-green-500" />;
      case 'completed':
        return <BadgeCheck size={16} className="text-blue-500" />;
      case 'on-hold':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and track research projects</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Form for adding/editing projects */}
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
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Project Name
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
              
              <div>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Team
                  </label>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-gray-600 text-lg font-medium">No projects found</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery ? 'Try a different search term or ' : ''}
            create a new project to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>Add Project</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status}</span>
                </span>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-1" />
                <span>{project.team}</span>
                <span className="mx-2">•</span>
                <Calendar size={16} className="mr-1" />
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                {project.endDate && (
                  <>
                    <span className="mx-2">-</span>
                    <span>{new Date(project.endDate).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects; 