"use client"

import * as React from "react"
import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange
  onChange?: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({ className, date: externalDate, onChange }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(externalDate)

  // Sync with external date
  React.useEffect(() => {
    setDate(externalDate)
  }, [externalDate])

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onChange?.(newDate)
  }

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleSelect(undefined)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-black text-[10px] uppercase tracking-widest h-10 bg-background/50 border-border/40 rounded-xl hover:bg-background transition-colors",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            <div className="flex-1 truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </div>
            {date && (
              <X
                className="ml-2 h-3 w-3 hover:text-rose-500 transition-colors"
                onClick={clearDate}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
