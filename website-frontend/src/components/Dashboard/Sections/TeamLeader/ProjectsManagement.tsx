import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUsers, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { Project, Member } from '../../../../types';

interface ProjectWithMembers extends Project {
  teamMembers: Member[];
}

interface ProjectsManagementProps {
  mode?: 'view' | 'add';
}

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ mode = 'view' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectWithMembers | null>(null);
  const [newProject, setNewProject] = useState<Partial<ProjectWithMembers>>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'active',
    photo: '',
    result: '',
    teamMembers: []
  });

  const [availableMembers] = useState<Member[]>([
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john.doe@example.com',
      dateOfBirth: new Date(),
      sex: 'male',
      grade: 'PhD',
      degree: 'Computer Science',
      specialty: 'AI',
      photo: '',
      password: '',
      username: 'johndoe',
      type: 'member'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com',
      dateOfBirth: new Date(),
      sex: 'female',
      grade: 'PhD',
      degree: 'Physics',
      specialty: 'Quantum Computing',
      photo: '',
      password: '',
      username: 'janesmith',
      type: 'member'
    }
  ]);

  const [projects, setProjects] = useState<ProjectWithMembers[]>([
    {
      id: '1',
      title: 'AI Research Project',
      description: 'Advanced AI research project focusing on machine learning',
      startDate: new Date(),
      endDate: new Date(),
      status: 'active',
      photo: '',
      result: 'In progress',
      teamMembers: [availableMembers[0], availableMembers[1]],
      members: [availableMembers[0], availableMembers[1]]
    }
  ]);

  const handleEditProject = (project: ProjectWithMembers) => {
    setCurrentProject(project);
    setNewProject({...project});
    setShowEditModal(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
    const project: ProjectWithMembers = {
        id: `proj-${Date.now()}`,
        title: newProject.title,
        description: newProject.description,
        startDate: newProject.startDate || new Date(),
        endDate: newProject.endDate || new Date(),
        status: newProject.status || 'active',
      photo: newProject.photo || '',
        result: newProject.result || '',
        teamMembers: newProject.teamMembers || [],
        members: newProject.teamMembers || []
    };

    setProjects([...projects, project]);
    setShowAddModal(false);
    setNewProject({
        title: '',
      description: '',
        startDate: new Date(),
        endDate: new Date(),
        status: 'active',
      photo: '',
        result: '',
      teamMembers: []
    });
    }
  };

  const handleUpdateProject = () => {
    if (currentProject && newProject.title && newProject.description) {
      const updatedProjects = projects.map(project => {
        if (project.id === currentProject.id) {
          return {
            ...project,
            title: newProject.title || project.title,
            description: newProject.description || project.description,
            startDate: newProject.startDate || project.startDate,
            endDate: newProject.endDate || project.endDate,
            status: newProject.status || project.status,
            photo: newProject.photo || project.photo,
            result: newProject.result || project.result,
            teamMembers: newProject.teamMembers || project.teamMembers,
            members: newProject.teamMembers || project.members
          };
        }
        return project;
      });

      setProjects(updatedProjects);
    setShowEditModal(false);
    setCurrentProject(null);
    setNewProject({
        title: '',
      description: '',
        startDate: new Date(),
        endDate: new Date(),
        status: 'active',
      photo: '',
        result: '',
      teamMembers: []
    });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'In Progress':
        return <FaClock className="text-blue-500" />;
      case 'To Do':
        return <FaExclamationCircle className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {mode === 'add' ? 'Create New Project' : 'Projects Management'}
        </h2>
        {mode === 'add' && (
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
            <FaPlus /> Add Project
        </button>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

      {mode === 'add' ? (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={newProject.title || ''}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={newProject.description || ''}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter project description"
              />
      </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Members</label>
              <select
                multiple
                value={newProject.teamMembers?.map(m => m.id) || []}
                onChange={(e) => {
                  const selectedMembers = Array.from(e.target.selectedOptions, option => 
                    availableMembers.find(m => m.id === option.value)
                  ).filter((m): m is Member => m !== undefined);
                  setNewProject(prev => ({ ...prev, teamMembers: selectedMembers }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {availableMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                value={newProject.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setNewProject(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
                <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              onClick={handleAddProject}
                >
              Create Project
                </button>
          </form>
        </div>
      ) : (
        projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No projects found. Create your first project!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects
              .filter(project => 
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (statusFilter === 'all' || project.status === statusFilter)
              )
              .map((project) => (
                <div key={project.id} className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <h2 className="text-xl font-semibold">{project.title}</h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Team Members</p>
                      <p className="font-medium">{project.teamMembers.map(m => m.name).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
            </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Progress</span>
                      <span>{project.result === 'completed' ? '100%' : 'In Progress'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: project.result === 'completed' ? '100%' : '65%' }}
                />
              </div>
            </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      className="px-4 py-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditProject(project)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Update Status
                  </button>
                  </div>
                </div>
              ))}
          </div>
        )
      )}

      {/* Edit Project Modal */}
      {showEditModal && currentProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Edit Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newProject.title || ''}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description || ''}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                    value={newProject.startDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                    value={newProject.endDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newProject.status || 'active'}
                  onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Members
                </label>
                <select
                  multiple
                  value={newProject.teamMembers?.map(m => m.id) || []}
                  onChange={(e) => {
                    const selectedMembers = Array.from(e.target.selectedOptions, option => 
                      availableMembers.find(m => m.id === option.value)
                    ).filter((m): m is Member => m !== undefined);
                    setNewProject(prev => ({ ...prev, teamMembers: selectedMembers }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentProject(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleUpdateProject}
              >
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement; 