"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"

const mockElectricityPayments = [
  {
    id: "EL001",
    user: "David Lee",
    meterNumber: "04512345678",
    provider: "EKEDC",
    amount: "₦5,000",
    units: "45.5 kWh",
    status: "Successful",
    date: "2025-10-03 16:45",
  },
  {
    id: "EL002",
    user: "Emma Taylor",
    meterNumber: "04598765432",
    provider: "IKEDC",
    amount: "₦10,000",
    units: "91.0 kWh",
    status: "Successful",
    date: "2025-10-03 15:30",
  },
  {
    id: "EL003",
    user: "Frank Miller",
    meterNumber: "04523456789",
    provider: "AEDC",
    amount: "₦3,000",
    units: "27.3 kWh",
    status: "Pending",
    date: "2025-10-03 14:20",
  },
]

export function ElectricityManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Electricity Management</h1>
        <p className="text-muted-foreground mt-2">Manage electricity bill payments and meter recharges</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Payments</CardDescription>
            <CardTitle className="text-2xl">3,789</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">₦5.2M</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-2xl">97.8%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Providers</CardDescription>
            <CardTitle className="text-2xl">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Electricity Payments</CardTitle>
          <CardDescription>View and manage all electricity bill payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, meter number, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="ekedc">EKEDC</SelectItem>
                <SelectItem value="ikedc">IKEDC</SelectItem>
                <SelectItem value="aedc">AEDC</SelectItem>
                <SelectItem value="phed">PHED</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockElectricityPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.user}</TableCell>
                    <TableCell>{payment.meterNumber}</TableCell>
                    <TableCell>{payment.provider}</TableCell>
                    <TableCell className="font-semibold">{payment.amount}</TableCell>
                    <TableCell>{payment.units}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "Successful"
                            ? "default"
                            : payment.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={payment.status === "Successful" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
