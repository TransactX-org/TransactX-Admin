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

/**
 * Money arrives in three shapes across these endpoints: a raw number (1500), a
 * plain decimal string ("1500.00"), or a display-formatted string carrying
 * thousands separators ("121,711.05"). `Number()` yields NaN for the last of
 * those, which would blank the column, so separators are resolved first.
 */
const toAmount = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value !== "string") return null

  // Drop currency symbols and whitespace; keep digits, separators and sign.
  const cleaned = value.replace(/[^\d.,-]/g, "")
  if (cleaned === "" || cleaned === "-") return null

  const lastComma = cleaned.lastIndexOf(",")
  const lastDot = cleaned.lastIndexOf(".")

  let normalized: string
  if (lastComma !== -1 && lastDot !== -1) {
    // Both present: whichever appears last is the decimal separator.
    normalized =
      lastComma > lastDot
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "")
  } else if (lastComma !== -1) {
    // Comma alone is either thousands grouping ("1,000") or a decimal ("1,05").
    normalized = /^-?\d{1,3}(,\d{3})+$/.test(cleaned)
      ? cleaned.replace(/,/g, "")
      : cleaned.replace(",", ".")
  } else {
    normalized = cleaned
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
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

/**
 * Keys are compared with separators and case removed, so `balance_after`,
 * `balanceAfter` and `BALANCE_AFTER` all count as the same field. Endpoints in
 * this API are not consistent about casing, and a rename on one of them should
 * not silently blank the column.
 */
const normalizeKey = (key: string) => key.replace(/[^a-z0-9]/gi, "").toLowerCase()

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
  const target = normalizeKey(key)

  // A hit at this level wins over anything buried deeper.
  for (const [candidate, candidateValue] of Object.entries(record)) {
    if (normalizeKey(candidate) !== target) continue
    const direct = toAmount(candidateValue)
    if (direct !== null) return direct
  }

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
