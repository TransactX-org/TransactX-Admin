import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, CreditCard, Activity, Loader2 } from "lucide-react"
import { TransactionReports } from "@/lib/api/types"

interface ReportsOverviewProps {
  data?: TransactionReports["summary"]
  isLoading: boolean
}

export function ReportsOverview({ data, isLoading }: ReportsOverviewProps) {
  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(data?.total_revenue),
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Success Transactions",
      value: data?.successful_transactions?.toLocaleString() || "0",
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Users",
      value: data?.active_users?.toLocaleString() || "0",
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Success Rate",
      value: `${data?.success_rate || 0}%`,
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl group hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-none">
            <CardContent className="p-3 sm:p-6 text-left">
              <div className="flex flex-col gap-2 sm:gap-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 sm:p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  {isLoading && (
                    <Loader2 className="h-3 w-3 animate-spin opacity-20" />
                  )}
                </div>
                <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter truncate">
                    {isLoading ? "---" : stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mt-1 truncate">
                    {stat.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
