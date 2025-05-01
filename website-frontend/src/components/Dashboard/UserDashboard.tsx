import React, { useState } from 'react';
import { FaUser, FaBook, FaProjectDiagram, FaEdit, FaBell, FaFileAlt } from 'react-icons/fa';
import './Dashboard.css';

interface UserDashboardProps {
  userData: {
    id: string;
    name: string;
    email: string;
    role: string;
    team?: string;
    publications?: number;
    projects?: number;
    profileImage?: string;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="dashboard-content-section">
            <h2>Profile Information</h2>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-image">
                  <img 
                    src={userData.profileImage || 'https://via.placeholder.com/150'} 
                    alt={userData.name} 
                  />
                </div>
                <div className="profile-info">
                  <h3>{userData.name}</h3>
                  <p className="role">{userData.role}</p>
                  <p className="team">{userData.team}</p>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <FaBook className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-number">{userData.publications || 0}</span>
                    <span className="stat-label">Publications</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaProjectDiagram className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-number">{userData.projects || 0}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <strong>Email:</strong>
                  <span>{userData.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Team:</strong>
                  <span>{userData.team || 'Not Assigned'}</span>
                </div>
              </div>
              <button className="edit-profile-btn">
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        );
      case 'publications':
        return (
          <div className="dashboard-content-section">
            <h2>My Publications</h2>
            <div className="publications-list">
              {/* Publications will be mapped here */}
              <div className="empty-state">
                <FaBook className="empty-icon" />
                <p>No publications yet</p>
              </div>
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="dashboard-content-section">
            <h2>My Projects</h2>
            <div className="projects-list">
              {/* Projects will be mapped here */}
              <div className="empty-state">
                <FaProjectDiagram className="empty-icon" />
                <p>No projects yet</p>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="dashboard-content-section">
            <h2>My Documents</h2>
            <div className="documents-list">
              {/* Documents will be mapped here */}
              <div className="empty-state">
                <FaFileAlt className="empty-icon" />
                <p>No documents yet</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img 
            src={userData.profileImage || 'https://via.placeholder.com/50'} 
            alt={userData.name}
            className="sidebar-avatar" 
          />
          <div className="sidebar-user-info">
            <h3>{userData.name}</h3>
            <p>{userData.role}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'publications' ? 'active' : ''}`}
            onClick={() => setActiveTab('publications')}
          >
            <FaBook className="nav-icon" />
            <span>Publications</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram className="nav-icon" />
            <span>Projects</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FaFileAlt className="nav-icon" />
            <span>Documents</span>
          </button>
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {userData.name}!</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
          </div>
        </header>
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 