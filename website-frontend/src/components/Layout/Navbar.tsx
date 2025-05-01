/**
 * Navbar Component
 * 
 * Main navigation component that appears on all pages.
 * Features:
 * - Responsive navigation menu
 * - User authentication status
 * - Dynamic route handling
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.type) {
      case 'lab_leader':
        return '/dashboard/lab-leader';
      case 'team_leader':
        return '/dashboard/team-leader';
      case 'member':
        return '/dashboard/member';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Research Lab
        </Link>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/teams" className={location.pathname === '/teams' ? 'active' : ''}>
            Teams
          </Link>
          <Link to="/news" className={location.pathname === '/news' ? 'active' : ''}>
            News
          </Link>
          <Link to="/publications" className={location.pathname === '/publications' ? 'active' : ''}>
            Publications
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            Contact
          </Link>
        </div>

        <div className="nav-auth">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-button" 
                onClick={toggleDropdown}
                title={`${user.name} - ${user.position}`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                ) : (
                  <span className="user-initial">{user.name[0]}</span>
                )}
                <span className="user-name">{user.name}</span>
                <span className="user-position">{user.position}</span>
              </button>
              <div className={`dropdown-menu ${isDropdownOpen ? 'visible' : ''}`}>
                <button onClick={() => handleDropdownItemClick(getDashboardPath())}>
                  <span className="menu-icon">📊</span> Dashboard
                </button>
                <button onClick={() => handleDropdownItemClick('/profile')}>
                  <span className="menu-icon">👤</span> Profile
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="logout-button">
                  <span className="menu-icon">🚪</span> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 