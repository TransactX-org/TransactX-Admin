import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTransactions, getTransactionStats, getTransactionById } from "../services/transaction.service"
import { useToast } from "@/hooks/use-toast"

// Query keys
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: () => [...transactionKeys.all, "stats"] as const,
}

// Get all transactions
export const useTransactions = (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    status?: string
    type?: string
    search?: string
    date_from?: string
    date_to?: string
  }
) => {
  return useQuery({
    queryKey: transactionKeys.list({ page, perPage, ...filters }),
    queryFn: () => getTransactions(page, perPage, filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get transaction stats
export const useTransactionStats = () => {
  return useQuery({
    queryKey: transactionKeys.stats(),
    queryFn: getTransactionStats,
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

