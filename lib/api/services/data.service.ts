import apiClient from "../client"
import type { ApiResponse, PaginatedResponse, ServiceProvider, DataStats, DataTransaction, DataTransactionDetail } from "../types"

// Get supported data providers
export const getDataProviders = async (): Promise<ApiResponse<ServiceProvider[]>> => {
  const response = await apiClient.get<ApiResponse<ServiceProvider[]>>("/admin/services/data/providers")
  return response.data
}

// Get data statistics
export const getDataStats = async (): Promise<ApiResponse<DataStats>> => {
  const response = await apiClient.get<ApiResponse<DataStats>>("/admin/services/data/stats")
  return response.data
}

// Get data transactions
export const getDataTransactions = async (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string
    network?: string
    status?: string
    start_date?: string
    end_date?: string
  }
): Promise<ApiResponse<PaginatedResponse<DataTransaction>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<DataTransaction>>>("/admin/services/data/transactions", {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
  })
  return response.data
}

// Create data plan
export const createDataPlan = async (payload: any): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>("/admin/services/data/plans", payload)
  return response.data
}


// Get single data transaction
export const getDataTransactionById = async (id: string): Promise<ApiResponse<DataTransactionDetail>> => {
  const response = await apiClient.get<ApiResponse<DataTransactionDetail>>(`/admin/services/data/transactions/${id}`)
  return response.data
}

