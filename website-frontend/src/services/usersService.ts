import { api } from "./api";
import { Role } from "../types/type";

// Define user types based on your backend
export interface User {
  id: number;
  name: string;
  email: string;
  role: string | Role;
  team?: string;
  joinDate?: string;
  photo?: string;
  createdAt?: string;
  // Add other user properties as needed
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string | Role;
  team?: string;
  joinDate?: string;
  photo?: string;
}

export interface Member {
  id: number;
  email: string;
  userId: number;
  teamId: number;
  joinedAt: string;
}

export interface CreateMemberData {
  userId: number;
  teamId: number;
}

// Users API service
export const usersService = {
  /**
   * Get all users
   */
  getAll: () => api.get<User[]>("/api/users"),

  /**
   * Get a user by ID
   */
  getById: (id: number) => api.get<User>(`/api/users/${id}`),

  /**
   * Create a new user
   */
  create: (userData: CreateUserData) =>
    api.post<User>("/api/users/register", userData),

  /**
   * Login user
   */
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>("/api/users/login", {
      email,
      password,
    }),

  /**
   * Get current user profile
   */
  getProfile: () => api.get<User>("/api/users/profile"),

  /**
   * Update current user profile
   */
  updateProfile: (userData: Partial<User>) =>
    api.put<User>("/api/users/profile", userData),

  /**
   * Update a user
   */
  update: (id: number, user: Partial<User>) =>
    api.put<User>(`/api/users/${id}`, user),

  /**
   * Delete a user
   */
  delete: (id: number) => api.delete<void>(`/api/users/${id}`),

  /**
   * Create a new member
   */
  createMember: (data: CreateMemberData) =>
    api.post<Member>("/api/members", data),
};
