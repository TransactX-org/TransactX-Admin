/** The statuses a transaction can hold, and that an admin may set it to. */
export const TRANSACTION_STATUSES = [
  "SUCCESSFUL",
  "FAILED",
  "PENDING",
  "PROCESSING",
  "REVERSED",
] as const

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]

/** Human-facing form of a status constant, e.g. "SEND_MONEY" -> "SEND MONEY". */
export const formatStatusLabel = (status: string) => status.replace(/_/g, " ")
