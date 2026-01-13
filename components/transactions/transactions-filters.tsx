"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, RefreshCw, X } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { startOfDay, endOfDay } from "date-fns"
import { getTransactions } from "@/lib/api/services/transaction.service"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface TransactionsFiltersProps {
  filters: {
    search: string
    status: string
    type: string
    start_date: string
    end_date: string
  }
  onFilterChange: (newFilters: Partial<TransactionsFiltersProps["filters"]>) => void
}

const TRANSACTION_TYPES = [
  "SEND_MONEY",
  "REQUEST_MONEY",
  "FUND_WALLET",
  "AIRTIME",
  "DATA",
  "CABLETV",
  "UTILITY",
  "TRANSACTION_SYNC",
  "SUBSCRIPTION",
]

const TRANSACTION_STATUSES = [
  "SUCCESSFUL",
  "FAILED",
  "PENDING",
  "PROCESSING",
  "REVERSED",
]

export function TransactionsFilters({ filters, onFilterChange }: TransactionsFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ search: localSearch })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [localSearch, onFilterChange, filters.search])

  const dateRange: DateRange | undefined = filters.start_date ? {
    from: new Date(filters.start_date),
    to: filters.end_date ? new Date(filters.end_date) : undefined
  } : undefined

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFilterChange({
      start_date: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      end_date: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    })
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const toastId = toast({
        title: "Exporting...",
        description: "Fetching transaction records for export.",
      })

      // Fetch all records (up to reasonable limit)
      const response = await getTransactions(1, 1000, {
        search: filters.search || undefined,
        status: (filters.status === "all" || !filters.status) ? undefined : filters.status,
        type: (filters.type === "all" || !filters.type) ? undefined : filters.type,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      })

      const data = response.data.data

      if (data.length > 0) {
        exportToCSV(data, `transactions-${format(new Date(), "yyyy-MM-dd-HH-mm")}`)
        toast({
          title: "Export Complete",
          description: `Successfully exported ${data.length} records.`,
        })
      } else {
        toast({
          title: "Export Failed",
          description: "No records found to export.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting transactions.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const clearFilters = () => {
    setLocalSearch("")
    onFilterChange({
      search: "",
      status: "all",
      type: "all",
      start_date: "",
      end_date: "",
    })
  }

  return (
    <div className="bg-card/30 rounded-2xl border border-border/40 p-4 sm:p-5 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:tx-text-primary transition-colors" />
              <Input
                placeholder="Search ID, sender, or ref..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 h-10 bg-background/50 border-border/40 rounded-xl sleek-focus font-medium"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => onFilterChange({ status: value })}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/40 rounded-xl sm:w-[150px] font-bold text-[10px] uppercase tracking-widest">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-md">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Status</SelectItem>
                {TRAN_STATUSES_MAPPING}
              </SelectContent>
            </Select>

            <Select
              value={filters.type || "all"}
              onValueChange={(value) => onFilterChange({ type: value })}
            >
              <SelectTrigger className="h-10 bg-background/50 border-border/40 rounded-xl sm:w-[150px] font-bold text-[10px] uppercase tracking-widest">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-md">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Types</SelectItem>
                {TRAN_TYPES_MAPPING}
              </SelectContent>
            </Select>
            <DatePickerWithRange date={dateRange} onChange={handleDateRangeChange} />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="h-10 w-10 border border-border/40 rounded-xl bg-background/50 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-border/40 bg-background/50 flex-1 sm:flex-none font-bold text-[10px] uppercase tracking-widest"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TRAN_STATUSES_MAPPING = TRANSACTION_STATUSES.map(status => (
  <SelectItem key={status} value={status} className="text-[10px] font-bold uppercase tracking-widest">
    {status.replace("_", " ")}
  </SelectItem>
))

const TRAN_TYPES_MAPPING = TRANSACTION_TYPES.map(type => (
  <SelectItem key={type} value={type} className="text-[10px] font-bold uppercase tracking-widest">
    {type.replace("_", " ")}
  </SelectItem>
))
