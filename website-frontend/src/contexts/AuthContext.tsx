import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, AuthUser, LoginData } from "../services/authService";

// Define user type for the context
export interface ExtendedUser extends AuthUser {
  avatar?: string;
  bio?: string;
  phone?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  education?: string;
  researchInterests?: string[];
}

interface AuthContextType {
  user: ExtendedUser | null;
  login: (email: string, password: string) => Promise<ExtendedUser>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on initial render
  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        const token = authService.getAuthToken();
        if (token) {
          // Token exists, try to get current user
          const currentUser = await authService.getCurrentUser();

          // Transform to ExtendedUser with default avatar
          const extendedUser: ExtendedUser = {
            ...currentUser,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`,
            position: getRolePosition(currentUser.role),
            department: "Research",
          };

          setUser(extendedUser);
        }
      } catch (error) {
        console.error("Error loading user from token:", error);
        authService.removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  // Helper function to get position based on role
  const getRolePosition = (role: string): string => {
    switch (role) {
      case "LabLeader":
        return "Laboratory Director";
      case "TeamLeader":
        return "Team Leader";
      default:
        return "Research Associate";
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<ExtendedUser> => {
    try {
      setIsLoading(true);

      const loginData: LoginData = { email, password };
      const response = await authService.login(loginData);

      // Save the token
      authService.setAuthToken(response.token);

      // Transform to ExtendedUser with default avatar
      const extendedUser: ExtendedUser = {
        ...response.user,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=random`,
        position: getRolePosition(response.user.role),
        department: "Research",
      };

      setUser(extendedUser);
      return extendedUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.removeAuthToken();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated();
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
