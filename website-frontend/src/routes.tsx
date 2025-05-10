import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Import your components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import About from "./components/About/about";
import Contact from "./components/Contact/Contact";
import Group from "./components/Team/Group";
import GroupDetail from "./components/Team/GroupDetail";
import { NewsList } from "./components/News/NewsList";
import NewsDetail from "./components/News/NewsDetail";
import Publications from "./components/Publications/Publications";
import ArticleDetails from "./components/Article/ArticleDetails";
import Projects from "./components/Dashboard/Projects";
import ProjectDetails from "./components/Project/ProjectDetails";
import ProfileWrapper from "./components/User/ProfileWrapper";

// Import dashboard components
import LabLeaderDashboard from "./components/Dashboard/Sections/LabLeader/LabLeaderDashboard";
import TeamLeaderDashboard from "./components/Dashboard/Sections/TeamLeader/TeamLeaderDashboard";
import MemberDashboard from "./components/Dashboard/Sections/Member/MemberDashboard";

// Import dashboard sections
import DashboardOverview from "./components/Dashboard/Sections/DashboardOverview";
import SeeMembers from "./components/Dashboard/Sections/See/SeeMembers";
import AddMember from "./components/Dashboard/Sections/Create/AddMember";
import EditMember from "./components/Dashboard/Sections/Edit/EditMember";
import LabLeaderProjects from "./components/Dashboard/Sections/See/SeeProjects";
import LabLeaderPublications from "./components/Dashboard/Sections/PublicationsManagement";
import Settings from "./components/Dashboard/Sections/Settings";
import SeeNews from "./components/Dashboard/Sections/See/SeeNews";
import AddNews from "./components/Dashboard/Sections/Create/AddNews";
import Profile from "./components/Dashboard/Sections/Profile";
import EditNews from "./components/Dashboard/Sections/Edit/EditNews";
import SeeArticle from "./components/Dashboard/Sections/See/SeeArticle";
import AddArticle from "./components/Dashboard/Sections/Create/AddArticle";

// Import team leader sections
import TeamLeaderOverview from "./components/Dashboard/Sections/TeamLeader/TeamLeaderOverview";
import TeamManagement from "./components/Dashboard/Sections/TeamLeader/TeamManagement";
import ProjectsManagement from "./components/Dashboard/Sections/TeamLeader/ProjectsManagement";
import PublicationsManagement from "./components/Dashboard/Sections/TeamLeader/PublicationsManagement";
import AddMemberToTeam from "./components/Dashboard/Sections/TeamLeader/AddMemberToTeam";

// Import Member sections
import MemberOverview from "./components/Dashboard/Sections/MemberOverview";
import MemberProjects from "./components/Dashboard/Sections/Member/MemberProjects";

// Import new components
import SeeTeams from "./components/Dashboard/Sections/See/SeeTeams";
import AddTeam from "./components/Dashboard/Sections/Create/AddTeam";

// Role type from Prisma schema
type UserRole = "LabLeader" | "TeamLeader" | "TeamMember";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only redirect to login if not authenticated and trying to access a protected route
  if (!isAuthenticated() && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not authorized for this route
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and authorized, or if it's a public route
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* News Routes */}
      <Route path="/news" element={<NewsList />} />
      <Route path="/news/:id" element={<NewsDetail />} />

      {/* Teams Routes */}
      <Route path="/teams" element={<Group />} />
      <Route path="/teams/:id" element={<GroupDetail />} />

      {/* Projects Routes */}
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />

      {/* Publications Routes */}
      <Route path="/articles" element={<SeeArticle />} />
      <Route path="/articles/:id" element={<ArticleDetails />} />

      {/* Profile Route */}
      <Route path="/profile" element={<ProfileWrapper />} />

      {/* Protected Lab Leader Dashboard Routes */}
      <Route
        path="/dashboard/LabLeader"
        element={
          <ProtectedRoute allowedRoles={["LabLeader"]}>
            <LabLeaderDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="members" element={<SeeMembers />} />
        <Route path="members/add" element={<AddMember />} />
        <Route path="members/edit/:id" element={<EditMember />} />
        <Route path="members/remove/:id" element={<SeeMembers />} />
        <Route path="teams" element={<SeeTeams />} />
        <Route path="teams/add" element={<AddTeam />} />
        <Route path="teams/edit/:id" element={<SeeTeams />} />
        <Route path="teams/remove/:id" element={<SeeTeams />} />
        <Route path="projects" element={<LabLeaderProjects />} />
        <Route path="projects/add" element={<LabLeaderProjects />} />
        <Route path="projects/tasks" element={<LabLeaderProjects />} />
        <Route path="projects/timeline" element={<LabLeaderProjects />} />
        <Route path="articles" element={<SeeArticle />} />
        <Route path="articles/add" element={<AddArticle />} />
        <Route path="articles/edit/:id" element={<AddArticle />} />
        <Route path="publications" element={<LabLeaderPublications />} />
        <Route path="publications/add" element={<LabLeaderPublications />} />
        <Route path="news" element={<SeeNews />} />
        <Route path="news/add" element={<AddNews />} />
        <Route path="news/edit/:id" element={<EditNews />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Protected Team Leader Dashboard Routes */}
      <Route
        path="/dashboard/TeamLeader"
        element={
          <ProtectedRoute allowedRoles={["TeamLeader"]}>
            <TeamLeaderDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<TeamLeaderOverview />} />
        <Route path="my-team" element={<TeamManagement />} />
        <Route path="my-team/add" element={<AddMemberToTeam />} />
        <Route path="my-team/remove" element={<TeamManagement />} />
        <Route path="projects" element={<ProjectsManagement />} />
        <Route path="projects/add" element={<ProjectsManagement />} />
        <Route path="projects/tasks" element={<ProjectsManagement />} />
        <Route path="projects/timeline" element={<ProjectsManagement />} />
        <Route path="articles" element={<SeeArticle />} />
        <Route path="articles/add" element={<AddArticle />} />
        <Route path="articles/edit/:id" element={<AddArticle />} />
        <Route path="publications" element={<PublicationsManagement />} />
        <Route path="publications/add" element={<PublicationsManagement />} />
        <Route path="news" element={<SeeNews />} />
        <Route path="news/add" element={<AddNews />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Protected Member Dashboard Routes */}
      <Route
        path="/dashboard/TeamMember"
        element={
          <ProtectedRoute allowedRoles={["TeamMember"]}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<MemberOverview />} />
        <Route path="projects" element={<MemberProjects />} />
        <Route path="publications" element={<Publications />} />
        <Route path="news" element={<SeeNews />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
