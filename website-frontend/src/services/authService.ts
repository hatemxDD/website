import { api } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: "LabLeader" | "TeamLeader" | "TeamMember";
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  role?: "LabLeader" | "TeamLeader" | "TeamMember";
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Log in a user
   */
  login: (data: LoginData) => api.post<LoginResponse>("/api/users/login", data),

  /**
   * Register a new user
   */
  register: (data: RegisterData) =>
    api.post<AuthUser>("/api/users/register", data),

  /**
   * Get the current logged-in user
   */
  getCurrentUser: () => api.get<AuthUser>("/api/users/me"),

  /**
   * Set authentication token for future requests
   */
  setAuthToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  /**
   * Get the stored authentication token
   */
  getAuthToken: (): string | null => {
    return localStorage.getItem("token");
  },

  /**
   * Remove authentication token
   */
  removeAuthToken: () => {
    localStorage.removeItem("token");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
