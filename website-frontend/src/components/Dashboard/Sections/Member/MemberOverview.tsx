import React, { useState, useEffect } from "react";
import { FaTasks, FaCheckCircle, FaClock } from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";
import { api } from "../../../../services/api";

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface Task {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
  project: string;
  deadline: string;
}

const MemberOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch tasks and stats for the current user
        const response = await api.get<{
          stats: {
            assigned: number;
            inProgress: number;
            completed: number;
          };
          tasks: Task[];
        }>(`/api/members/${user.id}/dashboard`);

        // Set the stats
        setStats([
          {
            title: "Assigned Tasks",
            value: response.stats.assigned,
            icon: <FaTasks className="text-3xl" />,
            color: "bg-blue-500",
          },
          {
            title: "In Progress",
            value: response.stats.inProgress,
            icon: <FaClock className="text-3xl" />,
            color: "bg-yellow-500",
          },
          {
            title: "Completed",
            value: response.stats.completed,
            icon: <FaCheckCircle className="text-3xl" />,
            color: "bg-green-500",
          },
        ]);

        // Set the tasks
        setTasks(response.tasks);
      } catch (err) {
        console.error("Error fetching member dashboard data:", err);
        setError("Failed to load dashboard data");

        // Fallback to sample data in case of error
        setStats([
          {
            title: "Assigned Tasks",
            value: 8,
            icon: <FaTasks className="text-3xl" />,
            color: "bg-blue-500",
          },
          {
            title: "In Progress",
            value: 3,
            icon: <FaClock className="text-3xl" />,
            color: "bg-yellow-500",
          },
          {
            title: "Completed",
            value: 12,
            icon: <FaCheckCircle className="text-3xl" />,
            color: "bg-green-500",
          },
        ]);

        setTasks([
          {
            id: "1",
            title: "Data Analysis for Project Alpha",
            status: "In Progress",
            project: "Research Data Analysis",
            deadline: "2024-04-10",
          },
          {
            id: "2",
            title: "Equipment Testing",
            status: "To Do",
            project: "Lab Equipment Upgrade",
            deadline: "2024-04-15",
          },
          {
            id: "3",
            title: "Literature Review",
            status: "Completed",
            project: "Publication Review",
            deadline: "2024-03-20",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-lg p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">{stat.title}</p>
                <h2 className="text-3xl font-bold">{stat.value}</h2>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{task.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Project: {task.project}</p>
                <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span>
              Completed literature review for Publication Review project
            </span>
            <span className="ml-auto">2 days ago</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="text-blue-500 mr-2" />
            <span>Started data analysis for Project Alpha</span>
            <span className="ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaTasks className="text-yellow-500 mr-2" />
            <span>Assigned to Lab Equipment Upgrade project</span>
            <span className="ml-auto">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;
