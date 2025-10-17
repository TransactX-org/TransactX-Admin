import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Activity } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "₦2,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Transactions",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Active Users",
    value: "856",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Success Rate",
    value: "98.5%",
    change: "-0.5%",
    trend: "down",
    icon: Activity,
  },
]

export function ReportsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-2">
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
