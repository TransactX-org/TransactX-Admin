"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, RefreshCw, UserCheck, ShieldCheck } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { getUsers } from "@/lib/api/services/user.service"
import { exportToCSV } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface UsersFiltersProps {
  filters: {
    search: string
    status: string
    kyc_status: string
    kyb_status: string
    user_type: string
    account_type: string
    is_active: string
    country: string
    email_verified: string
    start_date: string
    end_date: string
  }
  onFilterChange: (newFilters: Partial<UsersFiltersProps["filters"]>) => void
}

export function UsersFilters({ filters, onFilterChange }: UsersFiltersProps) {
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
        description: "Fetching user records for export.",
      })

      // Fetch all records (up to reasonable limit)
      const response = await getUsers(1, 1000, {
        search: filters.search || undefined,
        status: filters.status || undefined,
        kyc_status: filters.kyc_status || undefined,
        kyb_status: filters.kyb_status || undefined,
        user_type: filters.user_type || undefined,
        account_type: filters.account_type || undefined,
        is_active: filters.is_active || undefined,
        country: filters.country || undefined,
        email_verified: filters.email_verified || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
      })

      const data = response.data.data

      if (data.length > 0) {
        exportToCSV(data, `users-${format(new Date(), "yyyy-MM-dd-HH-mm")}`)
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
        description: "An error occurred while exporting users.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const resetFilters = () => {
    setLocalSearch("")
    onFilterChange({
      search: "",
      status: "",
      kyc_status: "",
      kyb_status: "",
      user_type: "",
      account_type: "",
      is_active: "",
      country: "",
      email_verified: "",
      start_date: "",
      end_date: "",
    })
  }

  return (
    <div className="bg-card/30 rounded-2xl border border-border/40 p-4 sm:p-5 mb-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:tx-text-primary transition-colors" />
              <Input
                placeholder="Search Name, Email, Username..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/40 rounded-xl sleek-focus font-medium"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DatePickerWithRange date={dateRange} onChange={handleDateRangeChange} />

            <Button variant="outline" onClick={resetFilters} className="h-11 border-border/40 bg-background/50 rounded-xl px-4 hover:bg-muted/50 transition-all">
              <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
              Reset
            </Button>

            <Button
              variant="outline"
              className="h-11 border-border/40 bg-background/50 rounded-xl px-4 tx-text-primary hover:bg-primary/5 transition-all"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Export
            </Button>
          </div>
        </div>

        {/* Extended Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/10">
          <Select value={filters.status || "all"} onValueChange={(v) => onFilterChange({ status: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background/50 border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.kyc_status || "all"} onValueChange={(v) => onFilterChange({ kyc_status: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background/50 border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">All KYC</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.user_type || "all"} onValueChange={(v) => onFilterChange({ user_type: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background/50 border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.is_active || "all"} onValueChange={(v) => onFilterChange({ is_active: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background/50 border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest">
              <UserCheck className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">Activity</SelectItem>
              <SelectItem value="1">Active Only</SelectItem>
              <SelectItem value="0">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
