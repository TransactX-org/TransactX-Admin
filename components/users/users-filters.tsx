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
import { MobileFilterSheet } from "@/components/ui/mobile-filter-sheet"

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
                className="pl-10 h-11 bg-background border-border/40 rounded-xl sleek-focus font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Sheet */}
            <MobileFilterSheet onReset={resetFilters} className="md:hidden">
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Date Range</label>
                  <DatePickerWithRange date={dateRange} onChange={handleDateRangeChange} className="w-full" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                  <Select value={filters.status || "all"} onValueChange={(v) => onFilterChange({ status: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border/40">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">KYC Status</label>
                  <Select value={filters.kyc_status || "all"} onValueChange={(v) => onFilterChange({ kyc_status: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border/40">
                      <SelectValue placeholder="KYC Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All KYC</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="SUCCESSFUL">Successful</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">KYB Status</label>
                  <Select value={filters.kyb_status || "all"} onValueChange={(v) => onFilterChange({ kyb_status: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border/40">
                      <SelectValue placeholder="KYB Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All KYB</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="SUCCESSFUL">Successful</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">User Type</label>
                  <Select value={filters.user_type || "all"} onValueChange={(v) => onFilterChange({ user_type: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border/40">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Account Type</label>
                  <Select value={filters.account_type || "all"} onValueChange={(v) => onFilterChange({ account_type: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border/40">
                      <SelectValue placeholder="Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      <SelectItem value="main">Main</SelectItem>
                      <SelectItem value="sub">Sub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Activity</label>
                  <Select value={filters.is_active || "all"} onValueChange={(v) => onFilterChange({ is_active: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border/40">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </MobileFilterSheet>

            <div className="hidden md:block">
              <DatePickerWithRange date={dateRange} onChange={handleDateRangeChange} />
            </div>

            <Button variant="outline" onClick={resetFilters} className="hidden md:flex h-11 border-border/40 bg-background/50 rounded-xl px-4 hover:bg-muted/50 transition-all">
              <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
              Reset
            </Button>

            <Button
              variant="outline"
              className="h-11 border-border/40 bg-background/50 rounded-xl px-4 tx-text-primary hover:bg-primary/5 transition-all flex-1 md:flex-none"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 md:mr-2" />}
              <span className="hidden md:inline">Export</span>
              <span className="md:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Desktop Extended Filters */}
        <div className="hidden md:flex flex-wrap items-center gap-2 pt-2 border-t border-border/10">
          <Select value={filters.status || "all"} onValueChange={(v) => onFilterChange({ status: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.kyc_status || "all"} onValueChange={(v) => onFilterChange({ kyc_status: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <ShieldCheck className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="KYC Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">KYC Status</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="SUCCESSFUL">Successful</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.kyb_status || "all"} onValueChange={(v) => onFilterChange({ kyb_status: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <ShieldCheck className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="KYB Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">KYB Status</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="SUCCESSFUL">Successful</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.user_type || "all"} onValueChange={(v) => onFilterChange({ user_type: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">User Type</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.account_type || "all"} onValueChange={(v) => onFilterChange({ account_type: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">Account Type</SelectItem>
              <SelectItem value="main">Main</SelectItem>
              <SelectItem value="sub">Sub</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.is_active || "all"} onValueChange={(v) => onFilterChange({ is_active: v === "all" ? "" : v })}>
            <SelectTrigger className="h-9 bg-background border-border/40 rounded-xl w-32 text-[10px] font-bold uppercase tracking-widest text-foreground">
              <UserCheck className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40">
              <SelectItem value="all">Any Activity</SelectItem>
              <SelectItem value="1">Active Only</SelectItem>
              <SelectItem value="0">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Country Filter - Text Input for now */}
          <Input
            placeholder="Country Code (e.g. NG)"
            value={filters.country || ""}
            onChange={(e) => onFilterChange({ country: e.target.value })}
            className="h-9 w-32 text-xs bg-background border-border/40 rounded-xl font-medium text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  )
}
