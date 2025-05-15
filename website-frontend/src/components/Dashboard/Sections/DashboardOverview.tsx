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
import { useTheme } from "../../../contexts/ThemeContext";
import { newsService } from "../../../services/newsService";
import { teamsService } from "../../../services/teamsService";
import { usersService } from "../../../services/usersService";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

interface DashboardStats {
  totalMembers: number;
  activeTeams: number;
  publishedNews: number;
  upcomingEvents: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  bgGradient,
}) => (
  <div
    className="rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
    style={{ background: bgGradient }}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-white/80">{title}</h3>
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${color}30` }}
      >
        <div className="text-white">{icon}</div>
      </div>
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
  color,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h3>
        <div
          className="p-2 rounded-full"
          style={{
            backgroundColor: `${color}${isDarkMode ? "15" : "20"}`,
            color,
          }}
        >
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<
    {
      title: string;
      value: number;
      icon: React.ReactNode;
      color: string;
      bgGradient: string;
    }[]
  >([
    {
      title: "Total Members",
      value: 0,
      icon: <Users size={20} />,
      color: "#4a6cf7",
      bgGradient: "linear-gradient(135deg, #4a6cf7 0%, #2851e3 100%)",
    },
    {
      title: "Active Teams",
      value: 0,
      icon: <Building size={20} />,
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      title: "Published News",
      value: 0,
      icon: <FileText size={20} />,
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      title: "Upcoming Events",
      value: 0,
      icon: <Calendar size={20} />,
      color: "#6366f1",
      bgGradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
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
            bgGradient: "linear-gradient(135deg, #4a6cf7 0%, #2851e3 100%)",
          },
          {
            title: "Active Teams",
            value: activeTeams,
            icon: <Building size={20} />,
            color: "#10b981",
            bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          },
          {
            title: "Published News",
            value: publishedNews,
            icon: <FileText size={20} />,
            color: "#f59e0b",
            bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          },
          {
            title: "Upcoming Events",
            value: upcomingEvents,
            icon: <Calendar size={20} />,
            color: "#6366f1",
            bgGradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
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
            bgGradient: "linear-gradient(135deg, #4a6cf7 0%, #2851e3 100%)",
          },
          {
            title: "Active Teams",
            value: 5,
            icon: <Building size={20} />,
            color: "#10b981",
            bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          },
          {
            title: "Published News",
            value: 12,
            icon: <FileText size={20} />,
            color: "#f59e0b",
            bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          },
          {
            title: "Upcoming Events",
            value: 3,
            icon: <Calendar size={20} />,
            color: "#6366f1",
            bgGradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
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
      color: "#4a6cf7",
    },
    {
      title: "See Teams",
      description: "See all teams of the lab.",
      icon: <Building size={20} />,
      onClick: () => navigate("/dashboard/LabLeader/teams"),
      color: "#10b981",
    },
    {
      title: "Publish News",
      description: "Share announcements, publications, or updates.",
      icon: <FileText size={20} />,
      onClick: () => navigate("/dashboard/LabLeader/news/add"),
      color: "#f59e0b",
    },
    {
      title: "Add Article",
      description: "Add a new article.",
      icon: <BarChart2 size={20} />,
      onClick: () => navigate("/dashboard/LabLeader/articles/add"),
      color: "#6366f1",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 inline-block">
          Lab Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your dashboard. Here's an overview of your lab's current
          status.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-5 rounded-xl mb-8 shadow-md">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-5">
            Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                bgGradient={stat.bgGradient}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-5">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
