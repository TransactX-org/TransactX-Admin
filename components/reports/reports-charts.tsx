"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Cell, PieChart, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TransactionReports } from "@/lib/api/types"
import { Loader2 } from "lucide-react"

interface ReportsChartsProps {
  data?: TransactionReports["charts"]
  isLoading: boolean
}

export function ReportsCharts({ data, isLoading }: ReportsChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-[400px] border-border/40 bg-card/10 animate-pulse rounded-3xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full overflow-hidden">
      {/* Revenue & Volume Chart */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Performance Trend</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Monthly revenue and volume metrics</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 overflow-hidden w-full">
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "oklch(0.6 0.2 150)" },
              total: { label: "Volume", color: "oklch(0.6 0.2 20)" },
            }}
            className="h-[280px] sm:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenue_overview.map((item, i) => ({ ...item, total: data.transaction_volume[i]?.total }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.1)" />
                <XAxis dataKey="month" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: "oklch(0.556 0 0 / 0.5)" }} />
                <YAxis fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: "oklch(0.556 0 0 / 0.5)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-revenue)", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-total)", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Transaction Breakdown */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Segment Distribution</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Transaction distribution by category</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 overflow-hidden w-full">
          <ChartContainer
            config={{ count: { label: "Transactions", color: "oklch(0.5 0.2 260)" } }}
            className="h-[280px] sm:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.transaction_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.1)" />
                <XAxis dataKey="type" fontSize={9} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: "oklch(0.556 0 0 / 0.5)" }} />
                <YAxis fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: "oklch(0.556 0 0 / 0.5)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 8, 8]} maxBarSize={40} background={{ fill: "oklch(0.95 0 0 / 0.05)", radius: 8 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden lg:col-span-2 min-w-0 shadow-none">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Growth Velocity</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">New users onboarded monthly</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 overflow-hidden w-full">
          <ChartContainer
            config={{ count: { label: "New Users", color: "oklch(0.6 0.2 300)" } }}
            className="h-[280px] sm:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.user_growth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.95 0 0 / 0.1)" />
                <XAxis dataKey="month" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: "oklch(0.556 0 0 / 0.5)" }} />
                <YAxis fontSize={10} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: "oklch(0.556 0 0 / 0.5)" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 8, 8]} maxBarSize={50} background={{ fill: "oklch(0.95 0 0 / 0.05)", radius: 8 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
