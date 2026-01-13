"use client"

import { useState } from "react"
import { ReportsOverview } from "@/components/reports/reports-overview"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { useTransactionStatistics, useTransactionReports } from "@/lib/api/hooks/use-transactions"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    start_date: "",
    end_date: "",
  })
  const { toast } = useToast()

  const { data: statsData, isLoading: isLoadingStats, refetch: refetchStats } = useTransactionStatistics(filters.year, filters.month)
  const { data: reportsData, isLoading: isLoadingReports, refetch: refetchReports } = useTransactionReports(
    filters.year,
    filters.start_date || undefined,
    filters.end_date || undefined
  )

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleRefresh = () => {
    refetchStats()
    refetchReports()
    toast({ title: "Refreshed", description: "Reports data refreshed" })
  }

  const handleExport = () => {
    if (!reportsData?.data) {
      toast({ title: "No data", description: "No data to export", variant: "destructive" })
      return
    }

    // Flatten data for export - primarily revenue overview as it's time-series
    const exportData = reportsData.data.charts.revenue_overview.map((item, index) => ({
      Month: item.month,
      Revenue: item.revenue,
      "Transaction Volume": reportsData.data.charts.transaction_volume[index]?.total || 0,
      "New Users": reportsData.data.charts.user_growth[index]?.count || 0
    }))

    exportToCSV(exportData, `reports-${filters.year}`)
    toast({ title: "Exported", description: "Reports exported successfully" })
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1 text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-70">Comprehensive insights and data analysis</p>
        </div>
      </div>

      <ReportsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

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
