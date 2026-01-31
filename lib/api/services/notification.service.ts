import apiClient from "../client"
import type { ApiResponse, PaginatedResponse } from "../types"

// Notification Types
export interface Notification {
  id: string
  type: string
  data: {
    title: string
    message: string
    data?: any
  }
  read_at: string | null
  created_at: string
  updated_at: string
  // Computed property for convenience in UI, though not in API raw response
  read?: boolean
}

// Get all notifications
export const getNotifications = async (
  page: number = 1,
  perPage: number = 20
): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>("/admin/notifications", {
    params: {
      page,
      per_page: perPage,
    },
  })
  return response.data
}

// Get unread notifications count
export const getUnreadNotificationsCount = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.get<ApiResponse<{ count: number }>>("/admin/notifications/unread-count")
  return response.data
}

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(`/admin/notifications/${id}/read`)
  return response.data
}

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>("/admin/notifications/mark-all-read")
  return response.data
}

// Delete notification
export const deleteNotification = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/admin/notifications/${id}`)
  return response.data
}

// Delete all notifications
export const deleteAllNotifications = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>("/admin/notifications/")
  return response.data
}
