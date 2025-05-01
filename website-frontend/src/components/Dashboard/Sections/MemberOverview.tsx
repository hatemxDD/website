import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { FaProjectDiagram, FaCalendarCheck, FaUsersCog, FaNewspaper } from 'react-icons/fa';

const MemberOverview: React.FC = () => {
  const { currentUser, projects, teams } = useApp();
  const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [teamEvents, setTeamEvents] = useState(3);  // Mock data
  const [newsUpdates, setNewsUpdates] = useState(8);  // Mock data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this data would come from an API
    try {
      // Simulate fetching assigned projects for the member
      const assignedProjs = projects.filter(project => 
        project.members?.some((member: any) => member.id === currentUser?.id)
      );
      setAssignedProjects(assignedProjs);
      
      // Mock data for completed tasks
      setCompletedTasks(12);
    } catch (err) {
      setError('Failed to load overview data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, projects]);

  if (loading) {
    return <div className="loading">Loading overview...</div>;
  }

  return (
    <div className="member-overview-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {currentUser?.name || 'Researcher'}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your dashboard.</p>
      </div>

      {error && (
        <div className="error-message mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-800 text-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 bg-blue-700 rounded-full mr-4">
            <FaProjectDiagram className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Assigned Projects</h3>
            <p className="text-3xl font-bold">{assignedProjects.length}</p>
          </div>
        </div>
        
        <div className="bg-green-700 text-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 bg-green-600 rounded-full mr-4">
            <FaCalendarCheck className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Tasks Completed</h3>
            <p className="text-3xl font-bold">{completedTasks}</p>
          </div>
        </div>
        
        <div className="bg-purple-700 text-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 bg-purple-600 rounded-full mr-4">
            <FaUsersCog className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Team Events</h3>
            <p className="text-3xl font-bold">{teamEvents}</p>
          </div>
        </div>
        
        <div className="bg-orange-600 text-white rounded-lg shadow-md p-6 flex items-center">
          <div className="p-3 bg-orange-500 rounded-full mr-4">
            <FaNewspaper className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">News Updates</h3>
            <p className="text-3xl font-bold">{newsUpdates}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex flex-col items-center">
            <span className="text-sm font-medium">View Profile</span>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors flex flex-col items-center">
            <span className="text-sm font-medium">View Projects</span>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors flex flex-col items-center">
            <span className="text-sm font-medium">Check Updates</span>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors flex flex-col items-center">
            <span className="text-sm font-medium">View Lab Info</span>
          </button>
        </div>
      </div>

      {/* Assigned Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Projects</h2>
        
        {assignedProjects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">You are not assigned to any projects yet.</p>
        ) : (
          <div className="space-y-4">
            {assignedProjects.map(project => (
              <div 
                key={project.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800 dark:text-white">{project.name}</h3>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                  {project.endDate && (
                    <span className="ml-3">Due: {new Date(project.endDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="mt-3">
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
      </div>
    </div>
  );
};

export default MemberOverview; 