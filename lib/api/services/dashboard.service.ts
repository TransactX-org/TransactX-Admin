import apiClient from "../client"
import type { ApiResponse } from "../types"

// Dashboard Stats Types
export interface DashboardStats {
  total_revenue: number
  total_transactions: number
  active_users: number
  pending_approvals: number
  revenue_change?: number
  transactions_change?: number
  users_change?: number
  approvals_change?: number
}

export interface RevenueData {
  name: string
  revenue: number
}

export interface TransactionVolumeData {
  name: string
  transactions: number
}

export interface RecentActivity {
  id: string
  user: string
  type: string
  amount: string
  status: string
  date: string
}

// Get dashboard stats
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats")
  return response.data
}

// Get revenue data
export const getRevenueData = async (): Promise<ApiResponse<RevenueData[]>> => {
  const response = await apiClient.get<ApiResponse<RevenueData[]>>("/admin/dashboard/revenue")
  return response.data
}

// Get transaction volume data
export const getTransactionVolumeData = async (): Promise<ApiResponse<TransactionVolumeData[]>> => {
  const response = await apiClient.get<ApiResponse<TransactionVolumeData[]>>("/admin/dashboard/transaction-volume")
  return response.data
}

// Get recent activity
export const getRecentActivity = async (limit: number = 10): Promise<ApiResponse<RecentActivity[]>> => {
  const response = await apiClient.get<ApiResponse<RecentActivity[]>>("/admin/dashboard/recent-activity", {
    params: { limit },
  })
  return response.data
}

