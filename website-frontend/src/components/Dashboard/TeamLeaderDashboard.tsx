import React, { useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import {
  FaHome,
  FaUsers,
  FaProjectDiagram,
  FaUserPlus,
  FaUser,
  FaTasks,
  FaPlus,
} from "react-icons/fa";

import TeamLeaderOverview from "./Sections/TeamLeader/TeamLeaderOverview";
import TeamManagement from "./Sections/TeamLeader/TeamManagement";
import ProjectsManagement from "./Sections/TeamLeader/ProjectsManagement";
import Profile from "./Sections/Profile";

// Use the correct role type from Prisma schema
type UserRole = "TeamLeader";

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  permissions: UserRole[];
  subItems?: {
    path: string;
    icon: React.ReactNode;
    label: string;
    permissions: UserRole[];
  }[];
}

const TeamLeaderDashboard: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  const menuItems: MenuItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <FaHome className="nav-icon" />,
      path: "/dashboard/TeamLeader/overview",
      permissions: ["TeamLeader"],
    },
    {
      id: "team",
      label: "My Team",
      icon: <FaUsers className="nav-icon" />,
      permissions: ["TeamLeader"],
      subItems: [
        {
          path: "/dashboard/TeamLeader/team",
          icon: <FaUsers className="nav-icon" />,
          label: "View Team",
          permissions: ["TeamLeader"],
        },
        {
          path: "/dashboard/TeamLeader/team/add",
          icon: <FaUserPlus className="nav-icon" />,
          label: "Add Member",
          permissions: ["TeamLeader"],
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FaProjectDiagram className="nav-icon" />,
      permissions: ["TeamLeader"],
      subItems: [
        {
          path: "/dashboard/TeamLeader/projects",
          icon: <FaTasks className="nav-icon" />,
          label: "View Projects",
          permissions: ["TeamLeader"],
        },
        {
          path: "/dashboard/TeamLeader/projects/add",
          icon: <FaPlus className="nav-icon" />,
          label: "Create Project",
          permissions: ["TeamLeader"],
        },
      ],
    },
    {
      id: "profile",
      label: "Edit Profile",
      icon: <FaUser className="nav-icon" />,
      path: "/dashboard/TeamLeader/profile",
      permissions: ["TeamLeader"],
    },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<TeamLeaderOverview />} />

        {/* Team Routes */}
        <Route path="team">
          <Route index element={<TeamManagement />} />
          <Route path="add" element={<TeamManagement mode="add" />} />
        </Route>

        {/* Projects Routes */}
        <Route path="projects">
          <Route index element={<ProjectsManagement />} />
          <Route path="add" element={<ProjectsManagement mode="add" />} />
        </Route>

        {/* Profile Route */}
        <Route path="profile" element={<Profile />} />

        {/* Catch all redirect to overview */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default TeamLeaderDashboard;
