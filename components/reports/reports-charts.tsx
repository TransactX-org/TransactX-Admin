"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", revenue: 45000, transactions: 120 },
  { month: "Feb", revenue: 52000, transactions: 145 },
  { month: "Mar", revenue: 48000, transactions: 132 },
  { month: "Apr", revenue: 61000, transactions: 168 },
  { month: "May", revenue: 55000, transactions: 151 },
  { month: "Jun", revenue: 67000, transactions: 189 },
  { month: "Jul", revenue: 72000, transactions: 203 },
  { month: "Aug", revenue: 68000, transactions: 195 },
  { month: "Sep", revenue: 75000, transactions: 215 },
  { month: "Oct", revenue: 82000, transactions: 234 },
]

const transactionTypeData = [
  { type: "Payment", count: 450, percentage: 45 },
  { type: "Transfer", count: 320, percentage: 32 },
  { type: "Withdrawal", count: 230, percentage: 23 },
]

const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 145 },
  { month: "Mar", users: 178 },
  { month: "Apr", users: 210 },
  { month: "May", users: 245 },
  { month: "Jun", users: 289 },
  { month: "Jul", users: 334 },
  { month: "Aug", users: 387 },
  { month: "Sep", users: 445 },
  { month: "Oct", users: 512 },
]

export function ReportsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and transaction trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              transactions: {
                label: "Transactions",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                <Line type="monotone" dataKey="transactions" stroke="var(--color-transactions)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Transaction Types */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Transaction Types</CardTitle>
          <CardDescription>Distribution by transaction type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card className="border-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Total active users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              users: {
                label: "Users",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-users)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
