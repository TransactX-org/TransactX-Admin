"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { TransactionDetailsModal } from "./transaction-details-modal"

const mockTransactions = [
  {
    id: "TXN001234",
    user: "John Doe",
    amount: "₦5,000",
    type: "Payment",
    status: "success",
    date: "2025-10-04 14:30",
  },
  {
    id: "TXN001235",
    user: "Jane Smith",
    amount: "₦12,500",
    type: "Transfer",
    status: "success",
    date: "2025-10-04 13:15",
  },
  {
    id: "TXN001236",
    user: "Mike Johnson",
    amount: "₦8,000",
    type: "Withdrawal",
    status: "pending",
    date: "2025-10-04 12:45",
  },
  {
    id: "TXN001237",
    user: "Sarah Williams",
    amount: "₦3,200",
    type: "Payment",
    status: "success",
    date: "2025-10-04 11:20",
  },
  {
    id: "TXN001238",
    user: "David Brown",
    amount: "₦15,000",
    type: "Transfer",
    status: "failed",
    date: "2025-10-04 10:05",
  },
  {
    id: "TXN001239",
    user: "Emily Davis",
    amount: "₦6,750",
    type: "Payment",
    status: "success",
    date: "2025-10-04 09:30",
  },
  {
    id: "TXN001240",
    user: "Chris Wilson",
    amount: "₦20,000",
    type: "Withdrawal",
    status: "pending",
    date: "2025-10-04 08:15",
  },
  {
    id: "TXN001241",
    user: "Lisa Anderson",
    amount: "₦4,500",
    type: "Payment",
    status: "success",
    date: "2025-10-03 16:45",
  },
]

export function TransactionsTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    setSelectedRows((prev) => (prev.length === mockTransactions.length ? [] : mockTransactions.map((t) => t.id)))
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
                      checked={selectedRows.length === mockTransactions.length}
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
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-accent transition-colors cursor-pointer sleek-transition">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(transaction.id)}
                        onCheckedChange={() => toggleRowSelection(transaction.id)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">{transaction.id}</TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">{transaction.user}</TableCell>
                    <TableCell className="font-semibold text-xs sm:text-sm">{transaction.amount}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{transaction.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "success"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">{transaction.date}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground">Showing 1 to {mockTransactions.length} of 234 transactions</p>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="sm" disabled className="text-xs sm:text-sm">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="tx-bg-primary text-white bg-transparent text-xs sm:text-sm">
                1
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                2
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                3
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionDetailsModal transactionId={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </>
  )
}
