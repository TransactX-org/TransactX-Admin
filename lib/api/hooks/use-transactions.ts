import { useQuery } from "@tanstack/react-query"
import {
  getTransactions,
  getTransactionStatistics,
  getTransactionReports,
  getTransactionById,
  getTopUsersByVolume,
  getAllTransactionsForSearch,
} from "../services/transaction.service"

// Query keys
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  statistics: (filters: Record<string, any>) => [...transactionKeys.all, "statistics", { filters }] as const,
  reports: (filters: Record<string, any>) => [...transactionKeys.all, "reports", { filters }] as const,
  topUsers: (year: number) => [...transactionKeys.all, "top-users", year] as const,
  searchPool: (filters: Record<string, any>) => [...transactionKeys.all, "search-pool", { filters }] as const,
}

// Get all transactions
export const useTransactions = (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    status?: string
    type?: string
    search?: string
    start_date?: string
    end_date?: string
  },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: transactionKeys.list({ page, perPage, ...filters }),
    queryFn: () => getTransactions(page, perPage, filters),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get transaction statistics
export const useTransactionStatistics = (year?: number, month?: number) => {
  return useQuery({
    queryKey: transactionKeys.statistics({ year, month }),
    queryFn: () => getTransactionStatistics(year, month),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get transaction reports
export const useTransactionReports = (year?: number, start_date?: string, end_date?: string) => {
  return useQuery({
    queryKey: transactionKeys.reports({ year, start_date, end_date }),
    queryFn: () => getTransactionReports(year, start_date, end_date),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get single transaction
export const useTransaction = (id: string | null) => {
  return useQuery({
    queryKey: transactionKeys.detail(id || ""),
    queryFn: () => getTransactionById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get top 10 users by transaction volume for a given year / date range
export const useTopUsersByVolume = (year: number, start_date?: string, end_date?: string) => {
  return useQuery({
    queryKey: [...transactionKeys.topUsers(year), { start_date, end_date }],
    queryFn: () => getTopUsersByVolume(year, start_date, end_date),
    staleTime: 1000 * 60 * 10,
  })
}


/**
 * Pool of transactions used to resolve searches client-side.
 *
 * Keyed on the non-search filters only, so typing in the search box filters a
 * cached pool instead of refetching. Disabled until a search is active.
 */
export const useTransactionSearchPool = (
  filters: {
    status?: string
    type?: string
    start_date?: string
    end_date?: string
  },
  enabled: boolean
) => {
  return useQuery({
    queryKey: transactionKeys.searchPool(filters),
    queryFn: () => getAllTransactionsForSearch(filters),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
