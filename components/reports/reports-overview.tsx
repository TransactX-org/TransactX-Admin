import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, Clock, Loader2 } from "lucide-react"
import { TransactionStatistics } from "@/lib/api/types"
import { format } from "date-fns"

interface ReportsOverviewProps {
  data?: TransactionStatistics["summary"]
  isLoading: boolean
  month: number
  year: number
}

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount ?? 0)

export function ReportsOverview({ data, isLoading, month, year }: ReportsOverviewProps) {
  const periodLabel = format(new Date(year, month - 1), "MMMM yyyy")

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(data?.total_revenue),
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Successful Transactions",
      value: data?.successful_transactions?.toLocaleString() ?? "0",
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Users",
      value: data?.active_users?.toLocaleString() ?? "0",
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Pending Transactions",
      value: data?.pending_transactions?.toLocaleString() ?? "0",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-1">
        KPI snapshot · {periodLabel}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl hover:border-primary/20 transition-all duration-300 overflow-hidden shadow-none">
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col gap-2 sm:gap-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 sm:p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    {isLoading && <Loader2 className="h-3 w-3 animate-spin opacity-20" />}
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter truncate">
                      {isLoading ? <span className="inline-block h-8 w-24 rounded-lg bg-muted/40 animate-pulse" /> : stat.value}
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1 truncate">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
