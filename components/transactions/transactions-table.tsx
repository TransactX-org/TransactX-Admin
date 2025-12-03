"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Loader2 } from "lucide-react"
import { TransactionDetailsModal } from "./transaction-details-modal"
import { useTransactions } from "@/lib/api/hooks/use-transactions"
import { format } from "date-fns"

export function TransactionsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  const { data, isLoading, error } = useTransactions(currentPage, perPage)
  const transactions = data?.data?.data || []
  const pagination = data?.data || null

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    setSelectedRows((prev) => (prev.length === transactions.length ? [] : transactions.map((t) => t.id)))
  }

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
    <>
      <Card className="border border-border/50 sleek-card">
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl">All Transactions</CardTitle>
            {selectedRows.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">{selectedRows.length} selected</span>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="overflow-x-auto">
            <Table className="sleek-table border border-border/30">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-6 sm:w-12">
                    <Checkbox
                      checked={selectedRows.length === transactions.length && transactions.length > 0}
                      onCheckedChange={toggleAllRows}
                      className="h-3 w-3 sm:h-4 sm:w-4"
                    />
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">
                    <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm">
                      Transaction ID
                      <ArrowUpDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-xs sm:text-sm">
                    <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm">
                      Amount
                      <ArrowUpDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">
                    <Button variant="ghost" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm">
                      Date & Time
                      <ArrowUpDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <span className="text-sm text-destructive">Failed to load transactions. Please try again.</span>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <span className="text-sm text-muted-foreground">No transactions found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-accent transition-colors cursor-pointer sleek-transition">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(transaction.id)}
                          onCheckedChange={() => toggleRowSelection(transaction.id)}
                          className="h-3 w-3 sm:h-4 sm:w-4"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs sm:text-sm">
                        {transaction.transactionId || transaction.id}
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm">{transaction.user}</TableCell>
                      <TableCell className="font-semibold text-xs sm:text-sm">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{transaction.type}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTransaction(transaction.id)}>
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of {pagination.total} transactions
              </p>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.prev_page_url || isLoading}
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
                        disabled={isActive || isLoading}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.next_page_url || isLoading}
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

      <TransactionDetailsModal transactionId={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </>
  )
}
