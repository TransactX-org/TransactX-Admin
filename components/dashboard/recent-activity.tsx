"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react"
import { useRecentActivity } from "@/lib/api/hooks/use-dashboard"
import { formatDistanceToNow } from "date-fns"

export function RecentActivity() {
  const { data, isLoading, error } = useRecentActivity(5)
  const activities = data?.data || []
  return (
    <Card className="border border-border/50 sleek-card">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription className="text-sm">Latest transactions from your users</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Failed to load recent activity</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {activities.map((activity) => {
              const timeAgo = formatDistanceToNow(new Date(activity.date), { addSuffix: true })
              const userInitials = activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-accent transition-colors sleek-transition gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="bg-tx-primary/10 h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarFallback className="tx-bg-primary text-white font-semibold text-xs sm:text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{activity.user}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {activity.type} • {timeAgo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div className="text-left sm:text-right">
                      <p className="font-medium flex items-center gap-1 text-sm sm:text-base">
                        <span className="truncate">{activity.amount}</span>
                      </p>
                      <Badge
                        variant={
                          activity.status === "success" || activity.status === "SUCCESSFUL"
                            ? "default"
                            : activity.status === "pending" || activity.status === "PENDING"
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
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
