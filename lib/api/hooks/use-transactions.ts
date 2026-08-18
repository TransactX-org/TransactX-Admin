import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query"
import {
  getTransactions,
  getTransactionStatistics,
  getTransactionReports,
  getTransactionById,
  getTopUsersByVolume,
  getAllTransactionsForSearch,
  updateTransactionStatus,
} from "../services/transaction.service"
import { userKeys } from "./use-users"
import { withUpdatedStatus } from "../transaction-cache"
import type { TransactionStatus } from "@/lib/transaction-status"
import { useToast } from "@/hooks/use-toast"

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

const patchStatusInCache = (queryClient: QueryClient, id: string, status: string) => {
  const patch = (old: any) => withUpdatedStatus(old, id, status)
  queryClient.setQueriesData({ queryKey: transactionKeys.all }, patch)
  queryClient.setQueriesData({ queryKey: userKeys.all }, patch)
}

/**
 * Update a transaction's status.
 *
 * The server is the authority on the resulting status — it may store something
 * other than what was requested (marking a debit FAILED can land the record in
 * REVERSED, for instance), so the response is what gets written to the cache
 * and reported, not the requested value.
 */
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TransactionStatus }) =>
      updateTransactionStatus(id, status),
    onSuccess: (response, { id, status }) => {
      const serverStatus = (response?.data?.status || status).toUpperCase()

      // Reflect the change straight away, then reconcile in the background.
      patchStatusInCache(queryClient, id, serverStatus)
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      queryClient.invalidateQueries({ queryKey: userKeys.all })

      toast({
        title: "Status updated",
        description:
          serverStatus === status
            ? `Transaction marked as ${status}.`
            : `Requested ${status} — the server recorded this transaction as ${serverStatus}.`,
      })
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Could not update the transaction status.",
        variant: "destructive",
      })
    },
  })
}
