import { useQuery } from "@tanstack/react-query"
import { useTransactionStatistics, useTransactions } from "./use-transactions"
import { useMemo } from "react"
import { DashboardStats, RevenueData, TransactionVolumeData } from "../services/dashboard.service"

// Query keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenue: () => [...dashboardKeys.all, "revenue"] as const,
  transactionVolume: () => [...dashboardKeys.all, "transaction-volume"] as const,
  recentActivity: () => [...dashboardKeys.all, "recent-activity"] as const,
}

// Get dashboard stats
// Get dashboard stats
export const useDashboardStats = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const { data: transactionStats, isLoading } = useTransactionStatistics(currentYear, currentMonth)

  const stats = useMemo(() => {
    if (!transactionStats?.data) return undefined

    return {
      total_revenue: transactionStats.data.summary.total_revenue,
      total_transactions: transactionStats.data.summary.successful_transactions,
      active_users: transactionStats.data.summary.active_users,
      pending_approvals: transactionStats.data.summary.pending_transactions,
      revenue_change: 0,
      transactions_change: 0,
      users_change: 0,
      approvals_change: 0
    } as DashboardStats
  }, [transactionStats])

  return {
    data: stats ? { success: true, message: "Success", data: stats } : undefined,
    isLoading
  }
}

// Get revenue data
export const useRevenueData = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const { data: transactionStats, isLoading } = useTransactionStatistics(currentYear, currentMonth)

  const revenueData = useMemo(() => {
    if (!transactionStats?.data?.charts?.revenue_overview) return undefined

    return transactionStats.data.charts.revenue_overview.map(item => ({
      name: item.month,
      revenue: item.revenue
    })) as RevenueData[]
  }, [transactionStats])

  return {
    data: revenueData ? { success: true, message: "Success", data: revenueData } : undefined,
    isLoading
  }
}

// Get transaction volume data
export const useTransactionVolumeData = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const { data: transactionStats, isLoading } = useTransactionStatistics(currentYear, currentMonth)

  const volumeData = useMemo(() => {
    if (!transactionStats?.data?.charts?.transaction_volume) return undefined

    return transactionStats.data.charts.transaction_volume.map(item => ({
      name: `Day ${item.day}`,
      transactions: item.total
    })) as TransactionVolumeData[]
  }, [transactionStats])

  return {
    data: volumeData ? { success: true, message: "Success", data: volumeData } : undefined,
    isLoading
  }
}

// Get recent activity
export const useRecentActivity = (limit: number = 5) => {
  // We reuse the transactions list endpoint
  return useTransactions(1, limit)
}
