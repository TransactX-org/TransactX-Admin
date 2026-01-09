import { useQuery } from "@tanstack/react-query"
import {
  getTransactions,
  getTransactionStatistics,
  getTransactionReports,
  getTransactionById
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
  }
) => {
  return useQuery({
    queryKey: transactionKeys.list({ page, perPage, ...filters }),
    queryFn: () => getTransactions(page, perPage, filters),
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

