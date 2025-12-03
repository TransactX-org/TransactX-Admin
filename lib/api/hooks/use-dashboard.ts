import { useQuery } from "@tanstack/react-query"
import { getDashboardStats, getRevenueData, getTransactionVolumeData, getRecentActivity } from "../services/dashboard.service"

// Query keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenue: () => [...dashboardKeys.all, "revenue"] as const,
  transactionVolume: () => [...dashboardKeys.all, "transaction-volume"] as const,
  recentActivity: () => [...dashboardKeys.all, "recent-activity"] as const,
}

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get revenue data
export const useRevenueData = () => {
  return useQuery({
    queryKey: dashboardKeys.revenue(),
    queryFn: getRevenueData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get transaction volume data
export const useTransactionVolumeData = () => {
  return useQuery({
    queryKey: dashboardKeys.transactionVolume(),
    queryFn: getTransactionVolumeData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get recent activity
export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: [...dashboardKeys.recentActivity(), limit],
    queryFn: () => getRecentActivity(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

