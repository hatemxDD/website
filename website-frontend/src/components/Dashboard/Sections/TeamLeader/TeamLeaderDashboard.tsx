import React, { useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import DashboardLayout from "../../DashboardLayout";
import {
  FaHome,
  FaUsers,
  FaProjectDiagram,
  FaUserPlus,
  FaUser,
  FaTasks,
  FaPlus,
  FaBook,
  FaNewspaper,
  FaBell,
} from "react-icons/fa";

import TeamLeaderOverview from "../../Sections/TeamLeader/TeamLeaderOverview";
import TeamManagement from "../../Sections/TeamLeader/TeamManagement";
import ProjectsManagement from "../../Sections/TeamLeader/ProjectsManagement";
import Profile from "../../Sections/Profile";
import SeeArticle from "../See/SeeArticle";
import AddArticle from "../Create/AddArticle";
import AddMemberToTeam from "./AddMemberToTeam";
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
          path: "/dashboard/TeamLeader/my-team",
          icon: <FaUsers className="nav-icon" />,
          label: "View Team",
          permissions: ["TeamLeader"],
        },
        {
          path: "/dashboard/TeamLeader/my-team/add",
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
      id: "Article",
      icon: <FaNewspaper className="w-5 h-5" />,
      label: "Article",
      permissions: ["TeamLeader"],
      subItems: [
        {
          permissions: ["TeamLeader"],
          label: "See article",
          path: "/dashboard/TeamLeader/articles",
          icon: <FaBell className="w-4 h-4" />,
        },
        {
          permissions: ["TeamLeader"],
          label: "Add article",
          path: "/dashboard/TeamLeader/articles/add",
          icon: <FaPlus className="w-4 h-4" />,
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
        <Route path="my-team">
          <Route index element={<TeamManagement />} />
          <Route path="add" element={<AddMemberToTeam/>} />
        </Route>

        {/* Projects Routes */}
        <Route path="projects">
          <Route index element={<ProjectsManagement />} />
          <Route path="add" element={<ProjectsManagement mode="add" />} />
        </Route>

        {/* Articles Routes */}
        <Route path="articles">
          <Route index element={<SeeArticle />} />
          <Route path="add" element={<AddArticle />} />
          <Route path="edit/:id" element={<AddArticle />} />
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
