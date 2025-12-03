import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notification.service"
import { useToast } from "@/hooks/use-toast"

// Query keys
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...notificationKeys.lists(), { filters }] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
}

// Get all notifications
export const useNotifications = (page: number = 1, perPage: number = 20) => {
  return useQuery({
    queryKey: notificationKeys.list({ page, perPage }),
    queryFn: () => getNotifications(page, perPage),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

// Get unread notifications count
export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationsCount,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  })
}

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark notification as read",
        variant: "destructive",
      })
    },
  })
}

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark notifications as read",
        variant: "destructive",
      })
    },
  })
}

// Mark notification as read (single)
export const useMarkSingleNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete notification",
        variant: "destructive",
      })
    },
  })
}

// Delete all notifications
export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast({
        title: "Success",
        description: "All notifications deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete notifications",
        variant: "destructive",
      })
    },
  })
}

