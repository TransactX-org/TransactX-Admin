"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"

const mockTvSubscriptions = [
  {
    id: "TV001",
    user: "Grace Adams",
    smartcardNumber: "1234567890",
    provider: "DSTV",
    package: "Compact Plus",
    amount: "₦12,500",
    status: "Successful",
    date: "2025-10-03 17:00",
  },
  {
    id: "TV002",
    user: "Henry Clark",
    smartcardNumber: "0987654321",
    provider: "GOtv",
    package: "Max",
    amount: "₦4,850",
    status: "Successful",
    date: "2025-10-03 16:15",
  },
  {
    id: "TV003",
    user: "Ivy Martinez",
    smartcardNumber: "5678901234",
    provider: "Startimes",
    package: "Classic",
    amount: "₦2,600",
    status: "Pending",
    date: "2025-10-03 15:40",
  },
]

export function TvManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">TV Subscription Management</h1>
        <p className="text-muted-foreground mt-2 text-xs sm:text-base">Manage TV subscriptions and renewals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Subscriptions</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">987</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Revenue</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">₦1.9M</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Success Rate</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">99.5%</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Active Providers</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">5</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">All major providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">TV Subscriptions</CardTitle>
          <CardDescription className="text-sm">View and manage all TV subscription transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, smartcard number, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="dstv">DSTV</SelectItem>
                <SelectItem value="gotv">GOtv</SelectItem>
                <SelectItem value="startimes">Startimes</SelectItem>
                <SelectItem value="showmax">Showmax</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Transaction ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">Smartcard Number</TableHead>
                  <TableHead className="text-xs sm:text-sm">Provider</TableHead>
                  <TableHead className="text-xs sm:text-sm">Package</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTvSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium text-xs sm:text-sm">{subscription.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{subscription.user}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{subscription.smartcardNumber}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{subscription.provider}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{subscription.package}</TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm">{subscription.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subscription.status === "Successful"
                            ? "default"
                            : subscription.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={`text-xs ${subscription.status === "Successful" ? "bg-green-500 hover:bg-green-600" : ""}`}
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">{subscription.date}</TableCell>
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
