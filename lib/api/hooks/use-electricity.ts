import { useQuery } from "@tanstack/react-query"
import { getElectricityStats, getElectricityTransactions, getElectricityTransactionById } from "../services/electricity.service"

// Query keys
export const electricityKeys = {
  all: ["electricity"] as const,
  stats: () => [...electricityKeys.all, "stats"] as const,
  transactions: () => [...electricityKeys.all, "transactions"] as const,
  transaction: (id: string) => [...electricityKeys.transactions(), id] as const,
  list: (filters: Record<string, any>) => [...electricityKeys.transactions(), { filters }] as const,
}

// Get electricity stats
export const useElectricityStats = () => {
  return useQuery({
    queryKey: electricityKeys.stats(),
    queryFn: getElectricityStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get electricity transactions
export const useElectricityTransactions = (
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
    queryKey: electricityKeys.list({ page, perPage, ...filters }),
    queryFn: () => getElectricityTransactions(page, perPage, filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get single electricity transaction
export const useElectricityTransaction = (id: string | null) => {
  return useQuery({
    queryKey: electricityKeys.transaction(id || ""),
    queryFn: () => getElectricityTransactionById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

