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
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === mockTransactions.length}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Transaction ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Date & Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-accent transition-colors cursor-pointer">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(transaction.id)}
                        onCheckedChange={() => toggleRowSelection(transaction.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell className="font-medium">{transaction.user}</TableCell>
                    <TableCell className="font-semibold">{transaction.amount}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "success"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{transaction.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedTransaction(transaction.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
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
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">Showing 1 to {mockTransactions.length} of 234 transactions</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="tx-bg-primary text-white bg-transparent">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
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
