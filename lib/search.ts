/**
 * Shared client-side search helpers.
 *
 * The `/admin/transactions` and `/admin/user-management/{id}/transactions`
 * endpoints do not reliably search by transaction id, counterparty or amount,
 * so those searches are resolved client-side against a cached record pool
 * (see `getAllTransactionsForSearch` / `getAllUserTransactionsForSearch`).
 */

/** Strip a query down to the digits/decimal point an amount search cares about. */
const amountDigits = (query: string) => query.replace(/[^\d.]/g, "")

/** Whether a numeric amount matches a query typed as "5000", "5,000" or "5000.00". */
export function matchesAmount(amount: number | string | null | undefined, query: string): boolean {
  if (amount === null || amount === undefined || amount === "") return false

  const digits = amountDigits(query)
  if (!digits) return false

  const value = Number(amount)
  if (Number.isNaN(value)) return false

  const candidates = [
    String(amount),
    String(value),
    value.toFixed(2),
    value.toLocaleString("en-US"),
    value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  ]

  return candidates.some((candidate) => candidate.replace(/,/g, "").includes(digits))
}

/** Whether any of the given text values contains the query (case-insensitive). */
export function matchesText(values: Array<string | number | null | undefined>, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return false

  return values.some((value) => {
    if (value === null || value === undefined || value === "") return false
    return String(value).toLowerCase().includes(q)
  })
}

export interface SearchableRecord {
  /** Free-text fields: ids, references, names, descriptions, type, status. */
  text?: Array<string | number | null | undefined>
  /** Numeric fields matched with digit-aware comparison. */
  amounts?: Array<number | string | null | undefined>
}

/** Whether a record matches a search query across its text and amount fields. */
export function matchesSearch(query: string, record: SearchableRecord): boolean {
  const q = query.trim()
  if (!q) return true

  if (record.text && matchesText(record.text, q)) return true
  if (record.amounts && record.amounts.some((amount) => matchesAmount(amount, q))) return true

  return false
}
