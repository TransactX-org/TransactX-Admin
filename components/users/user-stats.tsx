"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useUserStats } from "@/lib/api/hooks/use-users"
import { Users, UserCheck, UserX, Wallet, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserStats() {
  const { data, isLoading, error, refetch } = useUserStats()
  const stats = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/10 backdrop-blur-sm rounded-3xl h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4">
        <div className="flex items-center gap-3 text-destructive/80">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-[11px] font-bold uppercase tracking-widest">Failed to load user statistics</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 gap-2 text-[10px] font-bold uppercase tracking-widest">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    )
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
      value: stats.nin_verified_users,
      icon: UserCheck,
      description: "NIN Verified",
    },
    {
      title: "Verified BVN",
      value: stats.bvn_verified_users,
      icon: UserCheck,
      description: "BVN Verified",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
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

