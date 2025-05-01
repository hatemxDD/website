// Type definitions for User related models, aligned with backend Prisma schema

export enum Role {
  LabLeader = "LabLeader",
  TeamLeader = "TeamLeader",
  TeamMember = "TeamMember",
}

export enum ProjectState {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
  CANCELLED = "CANCELLED",
}

// Base User interface matching Prisma schema
export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  leadingTeams?: Team[];
  memberOfTeams?: TeamMember[];
  news?: News[];
  articles?: Article[];
}

// Team interface matching Prisma schema
export interface Team {
  id: number;
  name: string;
  description?: string;
  acro: string;
  leaderId: number;
  leader?: User;
  members?: TeamMember[];
  projects?: Project[];
  createdAt: Date;
  updatedAt: Date;
}

// TeamMember interface matching Prisma schema
export interface TeamMember {
  id: number;
  teamId: number;
  team?: Team;
  userId: number;
  user?: User;
  joinedAt: Date;
}

// News interface matching Prisma schema
export interface News {
  id: number;
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  author?: User;
}

// Article interface matching Prisma schema
export interface Article {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  author?: User;
}

// Project interface matching Prisma schema
export interface Project {
  id: number;
  name: string;
  description?: string;
  state: ProjectState;
  image?: string;
  teamId: number;
  team?: Team;
  createdAt: Date;
  updatedAt: Date;
}

// For backward compatibility with existing code
export type UserRole = Role;

// Extended user interface for dashboard display
export interface UserDashboardData {
  id: number;
  name: string;
  email: string;
  role: Role;
  teamId?: number;
  team?: string;
  articles?: number;
  projects?: number;
  profileImage?: string;
  memberOfTeams?: TeamMember[];
  leadingTeams?: Team[];
  totalArticles?: number;
  totalProjects?: number;
  totalTeamMembers?: number;
}
