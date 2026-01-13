"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Loader2, Plus, X } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { useTVStats, useTVTransactions, useTVProviders } from "@/lib/api/hooks/use-tv"
import { format } from "date-fns"
import { PaginationSelector } from "@/components/ui/pagination-selector"
import { AddTvProviderDialog } from "./add-tv-provider-dialog"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function TvManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [perPage, setPerPage] = useState(15)
  const [openAddProviderDialog, setOpenAddProviderDialog] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const { toast } = useToast()

  const { data: statsData, isLoading: statsLoading } = useTVStats()
  const { data: transactionsData, isLoading: transactionsLoading } = useTVTransactions(
    currentPage,
    perPage,
    {
      search: searchQuery || undefined,
      provider: selectedProvider === "all" ? undefined : selectedProvider,
      start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    }
  )
  const { data: providersData } = useTVProviders()

  const stats = statsData?.data
  const transactions = transactionsData?.data?.data || []
  const pagination = transactionsData?.data
  const providers = providersData?.data || []

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm")
    } catch {
      return dateString
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESSFUL":
      case "SUCCESS":
        return "default"
      case "PENDING":
        return "secondary"
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">TV Subscription Management</h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-base">Manage TV subscriptions and renewals</p>
        </div>
        <Button
          className="tx-bg-primary hover:opacity-90 w-full sm:w-auto"
          onClick={() => setOpenAddProviderDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <AddTvProviderDialog open={openAddProviderDialog} onOpenChange={setOpenAddProviderDialog} />

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Subscriptions</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalSubscriptions || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Revenue</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `₦${(stats?.totalRevenue || 0).toLocaleString()}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Success Rate</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${stats?.successRate || 0}%`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Active Providers</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.providers || providers.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">All major providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border border-border/50">
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
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.code.toLowerCase()}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 min-w-[200px]">
              <DatePickerWithRange date={dateRange} onChange={setDateRange} />
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                const dataToExport = transactions.length > 0 ? transactions : []
                if (dataToExport.length === 0) {
                  toast({ title: "No data", description: "No transactions to export", variant: "destructive" })
                  return
                }
                exportToCSV(dataToExport, "tv-transactions")
                toast({ title: "Exported", description: "Transactions exported successfully" })
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {/* Clear filters button */}
            {(searchQuery || selectedProvider !== "all" || dateRange) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedProvider("all")
                  setDateRange(undefined)
                }}
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="border border-border/30 rounded-lg overflow-x-auto">
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
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="font-medium text-xs sm:text-sm">{transaction.transactionId}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.user}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.smartCardNumber}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.provider}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.package}</TableCell>
                      <TableCell className="font-semibold text-xs sm:text-sm">₦{transaction.amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(transaction.status)}
                          className={`text-xs ${transaction.status.toUpperCase() === "SUCCESSFUL" ? "bg-green-500 hover:bg-green-600" : ""}`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-4">
                <PaginationSelector value={perPage} onValueChange={setPerPage} />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} transactions
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.prev_page_url || transactionsLoading}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="text-xs sm:text-sm"
                >
                  Previous
                </Button>
                {pagination.links
                  .filter((link) => link.label !== "&laquo; Previous" && link.label !== "Next &raquo;")
                  .map((link) => {
                    const pageNum = link.label
                    if (pageNum === "...") return null
                    const isActive = link.active
                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="sm"
                        onClick={() => link.url && setCurrentPage(parseInt(pageNum))}
                        className={`text-xs sm:text-sm ${isActive ? "tx-bg-primary text-white bg-transparent" : ""}`}
                        disabled={isActive || transactionsLoading}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.next_page_url || transactionsLoading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
