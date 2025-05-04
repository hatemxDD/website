import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Define the role type based on Prisma schema
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

  useEffect(() => {
    console.log("ProtectedRoute - Current auth state:", {
      isAuthenticated: isAuthenticated(),
      userRole: user?.role,
      isAllowed: user ? allowedRoles.includes(user.role) : false,
      currentPath: location.pathname,
    });
  }, [user, allowedRoles, location.pathname, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    console.log(
      "ProtectedRoute - User not authenticated, redirecting to login"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not authorized for this route
  if (user && !allowedRoles.includes(user.role)) {
    console.log(
      "ProtectedRoute - User not authorized for this route, redirecting to home"
    );
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
