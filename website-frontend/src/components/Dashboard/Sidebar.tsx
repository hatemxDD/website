import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaUserFriends, FaNewspaper, FaUser, FaMoon, FaSun, FaSignOutAlt, FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    members: false,
    teams: false,
    news: false
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme toggle logic
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col z-40">
      {/* User Profile Section */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <FaUser className="text-blue-800" />
          </div>
          <div>
            <p className="font-semibold">Lab Leader</p>
            <p className="text-sm text-blue-200">Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard/lab-leader"
              className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                location.pathname === '/dashboard/lab-leader' ? 'bg-blue-700' : ''
              }`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>

          {/* Members Section */}
          <li className="relative">
            <button
              onClick={() => toggleMenu('members')}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center">
                <FaUsers className="mr-3" />
                Members
              </div>
              {expandedMenus.members ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedMenus.members && (
              <ul className="ml-6 mt-2 space-y-1 absolute left-0 w-full bg-blue-800 rounded-md shadow-lg z-50">
                <li>
                  <Link
                    to="/dashboard/lab-leader/members"
                    className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                      location.pathname === '/dashboard/lab-leader/members' ? 'bg-blue-700' : ''
                    }`}
                  >
                    See Members
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/lab-leader/members/add"
                    className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                      location.pathname === '/dashboard/lab-leader/members/add' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Add Member
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Teams Section */}
          <li className="relative">
            <button
              onClick={() => toggleMenu('teams')}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center">
                <FaUserFriends className="mr-3" />
                Teams
              </div>
              {expandedMenus.teams ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedMenus.teams && (
              <ul className="ml-6 mt-2 space-y-1 absolute left-0 w-full bg-blue-800 rounded-md shadow-lg z-50">
                <li>
                  <Link
                    to="/dashboard/lab-leader/teams"
                    className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                      location.pathname === '/dashboard/lab-leader/teams' ? 'bg-blue-700' : ''
                    }`}
                  >
                    See Teams
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/lab-leader/teams/add"
                    className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                      location.pathname === '/dashboard/lab-leader/teams/add' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Add Team
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* News Section */}
          <li className="relative">
            <button
              onClick={() => toggleMenu('news')}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center">
                <FaNewspaper className="mr-3" />
                News
              </div>
              {expandedMenus.news ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedMenus.news && (
              <ul className="ml-6 mt-2 space-y-1 absolute left-0 w-full bg-blue-800 rounded-md shadow-lg z-50">
                <li>
                  <Link
                    to="/dashboard/lab-leader/news"
                    className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                      location.pathname === '/dashboard/lab-leader/news' ? 'bg-blue-700' : ''
                    }`}
                  >
                    See News
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/lab-leader/news/add"
                    className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                      location.pathname === '/dashboard/lab-leader/news/add' ? 'bg-blue-700' : ''
                    }`}
                  >
                    Add New
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/dashboard/lab-leader/profile"
              className={`flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors ${
                location.pathname === '/dashboard/lab-leader/profile' ? 'bg-blue-700' : ''
              }`}
            >
              <FaUser className="mr-3" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 