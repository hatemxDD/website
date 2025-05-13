import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, X, LogIn, ChevronRight } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
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
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-white/80 backdrop-blur-sm"
    } border-b border-secondary-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
                Research Lab
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-2 py-1 text-sm font-medium transition-all duration-200 hover:text-primary-600 ${
                    isActive(link.to) 
                      ? "text-primary-600" 
                      : "text-secondary-700"
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 transition-transform duration-300 ${
                      isActive(link.to) ? "scale-x-100" : ""
                    } group-hover:scale-x-100`}
                  ></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="btn-primary text-sm flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white transition-all duration-200 shadow-sm hover:shadow"
                >
                  Dashboard
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border-2 border-primary-500 text-primary-700 hover:bg-primary-50 hover:text-primary-800 transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-secondary-600" />
              ) : (
                <Menu className="h-6 w-6 text-secondary-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-secondary-100 animate-fade-in-down shadow-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.to)
                    ? "bg-primary-50 text-primary-700"
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
