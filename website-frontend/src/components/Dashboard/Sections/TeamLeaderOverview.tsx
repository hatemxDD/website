import React, { useState, useEffect } from 'react';
import { BarChart2, Users, FileText, ChevronRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface Project {
  id: string;
  name: string;
  status: string;
  deadline: string;
  progress: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
}

const TeamLeaderOverview: React.FC = () => {
  const { teams, members } = useApp();
  
  const [recentProjects, setRecentProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'AI Algorithm Development',
      status: 'In Progress',
      deadline: '2023-12-25',
      progress: 65
    },
    {
      id: '2',
      name: 'Machine Learning Model Testing',
      status: 'In Review',
      deadline: '2023-11-15',
      progress: 90
    },
    {
      id: '3',
      name: 'Data Collection Phase',
      status: 'Completed',
      deadline: '2023-10-30',
      progress: 100
    }
  ]);
  
  const [teamMembersData, setTeamMembersData] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Data Scientist',
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: 'Sarah Williams',
      role: 'ML Engineer',
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: 'Michael Brown',
      role: 'Research Assistant',
      photoUrl: 'https://randomuser.me/api/portraits/men/46.jpg'
    }
  ]);
  
  // Effect to fetch data from context if available
  useEffect(() => {
    // This would be replaced by actual team data when available
    if (teams && teams.length > 0) {
      // Update team-related data
    }
    
    if (members && members.length > 0) {
      // Update team members data
    }
  }, [teams, members]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'not started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Team Members" 
          value={teamMembersData.length} 
          icon={<Users className="h-6 w-6 text-white" />} 
          color="bg-blue-500"
          trend="2 new this month"
        />
        <StatCard 
          title="Active Projects" 
          value={recentProjects.filter(p => p.status.toLowerCase() !== 'completed').length} 
          icon={<FileText className="h-6 w-6 text-white" />} 
          color="bg-purple-500"
          trend="1 due this week"
        />
        <StatCard 
          title="Completion Rate" 
          value={85} 
          icon={<BarChart2 className="h-6 w-6 text-white" />} 
          color="bg-green-500"
          trend="+12% from last month"
        />
      </div>
      
      {/* Project Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Project Progress</h2>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="space-y-4">
          {recentProjects.map(project => (
            <div key={project.id} className="border-b dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800 dark:text-white">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColorClass(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Deadline: {formatDate(project.deadline)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Team Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Team Members</h2>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm">
            Manage Team <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembersData.map(member => (
            <div key={member.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-shrink-0 mr-3">
                {member.photoUrl ? (
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                    {member.name.substring(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderOverview; 