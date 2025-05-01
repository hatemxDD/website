import { api } from "./api";

export interface Article {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateArticleData {
  name: string;
  content: string;
}

export interface UpdateArticleData {
  name?: string;
  content?: string;
}

export const articlesService = {
  /**
   * Get all articles
   */
  getAll: () => api.get<Article[]>("/api/articles"),

  /**
   * Get an article by ID
   */
  getById: (id: number) => api.get<Article>(`/api/articles/${id}`),

  /**
   * Create a new article
   */
  create: (article: CreateArticleData) =>
    api.post<Article>("/api/articles", article),

  /**
   * Update an article
   */
  update: (id: number, article: UpdateArticleData) =>
    api.put<Article>(`/api/articles/${id}`, article),

  /**
   * Delete an article
   */
  delete: (id: number) => api.delete<void>(`/api/articles/${id}`),

  /**
   * Get articles by author ID
   */
  getByAuthor: (authorId: number) =>
    api.get<Article[]>(`/api/users/${authorId}/articles`),
};
