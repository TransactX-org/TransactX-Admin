"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw, Calendar, Filter } from "lucide-react"
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

  return (
    <div className="bg-card/30 rounded-2xl border border-border/40 p-4 sm:p-5 backdrop-blur-sm shadow-none">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Date Range */}
        <div className="flex-1 min-w-0">
          <DatePickerWithRange date={dateRange} onChange={handleDateRangeChange} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Selection */}
          <Select
            value={filters.year.toString()}
            onValueChange={(v) => onFilterChange({ year: parseInt(v) })}
          >
            <SelectTrigger className="h-11 w-full lg:w-[120px] bg-background/50 border-border/40 rounded-xl px-4 hover:bg-background transition-colors font-black text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
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

          {/* Month Selection */}
          <Select
            value={filters.month.toString()}
            onValueChange={(v) => onFilterChange({ month: parseInt(v) })}
          >
            <SelectTrigger className="h-11 w-full lg:w-[150px] bg-background/50 border-border/40 rounded-xl px-4 hover:bg-background transition-colors font-black text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Month" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-md">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <SelectItem key={month} value={month.toString()} className="text-[10px] font-black uppercase tracking-widest">
                  {format(new Date(2000, month - 1), "MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full lg:w-auto ml-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 border-border/40 bg-background/50 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-11 flex-1 lg:flex-none border-border/40 bg-background/50 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
