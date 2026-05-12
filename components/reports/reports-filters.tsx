"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw, Calendar } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface ReportsFiltersProps {
  filters: {
    year: number
    month: number
    start_date: string
    end_date: string
  }
  onFilterChange: (newFilters: Partial<ReportsFiltersProps["filters"]>) => void
  onRefresh?: () => void
  onExport?: () => void
}

export function ReportsFilters({ filters, onFilterChange, onRefresh, onExport }: ReportsFiltersProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const dateRange: DateRange | undefined = filters.start_date
    ? { from: new Date(filters.start_date), to: filters.end_date ? new Date(filters.end_date) : undefined }
    : undefined

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFilterChange({
      start_date: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      end_date: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    })
  }

  return (
    <div className="bg-card/30 rounded-2xl border border-border/40 p-4 sm:p-5 backdrop-blur-sm shadow-none space-y-4">

      {/* Charts filter row */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Charts & Top Users</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Select
            value={filters.year.toString()}
            onValueChange={(v) => onFilterChange({ year: parseInt(v) })}
          >
            <SelectTrigger className="h-10 w-full sm:w-[110px] bg-background/50 border-border/40 rounded-xl px-3 font-black text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Year" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-md">
              {years.map(year => (
                <SelectItem key={year} value={year.toString()} className="text-[10px] font-black uppercase tracking-widest">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1">
            <DatePickerWithRange date={dateRange} onChange={handleDateRangeChange} />
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 border-border/40 bg-background/50 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={onRefresh}
              title="Refresh all data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 sm:flex-none border-border/40 bg-background/50 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* KPI filter row */}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">KPI Snapshot Month</p>
        <Select
          value={filters.month.toString()}
          onValueChange={(v) => onFilterChange({ month: parseInt(v) })}
        >
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-background/50 border-border/40 rounded-xl px-3 font-black text-[10px] uppercase tracking-widest">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-md">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <SelectItem key={month} value={month.toString()} className="text-[10px] font-black uppercase tracking-widest">
                {format(new Date(2000, month - 1), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
