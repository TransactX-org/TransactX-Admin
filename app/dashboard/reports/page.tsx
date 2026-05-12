"use client"

import { useState } from "react"
import { ReportsOverview } from "@/components/reports/reports-overview"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { useTransactionStatistics, useTransactionReports, useTopUsersByVolume } from "@/lib/api/hooks/use-transactions"
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
    filters.end_date || undefined,
  )
  const { data: topUsersData, isLoading: topUsersLoading, refetch: refetchTopUsers } = useTopUsersByVolume(
    filters.year,
    filters.start_date || undefined,
    filters.end_date || undefined,
  )

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleRefresh = () => {
    refetchStats()
    refetchReports()
    refetchTopUsers()
    toast({ title: "Refreshed", description: "All report data refreshed" })
  }

  const handleExport = () => {
    const revenueOverview = reportsData?.data?.charts?.revenue_overview ?? []
    if (revenueOverview.length === 0) {
      toast({ title: "No data", description: "No chart data available to export", variant: "destructive" })
      return
    }

    const exportData = revenueOverview.map(item => {
      const vol = (reportsData?.data?.charts?.transaction_volume ?? []).find(v => v.month === item.month)
      const growth = (reportsData?.data?.charts?.user_growth ?? []).find(u => u.month === item.month)
      const topUser = topUsersData?.[0]
      return {
        Month: item.month,
        Revenue: item.revenue,
        "Transaction Volume": vol?.total ?? 0,
        "New Users": growth?.count ?? 0,
        "Top User": topUser?.user ?? "",
        "Top User Volume": topUser?.monthly[item.month] ?? 0,
      }
    })

    exportToCSV(exportData, `reports-${filters.year}`)
    toast({ title: "Exported", description: "Report exported successfully" })
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6 max-w-full overflow-x-hidden">

      <div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1 text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-60">
          {filters.year} · {filters.start_date && filters.end_date ? `${filters.start_date} – ${filters.end_date}` : "Full year"}
        </p>
      </div>

      <ReportsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <ReportsOverview
        data={statsData?.data?.summary}
        isLoading={isLoadingStats}
        month={filters.month}
        year={filters.year}
      />

      <ReportsCharts
        data={reportsData?.data?.charts}
        statsCharts={statsData?.data?.charts}
        topUsers={topUsersData ?? undefined}
        topUsersLoading={topUsersLoading}
        isLoading={isLoadingReports}
      />

    </div>
  )
}
