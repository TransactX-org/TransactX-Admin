"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStats } from "@/lib/api/hooks/use-users"
import { Users, UserCheck, UserX, Wallet, Loader2 } from "lucide-react"

export function UserStats() {
  const { data, isLoading, error } = useUserStats()
  const stats = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: stats.active_users,
      icon: UserCheck,
      description: "Currently active",
    },
    {
      title: "Suspended Users",
      value: stats.suspended_users,
      icon: UserX,
      description: "Suspended accounts",
    },
    {
      title: "Users with Wallet",
      value: stats.users_with_wallet,
      icon: Wallet,
      description: "Have active wallets",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border border-border/50 hover:border-border hover:shadow-lg transition-all">
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

