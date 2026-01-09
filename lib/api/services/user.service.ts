import apiClient from "../client"
import type {
    ApiResponse,
    PaginatedResponse,
    User,
    UserStats,
    CreateUserPayload,
    CreateUserResponse,
    Beneficiary,
    LinkedBankAccount,
    UserSubscription,
    UserTransaction,
    VirtualBankAccount,
    Wallet,
} from "../types"

// Get all users with pagination and filters
export const getUsers = async (
    page: number = 1,
    perPage: number = 15,
    filters?: {
        search?: string
        status?: string
        kyc_status?: string
        kyb_status?: string
        user_type?: string
        account_type?: string
        is_active?: string | number | boolean
        country?: string
        email_verified?: string | number | boolean
        start_date?: string
        end_date?: string
    }
): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>("/admin/user-management", {
        params: {
            page,
            per_page: perPage,
            ...filters,
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
export const getUserTransactions = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<UserTransaction>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<UserTransaction>>>(`/admin/user-management/${id}/transactions`, {
        params: {
            page,
            per_page: perPage,
        },
    })
    return response.data
}

// Get user virtual bank accounts
export const getUserVirtualBankAccounts = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<VirtualBankAccount>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<VirtualBankAccount>>>(`/admin/user-management/${id}/virtual-bank-accounts`, {
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
export const getUserWallet = async (id: string): Promise<ApiResponse<{ wallet: Wallet }>> => {
    const response = await apiClient.get<ApiResponse<{ wallet: Wallet }>>(`/admin/user-management/${id}/wallets`)
    return response.data
}

// Get user subscriptions
export const getUserSubscriptions = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<UserSubscription>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<UserSubscription>>>(`/admin/user-management/${id}/subscriptions`, {
        params: {
            page,
            per_page: perPage,
        },
    })
    return response.data
}

// Get user beneficiaries
export const getUserBeneficiaries = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<Beneficiary>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Beneficiary>>>(`/admin/user-management/${id}/beneficiaries`, {
        params: {
            page,
            per_page: perPage,
        },
    })
    return response.data
}

// Get user linked bank accounts
export const getUserLinkedBankAccounts = async (id: string, page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<LinkedBankAccount>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<LinkedBankAccount>>>(`/admin/user-management/${id}/linked-bank-accounts`, {
        params: {
            page,
            per_page: perPage,
        },
    })
    return response.data
}

// Suspend user
export const suspendUser = async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/admin/user-management/${id}/suspend`)
    return response.data
}

// Activate user
export const activateUser = async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/admin/user-management/${id}/activate`)
    return response.data
}
