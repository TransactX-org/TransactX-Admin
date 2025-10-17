import { ReportsOverview } from "@/components/reports/reports-overview"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsFilters } from "@/components/reports/reports-filters"

export default function ReportsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-base">Comprehensive insights and data analysis</p>
        </div>
      </div>

      <ReportsFilters />
      <ReportsOverview />
      <ReportsCharts />
    </div>
  )
}
