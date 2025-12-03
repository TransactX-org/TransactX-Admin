import apiClient from "../client"
import type { ApiResponse, ServiceProvider } from "../types"

// Get supported TV providers
export const getTVProviders = async (): Promise<ApiResponse<ServiceProvider[]>> => {
  const response = await apiClient.get<ApiResponse<ServiceProvider[]>>("/admin/services/tv/providers")
  return response.data
}

// Note: TV stats and transactions endpoints not provided in docs, but structure is ready for them

