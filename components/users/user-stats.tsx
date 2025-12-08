"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStats } from "@/lib/api/hooks/use-users"
import { Users, UserCheck, UserX, Wallet, Loader2 } from "lucide-react"

export function UserStats() {
  const { data, isLoading, error } = useUserStats()
  const stats = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="border border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
      description: "All registered",
    },
    {
      title: "Active Users",
      value: stats.active_users,
      icon: UserCheck,
      description: "Currently active",
    },
    {
      title: "Suspended",
      value: stats.suspended_users,
      icon: UserX,
      description: "Suspended accounts",
    },
    {
      title: "Verified",
      value: stats.verified_users,
      icon: UserCheck,
      description: "Email verified",
    },
    {
      title: "KYC Verified",
      value: stats.kyc_verified_users,
      icon: UserCheck,
      description: "KYC completed",
    },
    {
      title: "With Wallet",
      value: stats.users_with_wallet,
      icon: Wallet,
      description: "Have wallets",
    },
    {
      title: "Today",
      value: stats.users_created_today,
      icon: Users,
      description: "Created today",
    },
    {
      title: "This Month",
      value: stats.users_created_this_month,
      icon: Users,
      description: "Created this month",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border border-border/50 hover:border-border hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

