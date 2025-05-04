import React, { useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import DashboardLayout from "../../DashboardLayout";
import { FaHome, FaProjectDiagram, FaBook, FaUser } from "react-icons/fa";
import MemberOverview from "../../Sections/Member/MemberOverview";
import MemberProjects from "../../Sections/Member/MemberProjects";
import Profile from "../../Sections/Profile";
import SeeNews from "../../Sections/See/SeeNews";
import Publications from "../../../Publications/Publications";

// Use the correct role type from Prisma schema
type UserRole = "TeamMember";

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  permissions: UserRole[];
}

const MemberDashboard: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  // Menu items specific to regular members
  const menuItems: MenuItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <FaHome className="nav-icon" />,
      path: "/dashboard/TeamMember/overview",
      permissions: ["TeamMember"],
    },
    {
      id: "projects",
      label: "My Projects",
      icon: <FaProjectDiagram className="nav-icon" />,
      path: "/dashboard/TeamMember/projects",
      permissions: ["TeamMember"],
    },
    {
      id: "publications",
      label: "Publications",
      icon: <FaBook className="nav-icon" />,
      path: "/dashboard/TeamMember/publications",
      permissions: ["TeamMember"],
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser className="nav-icon" />,
      path: "/dashboard/TeamMember/profile",
      permissions: ["TeamMember"],
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
        <Route path="overview" element={<MemberOverview />} />
        <Route path="projects" element={<MemberProjects />} />
        <Route path="publications" element={<Publications />} />
        <Route path="news" element={<SeeNews />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default MemberDashboard;
