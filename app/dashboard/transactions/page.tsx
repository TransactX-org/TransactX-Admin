import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionsFilters } from "@/components/transactions/transactions-filters"

export default function TransactionsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-base">Manage and monitor all transactions</p>
        </div>
      </div>

      <TransactionsFilters />
      <TransactionsTable />
    </div>
  )
}
