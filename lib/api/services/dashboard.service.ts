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

// Note: Dashboard data is now aggregated from other services in use-dashboard.ts
// to avoid using non-existent endpoints.

