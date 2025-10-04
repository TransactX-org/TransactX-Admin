"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Plus } from "lucide-react"

const mockDataPurchases = [
  {
    id: "DT001",
    user: "Alice Brown",
    phone: "08011223344",
    network: "MTN",
    plan: "1GB Daily",
    amount: "₦300",
    status: "Successful",
    date: "2025-10-03 15:20",
  },
  {
    id: "DT002",
    user: "Bob Wilson",
    phone: "08099887766",
    network: "Airtel",
    plan: "5GB Monthly",
    amount: "₦1,500",
    status: "Successful",
    date: "2025-10-03 14:10",
  },
  {
    id: "DT003",
    user: "Carol Davis",
    phone: "08122334455",
    network: "Glo",
    plan: "10GB Monthly",
    amount: "₦2,500",
    status: "Pending",
    date: "2025-10-03 13:30",
  },
]

export function DataManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground mt-2">Manage data bundles and WiFi services</p>
        </div>
        <Button className="tx-bg-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Data Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Purchases</CardDescription>
            <CardTitle className="text-2xl">2,456</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">₦3.8M</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-2xl">99.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Plans</CardDescription>
            <CardTitle className="text-2xl">45</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across all networks</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Purchases</CardTitle>
          <CardDescription>View and manage all data bundle transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, phone, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="mtn">MTN</SelectItem>
                <SelectItem value="airtel">Airtel</SelectItem>
                <SelectItem value="glo">Glo</SelectItem>
                <SelectItem value="9mobile">9mobile</SelectItem>
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
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDataPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{purchase.user}</TableCell>
                    <TableCell>{purchase.phone}</TableCell>
                    <TableCell>{purchase.network}</TableCell>
                    <TableCell>{purchase.plan}</TableCell>
                    <TableCell className="font-semibold">{purchase.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          purchase.status === "Successful"
                            ? "default"
                            : purchase.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={purchase.status === "Successful" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {purchase.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{purchase.date}</TableCell>
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
