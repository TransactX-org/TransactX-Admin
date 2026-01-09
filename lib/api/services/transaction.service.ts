import apiClient from "../client"
import type {
  ApiResponse,
  PaginatedResponse,
  TransactionSummary,
  TransactionDetail,
  TransactionStatistics,
  TransactionReports
} from "../types"

// Get all transactions
export const getTransactions = async (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    status?: string
    type?: string
    search?: string
    start_date?: string
    end_date?: string
  }
): Promise<ApiResponse<PaginatedResponse<TransactionSummary>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<TransactionSummary>>>("/admin/transactions", {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
  })
  return response.data
}

// Get single transaction
export const getTransactionById = async (id: string): Promise<ApiResponse<TransactionDetail>> => {
  const response = await apiClient.get<ApiResponse<TransactionDetail>>(`/admin/transactions/${id}`)
  return response.data
}

// Get transaction statistics
export const getTransactionStatistics = async (
  year?: number,
  month?: number
): Promise<ApiResponse<TransactionStatistics>> => {
  const response = await apiClient.get<ApiResponse<TransactionStatistics>>("/admin/transactions/statistics", {
    params: { year, month }
  })
  return response.data
}

// Get transaction reports
export const getTransactionReports = async (
  year?: number,
  start_date?: string,
  end_date?: string
): Promise<ApiResponse<TransactionReports>> => {
  const response = await apiClient.get<ApiResponse<TransactionReports>>("/admin/transactions/reports", {
    params: { year, start_date, end_date }
  })
  return response.data
}

