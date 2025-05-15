import { api } from "./api";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  date: string;
  journal: string;
  abstract: string;
  category: string;
  doi: string;
  image: string;
  impactFactor?: string;
  citations?: number;
}

export interface CreatePublicationData {
  title: string;
  authors: string[];
  date: string;
  journal: string;
  abstract: string;
  category: string;
  doi: string;
  image: string;
  impactFactor?: string;
  citations?: number;
}

export interface UpdatePublicationData {
  title?: string;
  authors?: string[];
  date?: string;
  journal?: string;
  abstract?: string;
  category?: string;
  doi?: string;
  image?: string;
  impactFactor?: string;
  citations?: number;
}

export const publicationsService = {
  /**
   * Get all publications
   */
  getAll: () => api.get<Publication[]>("/api/publications"),

  /**
   * Get a publication by ID
   */
  getById: (id: string) => api.get<Publication>(`/api/publications/${id}`),

  /**
   * Create a new publication
   */
  create: (publication: CreatePublicationData) =>
    api.post<Publication>("/api/publications", publication),

  /**
   * Update a publication
   */
  update: (id: string, publication: UpdatePublicationData) =>
    api.put<Publication>(`/api/publications/${id}`, publication),

  /**
   * Delete a publication
   */
  delete: (id: string) => api.delete<void>(`/api/publications/${id}`),

  /**
   * Get recent publications
   */
  getRecent: () => api.get<Publication[]>("/api/publications/recent"),

  /**
   * Get publications by category
   */
  getByCategory: (category: string) =>
    api.get<Publication[]>(`/api/publications/category/${category}`),
};
