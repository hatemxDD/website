import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaCheckCircle,
  FaTeam,
} from "react-icons/fa";
import { useAuth } from "../../../../contexts/AuthContext";
import { api } from "../../../../services/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface ProjectStatus {
  id: string;
  name: string;
  status: "To Do" | "In Progress" | "Completed";
  members: string[];
  deadline: string;
}

const TeamLeaderOverview: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for chart data
  const [teamMembersData, setTeamMembersData] = useState<any>(null);
  const [projectsStatusData, setProjectsStatusData] = useState<any>(null);
  const [tasksProgressData, setTasksProgressData] = useState<any>(null);
  const [completionRateData, setCompletionRateData] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<ProjectStatus[]>([]);
  const [teamStatsData, setTeamStatsData] = useState<any>(null);
  const [memberPerformanceData, setMemberPerformanceData] = useState<any>(null);
  const [projectTimelineData, setProjectTimelineData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch all dashboard data for the team leader
        const response = await api.get<{
          teamMembersDistribution: {
            labels: string[];
            data: number[];
          };
          projectsStatus: {
            labels: string[];
            data: number[];
          };
          tasksProgress: {
            labels: string[];
            data: number[];
          };
          completionRate: {
            labels: string[];
            data: number[];
          };
          recentProjects: ProjectStatus[];
          teamStats: {
            labels: string[];
            teamMembers: number[];
            activeProjects: number[];
          };
          memberPerformance: {
            labels: string[];
            data: number[];
          };
          projectTimeline: {
            labels: string[];
            started: number[];
            completed: number[];
          };
        }>(`/api/teamleaders/${user.id}/dashboard`);

        // Set team members distribution data
        setTeamMembersData({
          labels: response.teamMembersDistribution.labels,
          datasets: [
            {
              data: response.teamMembersDistribution.data,
              backgroundColor: [
                "rgba(59, 130, 246, 0.8)", // blue
                "rgba(34, 197, 94, 0.8)", // green
                "rgba(234, 179, 8, 0.8)", // yellow
                "rgba(168, 85, 247, 0.8)", // purple
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(34, 197, 94, 1)",
                "rgba(234, 179, 8, 1)",
                "rgba(168, 85, 247, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        // Set projects status data
        setProjectsStatusData({
          labels: response.projectsStatus.labels,
          datasets: [
            {
              label: "Projects",
              data: response.projectsStatus.data,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
          ],
        });

        // Set tasks progress data
        setTasksProgressData({
          labels: response.tasksProgress.labels,
          datasets: [
            {
              label: "Tasks Completed",
              data: response.tasksProgress.data,
              borderColor: "rgba(34, 197, 94, 1)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        // Set completion rate data
        setCompletionRateData({
          labels: response.completionRate.labels,
          datasets: [
            {
              label: "Completion Rate (%)",
              data: response.completionRate.data,
              backgroundColor: "rgba(168, 85, 247, 0.5)",
              borderColor: "rgba(168, 85, 247, 1)",
              borderWidth: 1,
            },
          ],
        });

        // Set recent projects
        setRecentProjects(response.recentProjects);

        // Set team stats data
        setTeamStatsData({
          labels: response.teamStats.labels,
          datasets: [
            {
              label: "Team Members",
              data: response.teamStats.teamMembers,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
            {
              label: "Active Projects",
              data: response.teamStats.activeProjects,
              backgroundColor: "rgba(34, 197, 94, 0.5)",
              borderColor: "rgba(34, 197, 94, 1)",
              borderWidth: 1,
            },
          ],
        });

        // Set member performance data
        setMemberPerformanceData({
          labels: response.memberPerformance.labels,
          datasets: [
            {
              label: "Tasks Completed",
              data: response.memberPerformance.data,
              backgroundColor: "rgba(168, 85, 247, 0.5)",
              borderColor: "rgba(168, 85, 247, 1)",
              borderWidth: 1,
            },
          ],
        });

        // Set project timeline data
        setProjectTimelineData({
          labels: response.projectTimeline.labels,
          datasets: [
            {
              label: "Projects Started",
              data: response.projectTimeline.started,
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Projects Completed",
              data: response.projectTimeline.completed,
              borderColor: "rgba(34, 197, 94, 1)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching team leader dashboard data:", err);
        setError("Failed to load dashboard data");

        // Set fallback data (using the static data that was there before)
        setDefaultChartData();
      } finally {
        setLoading(false);
      }
    };

    const setDefaultChartData = () => {
      // Team Members Distribution
      setTeamMembersData({
        labels: ["Researchers", "Engineers", "Interns", "Advisors"],
        datasets: [
          {
            data: [8, 5, 3, 2],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)", // blue
              "rgba(34, 197, 94, 0.8)", // green
              "rgba(234, 179, 8, 0.8)", // yellow
              "rgba(168, 85, 247, 0.8)", // purple
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(234, 179, 8, 1)",
              "rgba(168, 85, 247, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });

      // Active Projects Status
      setProjectsStatusData({
        labels: ["Planning", "In Progress", "Testing", "Completed"],
        datasets: [
          {
            label: "Projects",
            data: [3, 5, 2, 4],
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
        ],
      });

      // Tasks Progress
      setTasksProgressData({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Tasks Completed",
            data: [12, 19, 15, 25, 22, 30, 18],
            borderColor: "rgba(34, 197, 94, 1)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      });

      // Project Completion Rate
      setCompletionRateData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Completion Rate (%)",
            data: [65, 75, 80, 85, 90, 95],
            backgroundColor: "rgba(168, 85, 247, 0.5)",
            borderColor: "rgba(168, 85, 247, 1)",
            borderWidth: 1,
          },
        ],
      });

      setRecentProjects([
        {
          id: "1",
          name: "Research Data Analysis",
          status: "In Progress",
          members: ["Alex", "Maria", "David"],
          deadline: "2024-04-15",
        },
        {
          id: "2",
          name: "Lab Equipment Upgrade",
          status: "To Do",
          members: ["Lisa", "James"],
          deadline: "2024-05-01",
        },
        {
          id: "3",
          name: "Publication Review",
          status: "Completed",
          members: ["Alex", "Maria"],
          deadline: "2024-03-20",
        },
      ]);

      // Team Statistics Data
      setTeamStatsData({
        labels: ["Team A", "Team B", "Team C", "Team D"],
        datasets: [
          {
            label: "Team Members",
            data: [8, 6, 5, 7],
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
          {
            label: "Active Projects",
            data: [4, 3, 2, 5],
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
          },
        ],
      });

      // Member Performance Data
      setMemberPerformanceData({
        labels: ["Alex", "Maria", "David", "Lisa", "James", "Sarah"],
        datasets: [
          {
            label: "Tasks Completed",
            data: [25, 30, 18, 22, 15, 28],
            backgroundColor: "rgba(168, 85, 247, 0.5)",
            borderColor: "rgba(168, 85, 247, 1)",
            borderWidth: 1,
          },
        ],
      });

      // Project Timeline Data
      setProjectTimelineData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Projects Started",
            data: [2, 3, 1, 4, 2, 3],
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Projects Completed",
            data: [1, 2, 2, 3, 1, 2],
            borderColor: "rgba(34, 197, 94, 1)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      });
    };

    // Fetch data when component mounts
    fetchDashboardData();
  }, [user?.id]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Members Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Team Members Distribution
          </h2>
          <div className="h-64">
            <Pie
              data={teamMembersData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: "Team Composition",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Active Projects Status */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Active Projects Status</h2>
          <div className="h-64">
            <Bar
              data={projectsStatusData}
              options={{
                ...barChartOptions,
                plugins: {
                  ...barChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Projects by Status",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Tasks Progress */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Weekly Tasks Progress</h2>
          <div className="h-64">
            <Line
              data={tasksProgressData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: "Tasks Completed This Week",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Project Completion Rate */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Project Completion Rate
          </h2>
          <div className="h-64">
            <Bar
              data={completionRateData}
              options={{
                ...barChartOptions,
                plugins: {
                  ...barChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Monthly Completion Rate",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Team Statistics Chart */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Team Statistics</h2>
        <div className="h-80">
          <Bar
            data={teamStatsData}
            options={{
              ...barChartOptions,
              plugins: {
                ...barChartOptions.plugins,
                title: {
                  display: true,
                  text: "Team Members vs Active Projects",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Member Performance Chart */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Member Performance</h2>
        <div className="h-80">
          <Bar
            data={memberPerformanceData}
            options={{
              ...barChartOptions,
              plugins: {
                ...barChartOptions.plugins,
                title: {
                  display: true,
                  text: "Tasks Completed by Team Members",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Project Timeline Chart */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Project Timeline</h2>
        <div className="h-80">
          <Line
            data={projectTimelineData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  display: true,
                  text: "Projects Started vs Completed",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Project Status</h2>
          <div className="h-64">
            <Pie data={projectStatusData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <div className="h-64">
            <Bar data={teamPerformanceData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Team: {project.members.join(", ")}</p>
                  <p>
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-600">
              Create New Project
            </button>
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-green-600">
              Add Team Member
            </button>
            <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-600">
              Schedule Team Meeting
            </button>
            <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-600">
              View All Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderOverview;
