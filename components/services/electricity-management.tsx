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
import { useElectricityStats, useElectricityTransactions } from "@/lib/api/hooks/use-electricity"
import { format } from "date-fns"
import { PaginationSelector } from "@/components/ui/pagination-selector"
import { AddProviderDialog } from "./add-provider-dialog"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { MobileFilterSheet } from "@/components/ui/mobile-filter-sheet"
import { TransactionDetailsModal } from "@/components/transactions/transaction-details-modal"
import { ChevronRight } from "lucide-react"

export function ElectricityManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState("all")
  const [perPage, setPerPage] = useState(15)
  const [openAddProviderDialog, setOpenAddProviderDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: statsData, isLoading: statsLoading } = useElectricityStats()
  const { data: transactionsData, isLoading: transactionsLoading, error } = useElectricityTransactions(
    currentPage,
    perPage,
    {
      search: searchQuery || undefined,
      provider: selectedProvider === "all" ? undefined : selectedProvider,
      start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    }
  )

  const stats = statsData?.data
  const transactions = transactionsData?.data?.data || []
  const pagination = transactionsData?.data || null

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm")
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const formatUnits = (units: string | number) => {
    if (typeof units === "string") return units
    return `${units} kWh`
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESSFUL":
        return "default"
      case "PENDING":
        return "secondary"
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Filter logic is now handled by API, so we just use the transactions as is
  // But for immediate UI feedback if API supported it, we'd use filters. 
  // Since we updated service to accept filters, we rely on API response.
  const filteredTransactions = transactions

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Electricity Management</h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-base">Manage electricity bill payments and meter recharges</p>
        </div>
        <Button
          className="tx-bg-primary hover:opacity-90 w-full sm:w-auto"
          onClick={() => setOpenAddProviderDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      <AddProviderDialog open={openAddProviderDialog} onOpenChange={setOpenAddProviderDialog} />

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Payments</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.totalPayments.toLocaleString() || "0"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">All time payments</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Revenue</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                `₦${stats?.totalRevenue.toLocaleString() || "0"}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Total revenue generated</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Success Rate</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `${stats?.successRate.toFixed(2) || "0"}%`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Transaction success rate</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Providers</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">
              {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.providers.toLocaleString() || "0"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs text-muted-foreground">Active providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Electricity Payments</CardTitle>
          <CardDescription className="text-sm">View and manage all electricity bill payment transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
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

            {/* Mobile Filter Sheet */}
            <MobileFilterSheet
              className="md:hidden"
              onReset={() => {
                setSelectedProvider("all")
                setDateRange(undefined)
              }}
            >
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Date Range</label>
                  <DatePickerWithRange date={dateRange} onChange={setDateRange} className="w-full" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Provider</label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="w-full h-11 rounded-xl">
                      <SelectValue placeholder="Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="ikedc">IKEDC</SelectItem>
                      <SelectItem value="ekedc">EKEDC</SelectItem>
                      <SelectItem value="aedc">AEDC</SelectItem>
                      <SelectItem value="ibedc">IBEDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MobileFilterSheet>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="ikedc">IKEDC</SelectItem>
                  <SelectItem value="ekedc">EKEDC</SelectItem>
                  <SelectItem value="aedc">AEDC</SelectItem>
                  <SelectItem value="ibedc">IBEDC</SelectItem>
                </SelectContent>
              </Select>
              <div className="min-w-[200px]">
                <DatePickerWithRange date={dateRange} onChange={setDateRange} />
              </div>
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
                exportToCSV(dataToExport, "electricity-transactions")
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

          {/* Desktop Table View */}
          <div className="hidden md:block border border-border/30 rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Transaction ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">Meter Number</TableHead>
                  <TableHead className="text-xs sm:text-sm">Provider</TableHead>
                  <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                  <TableHead className="text-xs sm:text-sm">Units</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <span className="text-sm text-destructive">Failed to load transactions. Please try again.</span>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <span className="text-sm text-muted-foreground">No transactions found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="font-medium text-xs sm:text-sm font-mono">
                        {transaction.transactionId.slice(-8)}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.user}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.meterNumber}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.provider}</TableCell>
                      <TableCell className="font-semibold text-xs sm:text-sm">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatUnits(transaction.units)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs sm:text-sm"
                          onClick={() => setSelectedTransactionId(transaction.transactionId)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {transactionsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 h-32 rounded-2xl bg-card border border-border/40 animate-pulse" />
              ))
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-10 bg-card/30 rounded-2xl border border-dashed border-border/40">
                <p className="text-sm text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.transactionId}
                  className="relative p-4 rounded-2xl border border-border/40 bg-card active:scale-[0.99] transition-all"
                  onClick={() => setSelectedTransactionId(transaction.transactionId)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-sm text-foreground">{transaction.user}</p>
                      <p className="text-[10px] items-center gap-1.5 text-muted-foreground font-mono font-bold mt-0.5 opacity-70">
                        #{transaction.transactionId}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-none">
                      {transaction.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border/10 pt-3">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Details</p>
                      <p className="text-xs font-bold uppercase">{transaction.provider} - {formatUnits(transaction.units)}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Amount</p>
                      <p className="text-base font-black tracking-tight">{formatCurrency(transaction.amount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/10">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <p className="text-[10px] font-bold opacity-60">{formatDate(transaction.date)}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold px-0 hover:bg-transparent hover:text-primary">
                      View Details <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

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

      <TransactionDetailsModal
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </div>
  )
}
