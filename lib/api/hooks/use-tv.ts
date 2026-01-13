import { useQuery } from "@tanstack/react-query"
import { getTVProviders, getTVStats, getTVTransactions, getTVTransaction } from "../services/tv.service"

// Query keys
export const tvKeys = {
  all: ["tv"] as const,
  providers: () => [...tvKeys.all, "providers"] as const,
  stats: () => [...tvKeys.all, "stats"] as const,
  transactions: () => [...tvKeys.all, "transactions"] as const,
  list: (filters: Record<string, any>) => [...tvKeys.transactions(), { filters }] as const,
  transaction: (id: string) => [...tvKeys.all, "transaction", id] as const,
}

// Get TV providers
export const useTVProviders = () => {
  return useQuery({
    queryKey: tvKeys.providers(),
    queryFn: getTVProviders,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Get TV stats
export const useTVStats = () => {
  return useQuery({
    queryKey: tvKeys.stats(),
    queryFn: getTVStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get TV transactions
export const useTVTransactions = (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string
    provider?: string
    status?: string
    start_date?: string
    end_date?: string
  }
) => {
  return useQuery({
    queryKey: tvKeys.list({ page, perPage, ...filters }),
    queryFn: () => getTVTransactions(page, perPage, filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get single TV transaction
export const useTVTransaction = (id: string | null) => {
  return useQuery({
    queryKey: tvKeys.transaction(id || ""),
    queryFn: () => getTVTransaction(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

