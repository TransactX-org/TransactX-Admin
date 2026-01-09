"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AdminStats as AdminStatsType } from "@/lib/api/types"
import { Users, Shield, UserCheck, ShieldAlert, Loader2 } from "lucide-react"

interface AdminStatsProps {
    stats?: AdminStatsType
    isLoading: boolean
}

export function AdminStats({ stats, isLoading }: AdminStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden animate-pulse">
                        <CardContent className="p-6 h-24 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const items = [
        {
            label: "Total Admins",
            value: stats?.total_admins || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Super Admins",
            value: stats?.super_admins || 0,
            icon: ShieldAlert,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "Regular Admins",
            value: stats?.regular_admins || 0,
            icon: UserCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Active Roles",
            value: stats?.admins_by_role?.length || 0,
            icon: Shield,
            color: "text-primary",
            bg: "bg-primary/10",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
                <Card key={item.label} className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-card/50 transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
                                <p className="text-2xl font-black tabular-nums">{item.value}</p>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
