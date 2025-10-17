"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Receipt, Users, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Total Revenue",
    value: "₦2,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Total Transactions",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Receipt,
  },
  {
    label: "Active Users",
    value: "892",
    change: "+23.1%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Pending Approvals",
    value: "12",
    change: "-4.3%",
    trend: "down",
    icon: Clock,
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isPositive = stat.trend === "up"

        return (
          <Card
            key={index}
            className="border-2 hover:shadow-lg transition-all hover-lift animate-fade-in sleek-card sleek-transition"
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
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs sm:text-sm font-medium",
                    isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {isPositive ? <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
