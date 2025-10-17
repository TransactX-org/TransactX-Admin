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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Transaction Volume</CardTitle>
        <CardDescription className="text-sm">Daily transactions for the past week</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="transactions" 
              fill="#457EAC" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
