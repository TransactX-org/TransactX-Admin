"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStats } from "@/lib/api/hooks/use-users"
import { Users, UserCheck, UserX, Wallet, Loader2 } from "lucide-react"

export function UserStats() {
  const { data, isLoading, error } = useUserStats()
  const stats = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="border-border/40 bg-card/10 backdrop-blur-sm rounded-3xl h-32 animate-pulse" />
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
    {
      title: "Verified NIN",
      value: 0, // TODO: Connect to real API aggregation
      icon: UserCheck,
      description: "NIN Verified",
    },
    {
      title: "Verified BVN",
      value: 0, // TODO: Connect to real API aggregation
      icon: UserCheck,
      description: "BVN Verified",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl group hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tighter">{stat.value.toLocaleString()}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mt-1 line-clamp-1">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

