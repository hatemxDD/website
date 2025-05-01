import { api } from "./api";

export interface News {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateNewsData {
  title: string;
  image: string;
}

export interface UpdateNewsData {
  title?: string;
  image?: string;
}

export const newsService = {
  /**
   * Get all news items
   */
  getAll: () => api.get<News[]>("/api/news"),

  /**
   * Get a news item by ID
   */
  getById: (id: number) => api.get<News>(`/api/news/${id}`),

  /**
   * Create a new news item
   */
  create: (news: CreateNewsData) => api.post<News>("/api/news", news),

  /**
   * Update a news item
   */
  update: (id: number, news: UpdateNewsData) =>
    api.put<News>(`/api/news/${id}`, news),

  /**
   * Delete a news item
   */
  delete: (id: number) => api.delete<void>(`/api/news/${id}`),

  /**
   * Get recent news items (last 5)
   */
  getRecent: () => api.get<News[]>("/api/news/recent"),
};
