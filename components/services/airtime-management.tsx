"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Plus } from "lucide-react"

const mockAirtimePurchases = [
  {
    id: "AT001",
    user: "John Doe",
    phone: "08012345678",
    network: "MTN",
    amount: "₦1,000",
    status: "Successful",
    date: "2025-10-03 14:30",
  },
  {
    id: "AT002",
    user: "Jane Smith",
    phone: "08098765432",
    network: "Airtel",
    amount: "₦500",
    status: "Successful",
    date: "2025-10-03 13:15",
  },
  {
    id: "AT003",
    user: "Mike Johnson",
    phone: "08123456789",
    network: "Glo",
    amount: "₦2,000",
    status: "Pending",
    date: "2025-10-03 12:45",
  },
  {
    id: "AT004",
    user: "Sarah Williams",
    phone: "08087654321",
    network: "9mobile",
    amount: "₦1,500",
    status: "Failed",
    date: "2025-10-03 11:20",
  },
]

export function AirtimeManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Airtime Management</h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-base">Manage airtime purchases and recharge cards</p>
        </div>
        <Button className="tx-bg-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Recharge Card
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Purchases</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">1,234</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Revenue</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">₦2.4M</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Success Rate</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">98.5%</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Pending</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">23</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Airtime Purchases</CardTitle>
          <CardDescription className="text-sm">View and manage all airtime purchase transactions</CardDescription>
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
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Table */}
          <div className="border border-border/30 rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Transaction ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">Phone Number</TableHead>
                  <TableHead className="text-xs sm:text-sm">Network</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAirtimePurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">{purchase.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.user}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.phone}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{purchase.network}</TableCell>
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
                      <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
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
