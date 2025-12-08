import apiClient from "../client"
import type { ApiResponse } from "../types"

// Auth Types
export interface LoginPayload {
  email: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  id?: string
  name: string
  email: string
  role: string
  is_super_admin?: boolean
  token: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}

// Login
export const login = async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>("/admin/auth/login", payload)
  return response.data
}

// Forgot Password
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>("/admin/auth/forgot-password", payload)
  return response.data
}

// Reset Password
export const resetPassword = async (payload: ResetPasswordPayload): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>("/admin/auth/reset-password", payload)
  return response.data
}

// Logout
export const logout = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }
}

