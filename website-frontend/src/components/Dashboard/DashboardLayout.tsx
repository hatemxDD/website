import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaBell,
  FaCog,
  FaHome,
} from "react-icons/fa";

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  permissions: string[];
  subItems?: {
    path: string;
    icon: React.ReactNode;
    label: string;
    permissions: string[];
  }[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  menuItems,
  setActiveSection,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSubmenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.path && item.id) {
      navigate(item.path);
      setActiveSection(item.id);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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
                <p className="text-sm text-blue-200">{user?.role || "User"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() =>
                      item.subItems
                        ? toggleSubmenu(item.id)
                        : handleMenuClick(item)
                    }
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200
                      ${
                        item.path && isActive(item.path)
                          ? "bg-white/20 text-white shadow-md"
                          : "bg-white/10 text-gray-200 hover:bg-white/15"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.subItems && (
                      <FaChevronDown
                        className={`w-4 h-4 transform transition-transform duration-200
                          ${expandedMenus.includes(item.id) ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.subItems && expandedMenus.includes(item.id) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200
                            ${
                              isActive(subItem.path)
                                ? "bg-white/20 text-white shadow-sm"
                                : "bg-white/10 text-gray-200 hover:bg-white/15"
                            }`}
                        >
                          <span className="mr-3 text-base">{subItem.icon}</span>
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-indigo-700/50 bg-indigo-950">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-all duration-200"
              >
                {isDarkMode ? (
                  <FaSun className="w-5 h-5" />
                ) : (
                  <FaMoon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-all duration-200"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-0"}`}
        >
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isSidebarOpen ? (
                  <FaTimes className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <FaBars className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaBell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaCog className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
