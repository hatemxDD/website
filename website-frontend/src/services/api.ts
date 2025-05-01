/**
 * API service for connecting to the backend
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Get the authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Base API client for making requests to the backend
 */
export const api = {
  /**
   * Fetch data from the API
   * @param endpoint - API endpoint
   * @param options - Fetch options
   * @returns The response data
   */
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    // Get the auth token
    const token = getAuthToken();

    // Add headers to the request
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // If unauthorized, clear the token
      if (response.status === 401) {
        localStorage.removeItem("token");
      }

      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  },

  /**
   * Make a GET request
   */
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * Make a POST request
   */
  post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Make a PUT request
   */
  put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * Make a DELETE request
   */
  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
