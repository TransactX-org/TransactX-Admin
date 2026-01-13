"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Receipt, Users, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStats } from "@/lib/api/hooks/use-dashboard"

export function StatsCards() {
  const { data, isLoading } = useDashboardStats()
  const stats = data?.data

  const statsConfig = [
    {
      label: "Total Revenue",
      value: stats ? `₦${stats.total_revenue?.toLocaleString() || "0"}` : "₦0",
      change: stats?.revenue_change ? `${stats.revenue_change > 0 ? "+" : ""}${stats.revenue_change.toFixed(1)}%` : "+0%",
      trend: stats?.revenue_change && stats.revenue_change > 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      label: "Total Transactions",
      value: stats?.total_transactions?.toLocaleString() || "0",
      change: stats?.transactions_change ? `${stats.transactions_change > 0 ? "+" : ""}${stats.transactions_change.toFixed(1)}%` : "+0%",
      trend: stats?.transactions_change && stats.transactions_change > 0 ? "up" : "down",
      icon: Receipt,
    },
    {
      label: "Active Users",
      value: stats?.active_users?.toLocaleString() || "0",
      change: stats?.users_change ? `${stats.users_change > 0 ? "+" : ""}${stats.users_change.toFixed(1)}%` : "+0%",
      trend: stats?.users_change && stats.users_change > 0 ? "up" : "down",
      icon: Users,
    },
    {
      label: "Pending Transactions",
      value: stats?.pending_approvals?.toLocaleString() || "0",
      change: stats?.approvals_change ? `${stats.approvals_change > 0 ? "+" : ""}${stats.approvals_change.toFixed(1)}%` : "-0%",
      trend: stats?.approvals_change && stats.approvals_change < 0 ? "up" : "down",
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.trend === "up"

        return (
          <Card
            key={index}
            className="border border-border/50 hover:border-border hover:shadow-lg transition-all hover-lift animate-fade-in sleek-card sleek-transition"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600",
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs sm:text-sm font-medium",
                      isPositive ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {isPositive ? <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
