import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaUsers,
  FaNewspaper,
  FaProjectDiagram,
  FaUserCog,
  FaChartLine,
  FaCalendarAlt,
  FaPlus,
  FaEdit
} from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStats = () => {
    if (user?.role === 'LabLeader') {
      return [
        { label: 'Total Members', value: '25', icon: <FaUsers />, color: 'bg-blue-500' },
        { label: 'Active Teams', value: '8', icon: <FaUserCog />, color: 'bg-green-500' },
        { label: 'News Posts', value: '12', icon: <FaNewspaper />, color: 'bg-purple-500' },
        { label: 'Projects', value: '15', icon: <FaProjectDiagram />, color: 'bg-yellow-500' }
      ];
    } else if (user?.role === 'TeamLeader') {
      return [
        { label: 'Team Members', value: '6', icon: <FaUsers />, color: 'bg-blue-500' },
        { label: 'Active Projects', value: '3', icon: <FaProjectDiagram />, color: 'bg-green-500' },
        { label: 'Tasks Completed', value: '45', icon: <FaChartLine />, color: 'bg-purple-500' },
        { label: 'Upcoming Events', value: '4', icon: <FaCalendarAlt />, color: 'bg-yellow-500' }
      ];
    }
    return [
      { label: 'Assigned Projects', value: '2', icon: <FaProjectDiagram />, color: 'bg-blue-500' },
      { label: 'Tasks Completed', value: '12', icon: <FaChartLine />, color: 'bg-green-500' },
      { label: 'Team Events', value: '3', icon: <FaCalendarAlt />, color: 'bg-purple-500' },
      { label: 'News Updates', value: '8', icon: <FaNewspaper />, color: 'bg-yellow-500' }
    ];
  };

  const stats = getStats();

  const QuickActions = () => {
    if (user?.role === 'LabLeader') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <FaPlus className="mr-2 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">Add New Team</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <FaEdit className="mr-2 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">Post News Update</span>
          </button>
        </div>
      );
    } else if (user?.role === 'TeamLeader') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <FaPlus className="mr-2 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300">Create New Project</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <FaEdit className="mr-2 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">Update Team Status</span>
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening in your {user?.role?.replace('_', ' ')} dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      {/* Role-specific Content */}
      {user?.role === 'LabLeader' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Team Activities
            </h2>
            <div className="space-y-4">
              {/* Add team activities list here */}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lab Performance
            </h2>
            <div className="space-y-4">
              {/* Add performance metrics here */}
            </div>
          </div>
        </div>
      )}

      {user?.role === 'TeamLeader' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Progress
            </h2>
            <div className="space-y-4">
              {/* Add team progress content here */}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Timeline
            </h2>
            <div className="space-y-4">
              {/* Add project timeline here */}
            </div>
          </div>
        </div>
      )}

      {user?.role === 'TeamMember' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              My Tasks
            </h2>
            <div className="space-y-4">
              {/* Add tasks list here */}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Updates
            </h2>
            <div className="space-y-4">
              {/* Add team updates here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 