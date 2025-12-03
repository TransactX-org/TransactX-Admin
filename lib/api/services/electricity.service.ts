import apiClient from "../client"
import type {
  ApiResponse,
  PaginatedResponse,
  ElectricityStats,
  ElectricityTransaction,
  ElectricityTransactionDetail,
} from "../types"

// Get electricity statistics
export const getElectricityStats = async (): Promise<ApiResponse<ElectricityStats>> => {
  const response = await apiClient.get<ApiResponse<ElectricityStats>>("/admin/services/electricity/stats")
  return response.data
}

// Get electricity transactions
export const getElectricityTransactions = async (
  page: number = 1,
  perPage: number = 15
): Promise<ApiResponse<PaginatedResponse<ElectricityTransaction>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<ElectricityTransaction>>>(
    "/admin/services/electricity/transactions",
    {
      params: {
        page,
        per_page: perPage,
      },
    }
  )
  return response.data
}

// Get single electricity transaction
export const getElectricityTransactionById = async (id: string): Promise<ApiResponse<ElectricityTransactionDetail>> => {
  const response = await apiClient.get<ApiResponse<ElectricityTransactionDetail>>(`/admin/services/electricity/transactions/${id}`)
  return response.data
}

