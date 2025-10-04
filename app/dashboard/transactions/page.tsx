import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionsFilters } from "@/components/transactions/transactions-filters"

export default function TransactionsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all transactions</p>
        </div>
      </div>

      <TransactionsFilters />
      <TransactionsTable />
    </div>
  )
}
