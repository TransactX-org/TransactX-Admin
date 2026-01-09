import apiClient from "../client"
import type { ApiResponse, Admin, UpdateAdminRolePayload, PaginatedResponse, AdminStats, CreateAdminPayload } from "../types"

/**
 * Get all admins with pagination
 */
export const getAdmins = async (page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<Admin>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Admin>>>("/admin/admin-management", {
        params: {
            page,
            per_page: perPage,
        },
    })
    return response.data
}

/**
 * Get admin statistics
 */
export const getAdminStats = async (): Promise<ApiResponse<AdminStats>> => {
    const response = await apiClient.get<ApiResponse<AdminStats>>("/admin/admin-management/stats")
    return response.data
}

/**
 * Create a new admin
 */
export const createAdmin = async (payload: CreateAdminPayload): Promise<ApiResponse<{ admin: Admin }>> => {
    // API expects form data
    const formData = new FormData()
    formData.append("name", `${payload.first_name} ${payload.last_name}`)
    formData.append("first_name", payload.first_name)
    formData.append("last_name", payload.last_name)
    formData.append("email", payload.email)
    if (payload.password) formData.append("password", payload.password)
    formData.append("role_id", payload.role_id)
    payload.permissions.forEach((permission, index) => {
        formData.append(`permissions[${index}]`, permission)
    })

    const response = await apiClient.post<ApiResponse<{ admin: Admin }>>("/admin/admin-management", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

/**
 * Get all admin roles
 */
export const getAdminRoles = async (): Promise<ApiResponse<AdminRole[]>> => {
    const response = await apiClient.get<ApiResponse<AdminRole[]>>("/admin/roles")
    return response.data
}

/**
 * Get details for a specific admin
 */
export const getAdmin = async (id: string): Promise<ApiResponse<{ admin: Admin }>> => {
    const response = await apiClient.get<ApiResponse<{ admin: Admin }>>(`/admin/admin-management/${id}`)
    return response.data
}

/**
 * Update an admin's role and permissions
 */
export const updateAdminRole = async (
    id: string,
    payload: UpdateAdminRolePayload
): Promise<ApiResponse<{ admin: Admin }>> => {
    // The API expects form data based on the curl example
    const formData = new FormData()
    formData.append("role_id", payload.role_id)
    payload.permissions.forEach((permission, index) => {
        formData.append(`permissions[${index}]`, permission)
    })

    const response = await apiClient.post<ApiResponse<{ admin: Admin }>>(
        `/admin/admin-management/${id}/update-role`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
    return response.data
}

/**
 * Delete an admin
 */
export const deleteAdmin = async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admin/admin-management/${id}`)
    return response.data
}
