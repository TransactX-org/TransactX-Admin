import apiClient from "../client"
import type { ApiResponse, ServiceProvider, PaginatedResponse, TVStats, TVTransaction } from "../types"

// Get supported TV providers
export const getTVProviders = async (): Promise<ApiResponse<ServiceProvider[]>> => {
  const response = await apiClient.get<ApiResponse<ServiceProvider[]>>("/admin/services/tv/providers")
  return response.data
}

// Get TV statistics
export const getTVStats = async (): Promise<ApiResponse<TVStats>> => {
  const response = await apiClient.get<ApiResponse<TVStats>>("/admin/services/tv/stats")
  return response.data
}

// Get TV transactions
export const getTVTransactions = async (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string
    provider?: string
    status?: string
    start_date?: string
    end_date?: string
  }
): Promise<ApiResponse<PaginatedResponse<TVTransaction>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<TVTransaction>>>("/admin/services/tv/transactions", {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
  })
  return response.data
}

// Create TV provider
export const createTvProvider = async (payload: any): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>("/admin/services/tv/providers", payload)
  return response.data
}


// Get single TV transaction
export const getTVTransaction = async (id: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/services/tv/transactions/${id}`)
  return response.data
}

