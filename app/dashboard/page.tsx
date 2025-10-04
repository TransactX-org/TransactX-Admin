import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TransactionVolumeChart } from "@/components/dashboard/transaction-volume-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor transactions and manage your platform - {currentDate}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TransactionVolumeChart />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
