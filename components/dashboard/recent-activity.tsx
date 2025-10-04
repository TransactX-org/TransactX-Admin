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
    <Card className="border-2 sleek-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions from your users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors sleek-transition"
            >
              <div className="flex items-center gap-4">
                <Avatar className="bg-tx-primary/10">
                  <AvatarFallback className="tx-bg-primary text-white font-semibold">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.type} • {activity.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium flex items-center gap-1">
                    {activity.direction === "in" ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                    {activity.amount}
                  </p>
                  <Badge
                    variant={
                      activity.status === "success"
                        ? "default"
                        : activity.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="mt-1"
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
