import React, { useState } from "react";
import {useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaNewspaper,
  FaUser,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronDown,
  FaTachometerAlt,
  FaUserPlus,
  FaClipboardList,
  FaBell,
  FaCog,
  FaPlus,
} from "react-icons/fa";

// Import dashboard sections


const LabLeaderDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: "overview",
      icon: <FaTachometerAlt className="w-5 h-5" />,
      label: "Overview",
      path: "/dashboard/LabLeader",
    },
    {
      id: "members",
      icon: <FaUsers className="w-5 h-5" />,
      label: "Members",
      submenu: [
        {
          id: "all-members",
          label: "All Members",
          path: "/dashboard/LabLeader/members",
          icon: <FaClipboardList className="w-4 h-4" />,
        },
        {
          id: "add-member",
          label: "Add Member",
          path: "/dashboard/LabLeader/members/add",
          icon: <FaUserPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "teams",
      icon: <FaUserFriends className="w-5 h-5" />,
      label: "Teams",
      submenu: [
        {
          id: "see-teams",
          label: "See Teams",
          path: "/dashboard/LabLeader/teams",
          icon: <FaClipboardList className="w-4 h-4" />,
        },
        {
          id: "add-team",
          label: "Add Team",
          path: "/dashboard/LabLeader/teams/add",
          icon: <FaPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "news",
      icon: <FaNewspaper className="w-5 h-5" />,
      label: "News",
      submenu: [
        {
          id: "see-news",
          label: "See News",
          path: "/dashboard/LabLeader/news",
          icon: <FaBell className="w-4 h-4" />,
        },
        {
          id: "add-news",
          label: "Add News",
          path: "/dashboard/LabLeader/news/add",
          icon: <FaPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "Article",
      icon: <FaNewspaper className="w-5 h-5" />,
      label: "Article",
      submenu: [
        {
          id: "see-articles",
          label: "See article",
          path: "/dashboard/LabLeader/articles",
          icon: <FaBell className="w-4 h-4" />,
        },
        {
          id: "add-article",
          label: "Add article",
          path: "/dashboard/LabLeader/articles/add",
          icon: <FaPlus className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "profile",
      icon: <FaUser className="w-5 h-5" />,
      label: "Profile",
      path: "/dashboard/LabLeader/profile",
    },
    {
      id: "settings",
      icon: <FaCog className="w-5 h-5" />,
      label: "Settings",
      path: "/dashboard/LabLeader/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSubmenu = (id: string) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const handleNavigation = (item: any) => {
    if (item.submenu) {
      toggleSubmenu(item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard/LabLeader") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl`}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-between h-16 px-4 bg-blue-950">
          <div className="flex items-center space-x-3">
            <FaHome className="w-8 h-8" />
            <span className="text-lg font-semibold">Research Lab</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{user?.name || "User"}</h3>
              <p className="text-sm text-blue-200">Lab Leader</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors duration-200
                    ${
                      isActive(item.path || "")
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-700/50"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <FaChevronDown
                      className={`w-4 h-4 transform transition-transform duration-200 
                      ${activeSubmenu === item.id ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.id && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => navigate(subItem.path)}
                        className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200
                          ${
                            isActive(subItem.path)
                              ? "bg-blue-700 text-white"
                              : "text-blue-100 hover:bg-blue-700/50"
                          }`}
                      >
                        <span className="mr-3">{subItem.icon}</span>
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-blue-700/50 text-blue-100"
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700/50 text-blue-100"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-0"} transition-margin duration-300`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-medium text-gray-800 ml-4">Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LabLeaderDashboard;
