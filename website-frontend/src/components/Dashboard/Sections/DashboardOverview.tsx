import React from 'react';
import { Users, FileText, Building, Clipboard, BarChart2, Calendar, UserPlus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all hover:shadow-lg" 
       style={{ borderTop: `3px solid ${color}` }}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
      <div className="p-2 rounded-full" style={{ color, backgroundColor: `${color}20` }}>{icon}</div>
    </div>
    <div className="text-2xl font-semibold" style={{ color }}>{value}</div>
  </div>
);

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, onClick }) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg hover:translate-y-[-2px]" 
    onClick={onClick}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">{title}</h3>
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">{icon}</div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const DashboardOverview: React.FC = () => {
  // This would typically come from your API or state management
  const stats = [
    { 
      title: 'Total Members', 
      value: 24, 
      icon: <Users size={20} />, 
      color: '#4a6cf7' 
    },
    { 
      title: 'Active Teams', 
      value: 5, 
      icon: <Building size={20} />, 
      color: '#10b981' 
    },
    { 
      title: 'Published News', 
      value: 12, 
      icon: <FileText size={20} />, 
      color: '#f59e0b' 
    },
    { 
      title: 'Upcoming Events', 
      value: 3, 
      icon: <Calendar size={20} />, 
      color: '#6366f1' 
    }
  ];

  const quickActions = [
    {
      title: 'Add New Member',
      description: 'Register a new researcher or student to the lab.',
      icon: <UserPlus size={20} />,
      onClick: () => console.log('Navigate to Add Member')
    },
    {
      title: 'Create Team',
      description: 'Form a new research team and assign members.',
      icon: <Building size={20} />,
      onClick: () => console.log('Navigate to Create Team')
    },
    {
      title: 'Publish News',
      description: 'Share announcements, publications, or updates.',
      icon: <FileText size={20} />,
      onClick: () => console.log('Navigate to Add News')
    },
    {
      title: 'View Reports',
      description: 'See performance and activity reports.',
      icon: <BarChart2 size={20} />,
      onClick: () => console.log('Navigate to Reports')
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Lab Overview</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Welcome to your dashboard. Here's an overview of your lab's current status.</p>
      
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <QuickAction
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={action.onClick}
          />
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Activities</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">New member joined: Sarah Johnson</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">2 days ago</div>
            </div>
          </li>
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">Team "Quantum Computing" created</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">4 days ago</div>
            </div>
          </li>
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">New publication: "Advances in Machine Learning"</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">1 week ago</div>
            </div>
          </li>
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">Research grant approved for Project Alpha</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">2 weeks ago</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview; 