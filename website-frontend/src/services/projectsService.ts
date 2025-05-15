import { api } from "./api";

export type ProjectState =
  | "PLANNING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  state: ProjectState;
  image: string | null;
  teamId: number;
  createdAt: string;
  updatedAt: string;
  expectedEndDate: string | null;
  team?: {
    id: number;
    name: string;
    acro: string;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  state?: ProjectState;
  image?: string;
  teamId: number;
  expectedEndDate?: Date;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  state?: ProjectState;
  image?: string;
  teamId?: number;
  expectedEndDate?: Date;
}

export const projectsService = {
  /**
   * Get all projects
   */
  getAll: () => api.get<Project[]>("/api/projects"),

  /**
   * Get a project by ID
   */
  getById: (id: number) => api.get<Project>(`/api/projects/${id}`),

  /**
   * Create a new project
   */
  create: (project: CreateProjectData) =>
    api.post<Project>("/api/projects", project),

  /**
   * Update a project
   */
  update: (id: number, project: UpdateProjectData) =>
    api.put<Project>(`/api/projects/${id}`, project),

  /**
   * Delete a project
   */
  delete: (id: number) => api.delete<void>(`/api/projects/${id}`),

  /**
   * Get projects by team ID
   */
  getByTeam: (teamId: number) =>
    api.get<Project[]>(`/api/projects/team/${teamId}`),

  /**
   * Get projects by state
   */
  getByState: (state: ProjectState) =>
    api.get<Project[]>(`/api/projects/state/${state}`),
};
