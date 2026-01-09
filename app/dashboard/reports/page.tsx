"use client"

import { useState } from "react"
import { ReportsOverview } from "@/components/reports/reports-overview"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { useTransactionStatistics, useTransactionReports } from "@/lib/api/hooks/use-transactions"

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    start_date: "",
    end_date: "",
  })

  const { data: statsData, isLoading: isLoadingStats } = useTransactionStatistics(filters.year, filters.month)
  const { data: reportsData, isLoading: isLoadingReports } = useTransactionReports(
    filters.year,
    filters.start_date || undefined,
    filters.end_date || undefined
  )

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1 text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-70">Comprehensive insights and data analysis</p>
        </div>
      </div>

      <ReportsFilters filters={filters} onFilterChange={handleFilterChange} />

      <ReportsOverview
        data={reportsData?.data?.summary}
        isLoading={isLoadingReports}
      />

      <ReportsCharts
        data={reportsData?.data?.charts}
        isLoading={isLoadingReports}
      />
    </div>
  )
}
