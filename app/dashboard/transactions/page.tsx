"use client"

import { useState } from "react"
import { TransactionsTable } from "@/components/transactions/transactions-table"
import { TransactionsFilters } from "@/components/transactions/transactions-filters"

export default function TransactionsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    start_date: "",
    end_date: "",
  })

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm font-medium uppercase tracking-widest opacity-70">Manage and monitor all financial movements</p>
        </div>
      </div>

      <TransactionsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <TransactionsTable
        filters={filters}
      />
    </div>
  )
}
