/**
 * The wallet balance a transaction left behind.
 *
 * The backend writes `balance_before` and `balance_after` as a transaction
 * completes, so only settled records carry them — a pending or failed
 * transaction legitimately has neither, and callers render a placeholder
 * rather than inventing a figure.
 *
 * Where in the response they sit varies: at the top of the record on some
 * endpoints, inside the payload on others, and nested further down where the
 * payload wraps a provider response. Rather than encode one path per endpoint,
 * the record is searched for the field by name.
 */

/** How far to descend before giving up. Real payloads nest two, maybe three deep. */
const MAX_DEPTH = 4

/** Money arrives as a number or as a decimal string ("1500.00"); both count. */
const toAmount = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/**
 * JSON columns arrive decoded on endpoints that cast them and as a raw string
 * on those that do not, so a string that holds an object is descended into too.
 */
const asContainer = (value: unknown): object | null => {
  if (value && typeof value === "object") return value
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null
    try {
      const parsed = JSON.parse(trimmed)
      return parsed && typeof parsed === "object" ? parsed : null
    } catch {
      return null
    }
  }
  return null
}

/** First numeric value stored under `key`, breadth-first-ish, bounded by depth. */
const findByKey = (value: unknown, key: string, depth: number): number | null => {
  const container = asContainer(value)
  if (!container || depth > MAX_DEPTH) return null

  if (Array.isArray(container)) {
    for (const item of container) {
      const found = findByKey(item, key, depth + 1)
      if (found !== null) return found
    }
    return null
  }

  const record = container as Record<string, unknown>

  // A hit at this level wins over anything buried deeper.
  const direct = toAmount(record[key])
  if (direct !== null) return direct

  for (const nested of Object.values(record)) {
    const found = findByKey(nested, key, depth + 1)
    if (found !== null) return found
  }
  return null
}

/** Balance once the transaction settled, or null if the record carries none. */
export const getBalanceAfter = (transaction: unknown): number | null =>
  findByKey(transaction, "balance_after", 0)

/** Balance as it stood before the transaction, or null if the record carries none. */
export const getBalanceBefore = (transaction: unknown): number | null =>
  findByKey(transaction, "balance_before", 0)
