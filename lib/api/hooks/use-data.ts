import { useQuery } from "@tanstack/react-query"
import { getDataProviders, getDataStats, getDataTransactions, getDataTransactionById } from "../services/data.service"

// Query keys
export const dataKeys = {
  all: ["data"] as const,
  providers: () => [...dataKeys.all, "providers"] as const,
  stats: () => [...dataKeys.all, "stats"] as const,
  transactions: () => [...dataKeys.all, "transactions"] as const,
  transaction: (id: string) => [...dataKeys.transactions(), id] as const,
  list: (filters: Record<string, any>) => [...dataKeys.transactions(), { filters }] as const,
}

// Get data providers
export const useDataProviders = () => {
  return useQuery({
    queryKey: dataKeys.providers(),
    queryFn: getDataProviders,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Get data stats
export const useDataStats = () => {
  return useQuery({
    queryKey: dataKeys.stats(),
    queryFn: getDataStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get data transactions
export const useDataTransactions = (page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: dataKeys.list({ page, perPage }),
    queryFn: () => getDataTransactions(page, perPage),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get single data transaction
export const useDataTransaction = (id: string | null) => {
  return useQuery({
    queryKey: dataKeys.transaction(id || ""),
    queryFn: () => getDataTransactionById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

