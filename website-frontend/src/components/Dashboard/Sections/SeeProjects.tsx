import React, { useState, useEffect } from 'react';
import { Search, Filter, Folder, User, Calendar, Clock, Tag, ChevronDown, ChevronUp, ChevronRight, Users } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { FaSearch, FaFilter, FaFileAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

interface ProjectMember {
  id: string;
  name: string;
  role: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  team: string;
  leader: string;
  members: ProjectMember[];
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  tags: string[];
}

interface SeeProjectsProps {
  title?: string;
}

const SeeProjects: React.FC<SeeProjectsProps> = ({ title = "Research Projects" }) => {
  const { currentUser, projects } = useApp();
  const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // State for projects data
  const [projectsData, setProjectsData] = useState<Project[]>([
    {
      id: '1',
      title: 'AI-Based Disease Detection',
      description: 'Developing machine learning algorithms to detect diseases from medical images',
      team: 'AI Research',
      leader: 'Jane Smith',
      members: [
        { id: '1', name: 'Jane Smith', role: 'Team Leader' },
        { id: '2', name: 'Maria Garcia', role: 'Member' },
        { id: '3', name: 'David Wilson', role: 'Member' }
      ],
      startDate: '2023-01-15',
      endDate: '2023-12-15',
      status: 'in-progress',
      tags: ['AI', 'Healthcare', 'Machine Learning']
    },
    {
      id: '2',
      title: 'Big Data Analytics for Climate Research',
      description: 'Analyzing large climate datasets to identify patterns related to climate change',
      team: 'Data Science',
      leader: 'Robert Chen',
      members: [
        { id: '4', name: 'Robert Chen', role: 'Team Leader' },
        { id: '5', name: 'Alex Johnson', role: 'Member' },
        { id: '6', name: 'Emily Zhang', role: 'Member' }
      ],
      startDate: '2023-02-01',
      endDate: '2024-01-31',
      status: 'in-progress',
      tags: ['Big Data', 'Climate', 'Data Analysis']
    },
    {
      id: '3',
      title: 'Autonomous Drone Navigation System',
      description: 'Developing a navigation system for drones to operate in urban environments',
      team: 'Robotics',
      leader: 'Miguel Rodriguez',
      members: [
        { id: '7', name: 'Miguel Rodriguez', role: 'Team Leader' },
        { id: '8', name: 'Sarah Park', role: 'Member' },
        { id: '9', name: 'James Brown', role: 'Member' }
      ],
      startDate: '2022-11-10',
      endDate: '2023-10-30',
      status: 'on-hold',
      tags: ['Robotics', 'Drones', 'Navigation']
    },
    {
      id: '4',
      title: 'Quantum Algorithm Optimization',
      description: 'Optimizing quantum algorithms for practical applications in cryptography',
      team: 'Quantum Computing',
      leader: 'Elizabeth Taylor',
      members: [
        { id: '10', name: 'Elizabeth Taylor', role: 'Team Leader' },
        { id: '11', name: 'Thomas Lee', role: 'Member' }
      ],
      startDate: '2023-03-01',
      endDate: '2024-02-28',
      status: 'planning',
      tags: ['Quantum', 'Algorithms', 'Cryptography']
    },
    {
      id: '5',
      title: 'Sustainable Energy Storage Solutions',
      description: 'Researching new materials for efficient and sustainable energy storage',
      team: 'Data Science',
      leader: 'Robert Chen',
      members: [
        { id: '4', name: 'Robert Chen', role: 'Team Leader' },
        { id: '12', name: 'Lisa Wong', role: 'Member' }
      ],
      startDate: '2022-09-15',
      endDate: '2023-08-31',
      status: 'completed',
      tags: ['Energy', 'Sustainability', 'Materials Science']
    }
  ]);
  
  // States for filtering and searching
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{key: keyof Project, direction: 'ascending' | 'descending'} | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  // Extract unique values for filter dropdowns
  const teamsList = Array.from(new Set(projectsData.map(project => project.team)));
  const statuses = ['planning', 'in-progress', 'completed', 'on-hold'];
  const allTags = Array.from(new Set(projectsData.flatMap(project => project.tags)));

  // Effect to initialize data from context (if available)
  useEffect(() => {
    if (projects && projects.length > 0) {
      setProjectsData(projects);
    }
  }, [projects]);

  useEffect(() => {
    // In a real application, this would come from an API call
    try {
      // Simulate fetching projects assigned to the member
      const memberProjects = projects.filter(project => 
        project.members?.some((member: any) => member.id === currentUser?.id)
      );
      setAssignedProjects(memberProjects);
      setFilteredProjects(memberProjects);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, projects]);

  // Filter projects based on search term and status filter
  useEffect(() => {
    let filtered = assignedProjects;
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        project => 
          project.name?.toLowerCase().includes(lowerSearchTerm) || 
          project.description?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [assignedProjects, searchTerm, statusFilter]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    switch (filter) {
      case 'team':
        setFilterTeam(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      case 'tag':
        setFilterTag(value);
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterTeam('');
    setFilterStatus('');
    setFilterTag('');
    setSearchTerm('');
  };

  // Handle sorting
  const requestSort = (key: keyof Project) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Toggle project expansion
  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on-hold':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Apply filters and sorting to get filtered projects
  const getFilteredProjects = () => {
    let filtered = [...projectsData];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        project => 
          project.title.toLowerCase().includes(term) || 
          project.description.toLowerCase().includes(term) ||
          project.team.toLowerCase().includes(term) ||
          project.leader.toLowerCase().includes(term) ||
          project.members.some(member => member.name.toLowerCase().includes(term)) ||
          project.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply team filter
    if (filterTeam) {
      filtered = filtered.filter(project => project.team === filterTeam);
    }
    
    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(project => project.status === filterStatus);
    }
    
    // Apply tag filter
    if (filterTag) {
      filtered = filtered.filter(project => project.tags.includes(filterTag));
    }
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  };

  const viewProjectDetails = (project: any) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-view-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
        <div className="search-filter-container flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Project List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'No projects match your search criteria.' 
              : 'You are not assigned to any projects yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => viewProjectDetails(project)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 truncate">
                  {project.name}
                </h2>
                <div className="mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt className="mr-1" />
                  <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                {project.endDate && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <FaCalendarAlt className="mr-1" />
                    <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {/* Progress bar */}
              <div className="px-6 pb-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.name}</h2>
                <button 
                  onClick={closeProjectDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedProject.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedProject.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                  selectedProject.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedProject.status}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedProject.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="text-gray-800 dark:text-white">
                      {new Date(selectedProject.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {selectedProject.endDate && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className="text-gray-800 dark:text-white">
                        {new Date(selectedProject.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <FaUsers className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Team</p>
                    <p className="text-gray-800 dark:text-white">
                      {selectedProject.team || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FaFileAlt className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
                    <p className="text-gray-800 dark:text-white">
                      {selectedProject.tasks?.length || 0} tasks
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">Progress</h3>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>Overall Completion</span>
                  <span>{selectedProject.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full" 
                    style={{ width: `${selectedProject.progress || 0}%` }}
                  />
                </div>
              </div>
              
              {/* Team Members */}
              {selectedProject.members && selectedProject.members.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">Team Members</h3>
                  <div className="space-y-2">
                    {selectedProject.members.map((member: any) => (
                      <div key={member.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role || member.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeProjects; 