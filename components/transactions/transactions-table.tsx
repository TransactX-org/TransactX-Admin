"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ChevronLeft, ChevronRight, Loader2, CreditCard } from "lucide-react"
import { TransactionDetailsModal } from "./transaction-details-modal"
import { useTransactions } from "@/lib/api/hooks/use-transactions"
import { format } from "date-fns"

interface TransactionsTableProps {
  filters: {
    search: string
    status: string
    type: string
    start_date: string
    end_date: string
  }
}

export function TransactionsTable({ filters }: TransactionsTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  // Map empty filters to undefined for API
  const apiFilters = {
    search: filters.search || undefined,
    status: (filters.status === "all" || !filters.status) ? undefined : filters.status,
    type: (filters.type === "all" || !filters.type) ? undefined : filters.type,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
  }

  const { data, isLoading } = useTransactions(currentPage, perPage, apiFilters)
  const transactions = data?.data?.data || []
  const pagination = data?.data || null

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    const allIds = transactions.map((t) => t.transactionId)
    setSelectedRows((prev) => (prev.length === allIds.length ? [] : allIds))
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm")
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const getStatusConfig = (status: string) => {
    const s = status.toUpperCase()
    if (s === "SUCCESSFUL" || s === "SUCCESS") {
      return { variant: "default" as const, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
    }
    if (s === "PENDING" || s === "PROCESSING") {
      return { variant: "secondary" as const, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
    }
    if (s === "FAILED" || s === "REVERSED") {
      return { variant: "destructive" as const, className: "bg-rose-500/10 text-rose-600 border-rose-500/20" }
    }
    return { variant: "outline" as const, className: "bg-muted/10 text-muted-foreground border-border/20" }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 font-mono">
            {isLoading ? "Fetching records..." : `Total Records: ${pagination?.total || 0}`}
          </p>
          {selectedRows.length > 0 && (
            <Button variant="outline" size="sm" className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
              {selectedRows.length} Selected
            </Button>
          )}
        </div>

        <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden shadow-none">
          <CardContent className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-border/20 bg-muted/5">
                    <TableHead className="w-[48px] px-6">
                      <Checkbox
                        checked={selectedRows.length === transactions.length && transactions.length > 0}
                        onCheckedChange={toggleAllRows}
                        className="rounded-lg h-3.5 w-3.5"
                      />
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Transaction ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">User</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-right">Amount</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Type</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Date</TableHead>
                    <TableHead className="text-right px-6 py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-b-border/10">
                        <TableCell colSpan={8} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-20">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Loading...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <CreditCard className="h-8 w-8" />
                          <span className="text-[10px] font-black uppercase tracking-widest">No transactions found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : transactions.map((transaction) => {
                    const statusConfig = getStatusConfig(transaction.status)
                    const isSelected = selectedRows.includes(transaction.transactionId)
                    return (
                      <TableRow key={transaction.transactionId} className={cn("border-b-border/10 hover:bg-muted/10 transition-colors group", isSelected && "bg-primary/5")}>
                        <TableCell className="px-6">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRowSelection(transaction.transactionId)}
                            className="rounded-lg h-3.5 w-3.5"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-[11px] font-black uppercase tracking-tighter px-4 py-4 truncate max-w-[120px]">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="font-black text-sm tracking-tight">{transaction.user}</div>
                        </TableCell>
                        <TableCell className="font-black text-sm text-right px-4 py-4">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-muted/20 border-border/40">
                            {transaction.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <Badge className={cn("font-black text-[9px] px-2.5 py-0.5 rounded-md border shadow-none uppercase tracking-widest", statusConfig.className)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold text-muted-foreground/60 px-4 py-4 whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell className="text-right px-6 py-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group-hover:scale-110"
                            onClick={() => setSelectedTransactionId(transaction.transactionId)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden divide-y divide-border/10">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-5 h-24 animate-pulse bg-muted/5" />
                ))
              ) : transactions.map((transaction) => {
                const statusConfig = getStatusConfig(transaction.status)
                const isSelected = selectedRows.includes(transaction.transactionId)
                return (
                  <div
                    key={transaction.transactionId}
                    className={cn(
                      "p-5 space-y-4 transition-all active:scale-95",
                      isSelected ? "bg-primary/5" : "bg-transparent"
                    )}
                    onClick={() => setSelectedTransactionId(transaction.transactionId)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedRows(p => [...p, transaction.transactionId])
                            else setSelectedRows(p => p.filter(id => id !== transaction.transactionId))
                          }}
                          className="rounded-lg h-4 w-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <p className="font-black text-sm tracking-tight">{transaction.user}</p>
                          <p className="text-[9px] font-mono font-black text-muted-foreground uppercase mt-0.5">{transaction.transactionId}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-[9px] font-black px-2.5 py-0.5 rounded-md border uppercase tracking-widest shadow-none", statusConfig.className)}>
                        {transaction.status}
                      </Badge>
                    </div>

                    <div className="flex items-end justify-between pt-2">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Type & Date</p>
                        <p className="text-[10px] font-bold">
                          <span className="text-primary uppercase">{transaction.type.replace("_", " ")}</span>
                          <span className="mx-2 text-muted-foreground/20">|</span>
                          <span className="text-muted-foreground/60">{formatDate(transaction.date)}</span>
                        </p>
                      </div>
                      <p className="text-lg font-black tracking-tight">{formatCurrency(transaction.amount)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {pagination && (
          <div className="flex items-center justify-between px-1 py-2">
            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              Page {pagination.current_page} <span className="mx-1 opacity-20">/</span> {pagination.last_page}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="h-8 w-8 p-0 rounded-xl border-border/40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => setCurrentPage(p => p + 1)}
                className="h-8 w-8 p-0 rounded-xl border-border/40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <TransactionDetailsModal
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </>
  )
}
