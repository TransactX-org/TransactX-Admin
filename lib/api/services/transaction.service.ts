import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

// Transaction Types
export interface Transaction {
  id: string
  transactionId: string
  user: string
  type: string
  amount: number
  status: string
  date: string
  description?: string
  reference?: string
}

// Get all transactions
export const getTransactions = async (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    status?: string
    type?: string
    search?: string
    date_from?: string
    date_to?: string
  }
): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>("/admin/transactions", {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
  })
  return response.data
}

// Get transaction stats
export const getTransactionStats = async (): Promise<ApiResponse<{
  total: number
  successful: number
  pending: number
  failed: number
  total_amount: number
}>> => {
  const response = await apiClient.get<ApiResponse<{
    total: number
    successful: number
    pending: number
    failed: number
    total_amount: number
  }>>("/admin/transactions/stats")
  return response.data
}

// Get single transaction
export const getTransactionById = async (id: string): Promise<ApiResponse<Transaction>> => {
  const response = await apiClient.get<ApiResponse<Transaction>>(`/admin/transactions/${id}`)
  return response.data
}

