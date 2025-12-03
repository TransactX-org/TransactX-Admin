import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios"

// API Base URL - can be moved to environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ip-160-187-210-249.my-advin.com/api/v1"

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or wherever you store it
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
            window.location.href = "/login"
          }
          break
        case 403:
          // Forbidden
          console.error("Access forbidden")
          break
        case 404:
          // Not found
          console.error("Resource not found")
          break
        case 500:
          // Server error
          console.error("Server error")
          break
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - please check your connection")
    }

    return Promise.reject(error)
  }
)

export default apiClient

