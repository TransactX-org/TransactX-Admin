import apiClient from "../client"
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserStats,
  CreateUserPayload,
  CreateUserResponse,
} from "../types"

// Get all users with pagination
export const getUsers = async (page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>("/admin/user-management", {
    params: {
      page,
      per_page: perPage,
    },
  })
  return response.data
}

// Get user statistics
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  const response = await apiClient.get<ApiResponse<UserStats>>("/admin/user-management/stats")
  return response.data
}

// Get single user by ID
export const getUserById = async (id: string): Promise<ApiResponse<{ user: User }>> => {
  const response = await apiClient.get<ApiResponse<{ user: User }>>(`/admin/user-management/${id}`)
  return response.data
}

// Create new user
export const createUser = async (payload: CreateUserPayload): Promise<ApiResponse<CreateUserResponse>> => {
  // Convert to FormData for multipart/form-data
  const formData = new FormData()
  formData.append("name", payload.name)
  formData.append("email", payload.email)
  formData.append("username", payload.username)
  formData.append("password", payload.password)
  formData.append("status", payload.status)
  formData.append("user_type", payload.user_type)
  formData.append("account_type", payload.account_type)
  formData.append("country", payload.country)
  formData.append("is_active", String(payload.is_active))
  formData.append("verify_email", String(payload.verify_email))
  formData.append("create_wallet", String(payload.create_wallet))

  const response = await apiClient.post<ApiResponse<CreateUserResponse>>("/admin/user-management", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Update user (if endpoint exists)
export const updateUser = async (id: string, payload: Partial<CreateUserPayload>): Promise<ApiResponse<{ user: User }>> => {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value))
    }
  })

  const response = await apiClient.put<ApiResponse<{ user: User }>>(`/admin/user-management/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Delete user (if endpoint exists)
export const deleteUser = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admin/user-management/${id}`)
  return response.data
}

// Get user transactions
export const getUserTransactions = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/user-management/${id}/transactions`, {
    params: {
      page,
      per_page: perPage,
    },
  })
  return response.data
}

// Get user virtual bank accounts
export const getUserVirtualBankAccounts = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/user-management/${id}/virtual-bank-accounts`, {
    params: {
      page,
      per_page: perPage,
    },
  })
  return response.data
}

// Get user linked accounts
export const getUserLinkedAccounts = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/user-management/${id}/linked-accounts`, {
    params: {
      page,
      per_page: perPage,
    },
  })
  return response.data
}

// Get user wallet
export const getUserWallet = async (id: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/user-management/${id}/wallet`)
  return response.data
}

// Get user subscription
export const getUserSubscription = async (id: string): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>(`/admin/user-management/${id}/subscription`)
  return response.data
}

