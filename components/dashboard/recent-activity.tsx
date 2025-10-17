import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

const activities = [
  {
    id: "TXN001",
    user: "John Doe",
    type: "Payment",
    amount: "₦5,000",
    status: "success",
    time: "2 minutes ago",
    direction: "in",
  },
  {
    id: "TXN002",
    user: "Jane Smith",
    type: "Transfer",
    amount: "₦12,500",
    status: "success",
    time: "15 minutes ago",
    direction: "out",
  },
  {
    id: "TXN003",
    user: "Mike Johnson",
    type: "Withdrawal",
    amount: "₦8,000",
    status: "pending",
    time: "1 hour ago",
    direction: "out",
  },
  {
    id: "TXN004",
    user: "Sarah Williams",
    type: "Payment",
    amount: "₦3,200",
    status: "success",
    time: "2 hours ago",
    direction: "in",
  },
  {
    id: "TXN005",
    user: "David Brown",
    type: "Transfer",
    amount: "₦15,000",
    status: "failed",
    time: "3 hours ago",
    direction: "out",
  },
]

export function RecentActivity() {
  return (
    <Card className="border border-border/50 sleek-card">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription className="text-sm">Latest transactions from your users</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-accent transition-colors sleek-transition gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="bg-tx-primary/10 h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarFallback className="tx-bg-primary text-white font-semibold text-xs sm:text-sm">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{activity.user}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {activity.type} • {activity.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="text-left sm:text-right">
                  <p className="font-medium flex items-center gap-1 text-sm sm:text-base">
                    {activity.direction === "in" ? (
                      <ArrowDownLeft className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="truncate">{activity.amount}</span>
                  </p>
                  <Badge
                    variant={
                      activity.status === "success"
                        ? "default"
                        : activity.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="mt-1 text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
