import { api } from "./api";

export interface Team {
  id: number;
  name: string;
  description: string | null;
  acro: string;
  leaderId: number;
  createdAt: string;
  updatedAt: string;
  leader?: {
    id: number;
    name: string;
    email: string;
  };
  members?: TeamMember[];
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  joinedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  acro: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  acro?: string;
  leaderId?: number;
}

export interface AddTeamMemberData {
  userId: number;
}

export const teamsService = {
  /**
   * Get all teams
   */
  getAll: () => api.get<Team[]>("/api/teams"),

  /**
   * Get a team by ID
   */
  getById: (id: number) => api.get<Team>(`/api/teams/${id}`),

  /**
   * Create a new team
   */
  create: (team: CreateTeamData) => api.post<Team>("/api/teams", team),

  /**
   * Update a team
   */
  update: (id: number, team: UpdateTeamData) =>
    api.put<Team>(`/api/teams/${id}`, team),

  /**
   * Delete a team
   */
  delete: (id: number) => api.delete<void>(`/api/teams/${id}`),

  /**
   * Get team members
   */
  getMembers: (teamId: number) =>
    api.get<TeamMember[]>(`/api/teams/${teamId}/members`),

  /**
   * Add a member to a team
   */
  addMember: (teamId: number, data: AddTeamMemberData) =>
    api.post<TeamMember>(`/api/teams/${teamId}/members`, data),

  /**
   * Remove a member from a team
   */
  removeMember: (teamId: number, userId: number) =>
    api.delete<void>(`/api/teams/${teamId}/members/${userId}`),
};
