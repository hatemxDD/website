import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { Project } from '../../../types';

const ProjectsManagement: React.FC = () => {
  const { currentUser, teams, projects } = useApp();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAssigningMembers, setIsAssigningMembers] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active' as const
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<'active' | 'completed' | 'planned'>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const team = teams.find(team => team.leader?.id === currentUser?.id);
      if (team) {
        const teamProjs = projects.filter(project => project.team === team.id);
        setTeamProjects(teamProjs);
        setTeamMembers(team.members || []);
      } else {
        setTeamProjects([]);
        setTeamMembers([]);
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projects, teams, currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectFormData({
      ...projectFormData,
      [name]: value
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const team = teams.find(team => team.leader?.id === currentUser?.id);
      if (!team) {
        throw new Error('Team not found');
      }

      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: projectFormData.title,
        description: projectFormData.description,
        startDate: projectFormData.startDate,
        endDate: projectFormData.endDate || undefined,
        status: projectFormData.status,
        team: team.id,
        leader: currentUser?.id || '',
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTeamProjects([...teamProjects, newProject]);
      setProjectFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active' as const
      });
      setIsAddingProject(false);
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
  };

  const handleOpenAssignMembers = (project: Project) => {
    setSelectedProject(project);
    // Pre-select already assigned members
    setSelectedMembers(project.members?.map((m: any) => m.id) || []);
    setIsAssigningMembers(true);
  };

  const handleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleAssignMembers = () => {
    try {
      // In a real application, you would call an API endpoint
      const updatedProjects = teamProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            members: teamMembers.filter(member => selectedMembers.includes(member.id))
          };
        }
        return project;
      });
      
      setTeamProjects(updatedProjects);
      setIsAssigningMembers(false);
      setSelectedProject(null);
      setSelectedMembers([]);
    } catch (err) {
      setError('Failed to assign members');
      console.error(err);
    }
  };

  const handleOpenChangeStatus = (project: Project) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setIsChangingStatus(true);
  };

  const handleChangeStatus = () => {
    try {
      // In a real application, you would call an API endpoint
      const updatedProjects = teamProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            status: newStatus
          };
        }
        return project;
      });
      
      setTeamProjects(updatedProjects);
      setIsChangingStatus(false);
      setSelectedProject(null);
      setNewStatus('active');
    } catch (err) {
      setError('Failed to change project status');
      console.error(err);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // In a real application, you would call an API endpoint
        setTeamProjects(teamProjects.filter(project => project.id !== projectId));
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-management-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Management</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setIsAddingProject(!isAddingProject)}
        >
          <FaPlus className="mr-2" /> {isAddingProject ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {error && (
        <div className="error-message mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isAddingProject ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectFormData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectFormData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={projectFormData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={projectFormData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={projectFormData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setIsAddingProject(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {isAssigningMembers && selectedProject && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Assign Members to {selectedProject.title}
          </h2>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 mb-3">Select team members to assign to this project:</p>
            {teamMembers.length === 0 ? (
              <p className="text-gray-500 italic">No team members available. Add team members first.</p>
            ) : (
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`member-${member.id}`}
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberSelection(member.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`member-${member.id}`} 
                      className="ml-2 block text-gray-700 dark:text-gray-300"
                    >
                      {member.name} ({member.role || member.type})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() => {
                setIsAssigningMembers(false);
                setSelectedProject(null);
                setSelectedMembers([]);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleAssignMembers}
              disabled={teamMembers.length === 0}
            >
              Assign Members
            </button>
          </div>
        </div>
      )}

      {isChangingStatus && selectedProject && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Change Status for {selectedProject.title}
          </h2>
          <div className="mb-4">
            <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Status
            </label>
            <select
              id="newStatus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'active' | 'completed' | 'planned')}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() => {
                setIsChangingStatus(false);
                setSelectedProject(null);
                setNewStatus('active');
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleChangeStatus}
            >
              Update Status
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Projects List</h2>
        
        {teamProjects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No projects found. Create your first project!</p>
        ) : (
          <div className="space-y-4">
            {teamProjects.map(project => (
              <div 
                key={project.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 dark:text-white">{project.title}</h3>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleOpenAssignMembers(project)}
                      title="Assign Members"
                    >
                      <FaUserPlus />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => handleOpenChangeStatus(project)}
                      title="Change Status"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteProject(project.id)}
                      title="Delete Project"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{project.description}</p>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                  {project.endDate && (
                    <span className="ml-3">Due: {new Date(project.endDate).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assigned Members: 
                    {project.members?.length > 0 
                      ? project.members.map((m: any) => m.name).join(', ')
                      : ' None'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement; 