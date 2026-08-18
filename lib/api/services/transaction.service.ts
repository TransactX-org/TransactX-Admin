import apiClient from "../client"
import {
  SEARCH_POOL_MAX_PAGES,
  SEARCH_POOL_PER_PAGE,
  fetchPagesInBatches,
  remainingPages,
  type SearchPool,
} from "../search-pool"
import type {
  ApiResponse,
  PaginatedResponse,
  TransactionSummary,
  TransactionDetail,
  TransactionStatistics,
  TransactionReports,
  TopUserVolume,
} from "../types"

// Get all transactions
export const getTransactions = async (
  page: number = 1,
  perPage: number = 15,
  filters?: {
    status?: string
    type?: string
    search?: string
    start_date?: string
    end_date?: string
  }
): Promise<ApiResponse<PaginatedResponse<TransactionSummary>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<TransactionSummary>>>("/admin/transactions", {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
  })
  return response.data
}

// Get single transaction
export const getTransactionById = async (id: string): Promise<ApiResponse<TransactionDetail>> => {
  const response = await apiClient.get<ApiResponse<TransactionDetail>>(`/admin/transactions/${id}`)
  return response.data
}

// Get transaction statistics
export const getTransactionStatistics = async (
  year?: number,
  month?: number
): Promise<ApiResponse<TransactionStatistics>> => {
  const response = await apiClient.get<ApiResponse<TransactionStatistics>>("/admin/transactions/statistics", {
    params: { year, month, exclude_type: "money_request" }
  })
  return response.data
}

// Get transaction reports
export const getTransactionReports = async (
  year?: number,
  start_date?: string,
  end_date?: string
): Promise<ApiResponse<TransactionReports>> => {
  const response = await apiClient.get<ApiResponse<TransactionReports>>("/admin/transactions/reports", {
    params: { year, start_date, end_date, exclude_type: "money_request" }
  })
  return response.data
}

const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const isMoneyRequest = (type?: string) =>
  !!type && type.toLowerCase().includes("request")

export const getTopUsersByVolume = async (
  year: number,
  start_date?: string,
  end_date?: string,
): Promise<TopUserVolume[]> => {
  const PER_PAGE = 100
  const params = {
    per_page: PER_PAGE,
    start_date: start_date || `${year}-01-01`,
    end_date: end_date || `${year}-12-31`,
  }

  // Cheap metadata call to find total page count
  const meta = await apiClient.get<ApiResponse<PaginatedResponse<TransactionSummary>>>("/admin/transactions", {
    params: { ...params, per_page: 1, page: 1 },
  })
  const total = meta.data.data?.total ?? 0
  const lastPage = Math.min(Math.ceil(total / PER_PAGE), 50) // cap at 50 pages = 5 000 records

  // Fetch all pages in parallel
  const pages = await Promise.all(
    Array.from({ length: lastPage }, (_, i) =>
      apiClient.get<ApiResponse<PaginatedResponse<TransactionSummary>>>("/admin/transactions", {
        params: { ...params, page: i + 1 },
      })
    )
  )

  const allTransactions: TransactionSummary[] = pages
    .flatMap(r => r.data.data?.data ?? [])
    .filter(tx => !isMoneyRequest(tx.type))

  const map: Record<string, TopUserVolume> = {}
  for (const tx of allTransactions) {
    const key = tx.user || "Unknown"
    const monthIndex = new Date(tx.date).getMonth()
    const month = MONTH_ORDER[monthIndex] ?? "Unknown"
    const amount = tx.amount ?? 0

    if (!map[key]) map[key] = { user: key, total: 0, monthly: {} }
    map[key].total += amount
    map[key].monthly[month] = (map[key].monthly[month] ?? 0) + amount
  }

  return Object.values(map)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
}

// ---------------------------------------------------------------------------
// Client-side search pool
//
// The list endpoint's `search` param does not cover the transaction id, the
// sender/receiver or the amount, so those searches are resolved client-side
// against a capped pool of records fetched for the non-search filters.
// ---------------------------------------------------------------------------

export const getAllTransactionsForSearch = async (
  filters?: {
    status?: string
    type?: string
    start_date?: string
    end_date?: string
  },
  maxPages: number = SEARCH_POOL_MAX_PAGES
): Promise<SearchPool<TransactionSummary>> => {
  const first = await getTransactions(1, SEARCH_POOL_PER_PAGE, filters)
  const firstPage = first.data

  const lastPage = firstPage?.last_page ?? 1
  const total = firstPage?.total ?? firstPage?.data?.length ?? 0
  const pagesToFetch = Math.min(lastPage, maxPages)

  const rest = await fetchPagesInBatches(remainingPages(pagesToFetch), async (page) => {
    const response = await getTransactions(page, SEARCH_POOL_PER_PAGE, filters)
    return response.data?.data ?? []
  })

  return {
    records: [...(firstPage?.data ?? []), ...rest],
    total,
    truncated: lastPage > pagesToFetch,
  }
}
