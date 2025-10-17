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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-base">Manage data bundles and WiFi services</p>
        </div>
        <Button className="tx-bg-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Data Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/50 sleek-card">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Purchases</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">2,456</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 sleek-card">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Revenue</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">₦3.8M</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 sleek-card">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Success Rate</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">99.2%</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 sleek-card">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Active Plans</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">45</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Across all networks</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border border-border/50 sleek-card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Data Purchases</CardTitle>
          <CardDescription className="text-sm">View and manage all data bundle transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, phone, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sleek-input sleek-focus"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px] sleek-input">
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
            <Button variant="outline" className="sleek-focus w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border border-border/30 rounded-lg sleek-table overflow-x-auto">
            <Table className="sleek-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Transaction ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">Phone Number</TableHead>
                  <TableHead className="text-xs sm:text-sm">Network</TableHead>
                  <TableHead className="text-xs sm:text-sm">Plan</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDataPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="sleek-transition">
                    <TableCell className="font-medium text-xs sm:text-sm">{purchase.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.user}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.phone}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.network}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.plan}</TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm">{purchase.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          purchase.status === "Successful"
                            ? "default"
                            : purchase.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={`text-xs ${purchase.status === "Successful" ? "bg-green-500 hover:bg-green-600" : ""}`}
                      >
                        {purchase.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">{purchase.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="sleek-focus text-xs sm:text-sm">
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
