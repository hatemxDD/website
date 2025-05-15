import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Menu, X, LogIn, ChevronRight, Sun, Moon } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    return `/dashboard/${user.role}`;
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/teams", label: "Teams" },
    { to: "/news", label: "News" },
    { to: "/publications", label: "Publications" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/95 shadow-md backdrop-blur-md h-16"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-16"
      } border-b ${isDarkMode ? "border-gray-800" : "border-secondary-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span
                className={`text-xl font-display font-bold transition-all duration-300 group-hover:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
                }`}
              >
                Research Lab
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-2 py-1 text-xs font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? isDarkMode
                        ? "text-primary-400"
                        : "text-primary-600"
                      : isDarkMode
                        ? "text-gray-300 hover:text-primary-400"
                        : "text-secondary-700 hover:text-primary-600"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${
                      isDarkMode
                        ? "from-primary-400 to-accent-400"
                        : "from-primary-500 to-accent-500"
                    } transform scale-x-0 transition-transform duration-300 ${
                      isActive(link.to) ? "scale-x-100" : ""
                    } group-hover:scale-x-100`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Auth */}
          <div className="flex items-center space-x-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 rounded-md transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-secondary-100 text-secondary-600"
              }`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Auth section */}
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-md transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white"
                      : "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white"
                  } shadow-sm hover:shadow`}
                >
                  Dashboard
                  <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-xs font-medium transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:text-primary-400"
                      : "text-secondary-700 hover:text-primary-600"
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  isDarkMode
                    ? "border border-primary-500 text-primary-400 hover:bg-primary-900/30"
                    : "border border-primary-500 text-primary-700 hover:bg-primary-50"
                }`}
              >
                <LogIn className="h-3 w-3" />
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-secondary-100 text-secondary-600"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden backdrop-blur-md animate-fade-in-down shadow-md ${
            isDarkMode
              ? "bg-gray-900/95 border-t border-gray-800"
              : "bg-white/95 border-t border-secondary-100"
          }`}
        >
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive(link.to)
                    ? isDarkMode
                      ? "bg-gray-800 text-primary-400"
                      : "bg-primary-50 text-primary-700"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800 hover:text-primary-400"
                      : "text-secondary-700 hover:bg-secondary-50 hover:text-primary-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
