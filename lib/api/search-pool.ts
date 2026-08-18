/**
 * Shared plumbing for client-side search pools.
 *
 * Several list endpoints do not support searching by id, counterparty or
 * amount. For those, we pull a capped pool of records for the *non-search*
 * filters once (cached by React Query) and then filter and paginate that pool
 * locally, so a search matches across every page rather than only the rows
 * currently rendered.
 */

export const SEARCH_POOL_PER_PAGE = 100
export const SEARCH_POOL_MAX_PAGES = 20 // 2 000 records
const SEARCH_POOL_CONCURRENCY = 5

export interface SearchPool<T> {
  records: T[]
  /** Total records the server reports for these filters. */
  total: number
  /** True when the server has more records than the pool cap allows. */
  truncated: boolean
}

/** Run page fetches in small batches so we never open 20 sockets at once. */
export const fetchPagesInBatches = async <T>(
  pages: number[],
  fetchPage: (page: number) => Promise<T[]>
): Promise<T[]> => {
  const results: T[] = []
  for (let i = 0; i < pages.length; i += SEARCH_POOL_CONCURRENCY) {
    const batch = pages.slice(i, i + SEARCH_POOL_CONCURRENCY)
    const settled = await Promise.all(batch.map(fetchPage))
    settled.forEach((rows) => results.push(...rows))
  }
  return results
}

/** Page numbers 2..pagesToFetch (page 1 is always fetched up front). */
export const remainingPages = (pagesToFetch: number): number[] =>
  Array.from({ length: Math.max(0, pagesToFetch - 1) }, (_, i) => i + 2)
