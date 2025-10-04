import { ReportsOverview } from "@/components/reports/reports-overview"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsFilters } from "@/components/reports/reports-filters"

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights and data analysis</p>
        </div>
      </div>

      <ReportsFilters />
      <ReportsOverview />
      <ReportsCharts />
    </div>
  )
}
