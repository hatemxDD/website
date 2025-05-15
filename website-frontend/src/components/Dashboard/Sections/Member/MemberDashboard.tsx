import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
  FaHome,
  FaProjectDiagram,
  FaBook,
  FaUser,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";

interface SubMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  submenu?: SubMenuItem[];
}

const MemberDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: "overview",
      icon: <FaHome className="w-5 h-5" />,
      label: "Overview",
      path: "/dashboard/TeamMember/overview",
    },
    {
      id: "projects",
      icon: <FaProjectDiagram className="w-5 h-5" />,
      label: "My Projects",
      path: "/dashboard/TeamMember/projects",
    },
    {
      id: "publications",
      icon: <FaBook className="w-5 h-5" />,
      label: "Publications",
      path: "/dashboard/TeamMember/publications",
    },
    {
      id: "profile",
      icon: <FaUser className="w-5 h-5" />,
      label: "Profile",
      path: "/dashboard/TeamMember/profile",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSubmenu = (id: string) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const handleNavigation = (item: MenuItem) => {
    if (item.submenu) {
      toggleSubmenu(item.id);
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    }
  };

  const isActive = (path: string) => {
    if (path === "/dashboard/TeamMember") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";

  return (
    <div className={`flex h-screen ${bgColor} transition-colors duration-300`}>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800"
            : "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500"
        } 
        text-white shadow-2xl`}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-between h-16 px-6 bg-opacity-30 backdrop-blur-sm bg-blue-950">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <FaHome className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold tracking-wide">
              Research Lab
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-5 border-b border-blue-700/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full ring-2 ring-white/30 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-lg font-semibold">
                {user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {user?.name || "User"}
              </h3>
              <p className="text-sm text-blue-100 opacity-80">Team Member</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-3 py-2 overflow-y-auto h-[calc(100vh-15rem)]">
          <div className="space-y-1.5">
            {menuItems.map((item) => (
              <div key={item.id} className="group">
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all duration-200
                    ${
                      isActive(item.path || "")
                        ? `${isDarkMode ? "bg-blue-700" : "bg-white/20 backdrop-blur-sm"} text-white shadow-md`
                        : `text-blue-100 hover:bg-white/10 hover:backdrop-blur-sm`
                    }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span
                      className={`text-xl transition-transform duration-300 ${isActive(item.path || "") ? "scale-110" : "group-hover:scale-110"}`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.submenu && (
                    <FaChevronDown
                      className={`w-3.5 h-3.5 transform transition-transform duration-200 
                      ${activeSubmenu === item.id ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.id && (
                  <div className="mt-1 ml-6 space-y-1 overflow-hidden animate-fadeIn">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => navigate(subItem.path)}
                        className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isActive(subItem.path)
                              ? "bg-blue-600/50 text-white shadow-sm"
                              : "text-blue-100 hover:bg-white/10"
                          }`}
                      >
                        <span className="mr-3 opacity-70">{subItem.icon}</span>
                        <span className="font-medium">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700/30 backdrop-blur-sm bg-blue-900/20">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-blue-700/50 text-blue-100 transition-colors duration-200 w-full justify-center"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${isSidebarOpen && !isMobile ? "ml-64" : "ml-0"} transition-all duration-300`}
      >
        {/* Header */}
        <header
          className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-md h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300`}
        >
          <div className="flex items-center">
            <button
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FaBars
                className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              />
            </button>
            <h1 className="text-xl font-semibold ml-4">Dashboard</h1>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={`p-6 transition-colors duration-300 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
