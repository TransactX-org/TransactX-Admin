import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

export interface Newsletter {
    id: string
    title: string
    medium: "email" | "sms" | "push_notification"
    content: string
    banner_image?: string
    date?: string
    time?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateNewsletterDTO {
    title: string
    medium: string
    content: string
    banner_image?: File | string
    date?: string
    time?: string
    is_active?: boolean
}

export interface UpdateNewsletterDTO {
    title?: string
    medium?: string
    content?: string
    banner_image?: File | string
    date?: string
    time?: string
    is_active?: boolean
}

export interface SendNewsletterDTO {
    user_ids?: string[]
    send_to_all?: boolean
}

export interface NewsletterResponse {
    newsletters: Newsletter[]
    pagination: {
        total: number
        per_page: number
        current_page: number
        last_page: number
        from: number
        to: number
    }
}

// Get all newsletters
export const getNewsletters = async (
    page: number = 1,
    perPage: number = 15
): Promise<ApiResponse<NewsletterResponse>> => {
    const response = await apiClient.get<ApiResponse<NewsletterResponse>>("/admin/newsletters", {
        params: {
            page,
            per_page: perPage,
        },
    })
    return response.data
}

// Get single newsletter
export const getNewsletter = async (id: string): Promise<ApiResponse<{ newsletter: Newsletter }>> => {
    const response = await apiClient.get<ApiResponse<{ newsletter: Newsletter }>>(`/admin/newsletters/${id}`)
    return response.data
}

// Create newsletter
export const createNewsletter = async (data: CreateNewsletterDTO): Promise<ApiResponse<Newsletter>> => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'is_active') {
                formData.append(key, value ? '1' : '0')
            } else {
                formData.append(key, value as string | Blob)
            }
        }
    })

    const response = await apiClient.post<ApiResponse<Newsletter>>("/admin/newsletters", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

// Update newsletter
export const updateNewsletter = async (id: string, data: UpdateNewsletterDTO): Promise<ApiResponse<Newsletter>> => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'is_active') {
                formData.append(key, value ? '1' : '0')
            } else {
                formData.append(key, value as string | Blob)
            }
        }
    })

    // Using POST for update as often required by FormData handling in Laravel/PHP backends if PUT doesn't parse multipart
    const response = await apiClient.post<ApiResponse<Newsletter>>(`/admin/newsletters/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

// Send newsletter
export const sendNewsletter = async (id: string, data: SendNewsletterDTO): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/admin/newsletters/${id}/send`, data)
    return response.data
}

// Delete newsletter (assuming standard REST endpoint exists, though not explicitly asked, it's good practice)
export const deleteNewsletter = async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/admin/newsletters/${id}`)
    return response.data
}
