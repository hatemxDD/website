import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Building,
  Clipboard,
  BarChart2,
  Calendar,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import { newsService } from "../../../services/newsService";
import { teamsService } from "../../../services/teamsService";
import { usersService } from "../../../services/usersService";

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

interface DashboardStats {
  totalMembers: number;
  activeTeams: number;
  publishedNews: number;
  upcomingEvents: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all hover:shadow-lg"
    style={{ borderTop: `3px solid ${color}` }}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </h3>
      <div
        className="p-2 rounded-full"
        style={{ color, backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
    <div className="text-2xl font-semibold" style={{ color }}>
      {value}
    </div>
  </div>
);

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
}) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg hover:translate-y-[-2px]"
    onClick={onClick}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">
        {title}
      </h3>
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
        {icon}
      </div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<
    {
      title: string;
      value: number;
      icon: React.ReactNode;
      color: string;
    }[]
  >([
    {
      title: "Total Members",
      value: 0,
      icon: <Users size={20} />,
      color: "#4a6cf7",
    },
    {
      title: "Active Teams",
      value: 0,
      icon: <Building size={20} />,
      color: "#10b981",
    },
    {
      title: "Published News",
      value: 0,
      icon: <FileText size={20} />,
      color: "#f59e0b",
    },
    {
      title: "Upcoming Events",
      value: 0,
      icon: <Calendar size={20} />,
      color: "#6366f1",
    },
  ]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // Fetch data from multiple services instead of a single endpoint
        const [teamsResponse, newsResponse, usersResponse] = await Promise.all([
          teamsService.getAll(),
          newsService.getAll(),
          usersService.getAll(),
        ]);

        // Calculate statistics from the responses
        const activeTeams = teamsResponse.length;
        const publishedNews = newsResponse.length;
        const totalMembers = usersResponse.length;
         // In a real app, you would fetch this
        const upcomingEvents = 5; // In a real app, you would fetch this

        // Update stats with the fetched data
        setStats([
          {
            title: "Total Members",
            value: totalMembers,
            icon: <Users size={20} />,
            color: "#4a6cf7",
          },
          {
            title: "Active Teams",
            value: activeTeams,
            icon: <Building size={20} />,
            color: "#10b981",
          },
          {
            title: "Published News",
            value: publishedNews,
            icon: <FileText size={20} />,
            color: "#f59e0b",
          },
          {
            title: "Upcoming Events",
            value: upcomingEvents,
            icon: <Calendar size={20} />,
            color: "#6366f1",
          },
        ]);

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard statistics");

        // Fallback to default numbers if api fails
        setStats([
          {
            title: "Total Members",
            value: 22,
            icon: <Users size={20} />,
            color: "#4a6cf7",
          },
          {
            title: "Active Teams",
            value: 5,
            icon: <Building size={20} />,
            color: "#10b981",
          },
          {
            title: "Published News",
            value: 12,
            icon: <FileText size={20} />,
            color: "#f59e0b",
          },
          {
            title: "Upcoming Events",
            value: 3,
            icon: <Calendar size={20} />,
            color: "#6366f1",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickActions = [
    {
      title: "Add New Member",
      description: "Register a new researcher or student to the lab.",
      icon: <UserPlus size={20} />,
      onClick: () => navigate("/dashboard/LabLeader/members/add"),
    },
    {
      title: "See Teams",
      description: "See all teams of the lab.",
      icon: <Building size={20} />,
      onClick: () => navigate("/dashboard/LabLeader/teams"),
    },
    {
      title: "Publish News",
      description: "Share announcements, publications, or updates.",
      icon: <FileText size={20} />,
      onClick: () => navigate("/dashboard/LabLeader/news/add"),
    },
    {
      title: "View Reports",
      description: "See performance and activity reports.",
      icon: <BarChart2 size={20} />,
      onClick: () => console.log("Navigate to Reports"),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Lab Overview
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome to your dashboard. Here's an overview of your lab's current
        status.
      </p>

      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Statistics
      </h3>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : (
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
      )}

      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Quick Actions
      </h3>
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

      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Recent Activities
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                New member joined: Sarah Johnson
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                2 days ago
              </div>
            </div>
          </li>
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                Team "Quantum Computing" created
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                4 days ago
              </div>
            </div>
          </li>
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                New publication: "Advances in Machine Learning"
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                1 week ago
              </div>
            </div>
          </li>
          <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                Research grant approved for Project Alpha
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                2 weeks ago
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview;
