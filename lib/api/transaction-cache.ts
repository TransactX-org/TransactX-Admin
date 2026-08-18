/**
 * Rewrite a transaction's status wherever it already sits in the React Query
 * cache.
 *
 * Invalidation alone is not enough: it refetches in the background while the
 * dialog is already closing, so the row keeps showing the old status until the
 * response lands. Patching first makes the change visible immediately, and the
 * invalidation that follows reconciles anything missed.
 *
 * Handles the three cached shapes a transaction can appear in and returns the
 * original object untouched when there is no match, so unrelated queries do
 * not re-render.
 */
export const withUpdatedStatus = (cached: any, id: string, status: string): any => {
  if (!cached || typeof cached !== "object") return cached

  // The transactions list keys on `transactionId`; user history keys on
  // `reference`. Both denote the same record.
  const isTarget = (row: any) =>
    !!row && (row.transactionId === id || row.reference === id)

  // SearchPool<T>: { records: [...] }
  if (Array.isArray(cached.records)) {
    if (!cached.records.some(isTarget)) return cached
    return {
      ...cached,
      records: cached.records.map((row: any) => (isTarget(row) ? { ...row, status } : row)),
    }
  }

  const inner = cached.data

  // ApiResponse<PaginatedResponse<T>>: { data: { data: [...] } }
  if (inner && Array.isArray(inner.data)) {
    if (!inner.data.some(isTarget)) return cached
    return {
      ...cached,
      data: {
        ...inner,
        data: inner.data.map((row: any) => (isTarget(row) ? { ...row, status } : row)),
      },
    }
  }

  // ApiResponse<TransactionDetail>: { data: { reference, status, ... } }
  if (isTarget(inner)) {
    return { ...cached, data: { ...inner, status } }
  }

  return cached
}
