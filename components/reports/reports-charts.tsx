"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TransactionReports, TransactionStatistics, TopUserVolume } from "@/lib/api/types"
import { BarChart2 } from "lucide-react"

interface ReportsChartsProps {
  data?: TransactionReports["charts"]
  statsCharts?: TransactionStatistics["charts"]
  topUsers?: TopUserVolume[]
  topUsersLoading?: boolean
  isLoading: boolean
}

const TOP_USER_COLORS = [
  "oklch(0.6 0.2 150)",
  "oklch(0.6 0.2 260)",
  "oklch(0.6 0.2 20)",
  "oklch(0.6 0.2 300)",
  "oklch(0.6 0.2 60)",
  "oklch(0.6 0.2 200)",
  "oklch(0.6 0.2 0)",
  "oklch(0.6 0.2 330)",
  "oklch(0.6 0.2 120)",
  "oklch(0.6 0.2 240)",
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const formatRevenue = (value: number) => {
  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`
  return `₦${value}`
}

const formatCount = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return `${value}`
}

function ChartSkeleton() {
  return <div className="h-[280px] sm:h-[350px] rounded-2xl bg-muted/20 animate-pulse" />
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[280px] sm:h-[350px] flex flex-col items-center justify-center gap-3 text-muted-foreground/30">
      <BarChart2 className="h-8 w-8" />
      <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
    </div>
  )
}

const axisStyle = {
  fontSize: 10,
  fontWeight: 700,
  axisLine: false as const,
  tickLine: false as const,
  tick: { fill: "oklch(0.556 0 0 / 0.5)" },
}

export function ReportsCharts({ data, statsCharts, topUsers, topUsersLoading, isLoading }: ReportsChartsProps) {
  // Performance trend — prefer statsCharts (same source as KPI cards)
  const trendData = (statsCharts?.revenue_overview ?? data?.revenue_overview ?? []).map(rev => {
    const vol = (data?.transaction_volume ?? []).find(v => v.month === rev.month)
    return { month: rev.month, revenue: rev.revenue, volume: vol?.total ?? 0 }
  })

  // Daily volume (responds to month filter)
  const dailyVolumeData = (statsCharts?.transaction_volume ?? []).map(item => ({
    day: `${item.day}`,
    total: item.total,
  }))

  // Top users stacked chart data
  const topUsersChartData = MONTHS.map(month => {
    const row: Record<string, string | number> = { month }
    topUsers?.forEach(u => { row[u.user] = u.monthly[month] ?? 0 })
    return row
  })
  const topUsersConfig = Object.fromEntries(
    (topUsers ?? []).map((u, i) => [u.user, { label: u.user, color: TOP_USER_COLORS[i] }])
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className={`border-border/40 bg-card/10 rounded-3xl shadow-none p-6 ${i === 4 ? "lg:col-span-2" : ""}`}>
            <ChartSkeleton />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full overflow-hidden">

      {/* Performance Trend */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Performance Trend</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Monthly revenue vs transaction volume</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {trendData.length === 0 ? (
            <EmptyChart label="No trend data for this period" />
          ) : (
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "oklch(0.6 0.2 150)" },
                volume: { label: "Volume", color: "oklch(0.6 0.2 20)" },
              }}
              className="h-[280px] sm:h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.08)" />
                  <XAxis dataKey="month" {...axisStyle} />
                  <YAxis yAxisId="rev" orientation="left" {...axisStyle} tickFormatter={formatRevenue} width={62} />
                  <YAxis yAxisId="vol" orientation="right" {...axisStyle} tickFormatter={formatCount} width={45} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "16px" }} />
                  <Line yAxisId="rev" type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--color-revenue)", strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                  <Line yAxisId="vol" type="monotone" dataKey="volume" stroke="var(--color-volume)" strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--color-volume)", strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Segment Distribution */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Segment Distribution</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Transaction count by category</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {(() => {
            const breakdown = (data?.transaction_breakdown ?? []).filter(
              item => !item.type?.toLowerCase().includes("request")
            )
            return breakdown.length === 0 ? (
              <EmptyChart label="No breakdown data for this period" />
            ) : (
              <ChartContainer
                config={{ count: { label: "Transactions", color: "oklch(0.5 0.2 260)" } }}
                className="h-[280px] sm:h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdown} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.08)" />
                    <XAxis dataKey="type" {...axisStyle} fontSize={9} />
                    <YAxis {...axisStyle} tickFormatter={formatCount} width={42} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 8, 8]} maxBarSize={44} background={{ fill: "oklch(0.95 0 0 / 0.04)", radius: 8 }} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )
          })()}
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Growth Velocity</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">New users onboarded monthly</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {(data?.user_growth ?? []).length === 0 ? (
            <EmptyChart label="No user growth data for this period" />
          ) : (
            <ChartContainer
              config={{ count: { label: "New Users", color: "oklch(0.6 0.2 300)" } }}
              className="h-[280px] sm:h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.user_growth} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.08)" />
                  <XAxis dataKey="month" {...axisStyle} />
                  <YAxis {...axisStyle} tickFormatter={formatCount} width={42} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 8, 8]} maxBarSize={50} background={{ fill: "oklch(0.95 0 0 / 0.04)", radius: 8 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Daily Volume */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Daily Volume</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Transaction count per day — selected month</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {dailyVolumeData.length === 0 ? (
            <EmptyChart label="No daily data for this month" />
          ) : (
            <ChartContainer
              config={{ total: { label: "Transactions", color: "oklch(0.6 0.2 200)" } }}
              className="h-[280px] sm:h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyVolumeData} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.08)" />
                  <XAxis dataKey="day" {...axisStyle} fontSize={9} interval="preserveStartEnd" />
                  <YAxis {...axisStyle} tickFormatter={formatCount} width={42} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[5, 5, 5, 5]} maxBarSize={18} background={{ fill: "oklch(0.95 0 0 / 0.04)", radius: 5 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Top 10 Users by Volume */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden lg:col-span-2 min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">Top Users by Volume</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Monthly transaction volume — top 10 users</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {topUsersLoading ? (
            <ChartSkeleton />
          ) : !topUsers || topUsers.length === 0 ? (
            <EmptyChart label="No transaction data for this period" />
          ) : (
            <ChartContainer config={topUsersConfig} className="h-[340px] sm:h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topUsersChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.08)" />
                  <XAxis dataKey="month" {...axisStyle} />
                  <YAxis {...axisStyle} tickFormatter={formatRevenue} width={62} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "9px", fontWeight: "bold", paddingTop: "16px" }}
                    formatter={(value: string) => value.length > 22 ? value.slice(0, 22) + "…" : value}
                  />
                  {(topUsers ?? []).map((u, i) => (
                    <Bar
                      key={u.user}
                      dataKey={u.user}
                      stackId="users"
                      fill={TOP_USER_COLORS[i]}
                      radius={i === (topUsers?.length ?? 0) - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
