import apiClient from "../client"
import type { ApiResponse, PaginatedResponse, ServiceProvider, AirtimeStats, AirtimeTransaction, AirtimeTransactionDetail } from "../types"

// Get supported airtime networks
export const getAirtimeNetworks = async (): Promise<ApiResponse<ServiceProvider[]>> => {
  const response = await apiClient.get<ApiResponse<ServiceProvider[]>>("/admin/services/airtime/networks")
  return response.data
}

// Get airtime statistics
export const getAirtimeStats = async (): Promise<ApiResponse<AirtimeStats>> => {
  const response = await apiClient.get<ApiResponse<AirtimeStats>>("/admin/services/airtime/stats")
  return response.data
}

// Get airtime transactions
export const getAirtimeTransactions = async (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string
    network?: string
    status?: string
    start_date?: string
    end_date?: string
  }
): Promise<ApiResponse<PaginatedResponse<AirtimeTransaction>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<AirtimeTransaction>>>("/admin/services/airtime/transactions", {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
  })
  return response.data
}

// Create airtime recharge card (pin)
export const createAirtimeRechargeCard = async (payload: any): Promise<ApiResponse<any>> => {
  const response = await apiClient.post<ApiResponse<any>>("/admin/services/airtime/recharge-cards", payload)
  return response.data
}

// Get single airtime transaction
export const getAirtimeTransactionById = async (id: string): Promise<ApiResponse<AirtimeTransactionDetail>> => {
  const response = await apiClient.get<ApiResponse<AirtimeTransactionDetail>>(`/admin/services/airtime/transactions/${id}`)
  return response.data
}

