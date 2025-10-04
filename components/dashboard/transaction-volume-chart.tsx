"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", transactions: 120 },
  { name: "Tue", transactions: 145 },
  { name: "Wed", transactions: 132 },
  { name: "Thu", transactions: 168 },
  { name: "Fri", transactions: 195 },
  { name: "Sat", transactions: 89 },
  { name: "Sun", transactions: 76 },
]

export function TransactionVolumeChart() {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Transaction Volume</CardTitle>
        <CardDescription>Daily transactions for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Bar dataKey="transactions" fill="#457EAC" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
