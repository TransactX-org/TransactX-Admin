import { useQuery } from "@tanstack/react-query"
import { getAirtimeNetworks, getAirtimeStats, getAirtimeTransactions, getAirtimeTransactionById } from "../services/airtime.service"

// Query keys
export const airtimeKeys = {
  all: ["airtime"] as const,
  networks: () => [...airtimeKeys.all, "networks"] as const,
  stats: () => [...airtimeKeys.all, "stats"] as const,
  transactions: () => [...airtimeKeys.all, "transactions"] as const,
  transaction: (id: string) => [...airtimeKeys.transactions(), id] as const,
  list: (filters: Record<string, any>) => [...airtimeKeys.transactions(), { filters }] as const,
}

// Get airtime networks
export const useAirtimeNetworks = () => {
  return useQuery({
    queryKey: airtimeKeys.networks(),
    queryFn: getAirtimeNetworks,
    staleTime: 1000 * 60 * 30, // 30 minutes - networks don't change often
  })
}

// Get airtime stats
export const useAirtimeStats = () => {
  return useQuery({
    queryKey: airtimeKeys.stats(),
    queryFn: getAirtimeStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get airtime transactions
export const useAirtimeTransactions = (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    search?: string
    network?: string
    status?: string
    start_date?: string
    end_date?: string
  }
) => {
  return useQuery({
    queryKey: airtimeKeys.list({ page, perPage, ...filters }),
    queryFn: () => getAirtimeTransactions(page, perPage, filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Get single airtime transaction
export const useAirtimeTransaction = (id: string | null) => {
  return useQuery({
    queryKey: airtimeKeys.transaction(id || ""),
    queryFn: () => getAirtimeTransactionById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

