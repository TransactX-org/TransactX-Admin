"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PaginationSelectorProps {
    value: number
    onValueChange: (value: number) => void
}

export function PaginationSelector({ value, onValueChange }: PaginationSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:block">
                Rows per page
            </p>
            <Select
                value={value.toString()}
                onValueChange={(val) => onValueChange(Number(val))}
            >
                <SelectTrigger className="h-8 w-[70px] bg-background/50 border-border/40 rounded-lg text-xs font-bold">
                    <SelectValue placeholder={value} />
                </SelectTrigger>
                <SelectContent align="end" className="min-w-[70px] rounded-xl border-border/40">
                    {[10, 15, 20, 50, 100, 200].map((pageSize) => (
                        <SelectItem
                            key={pageSize}
                            value={pageSize.toString()}
                            className="text-xs font-bold"
                        >
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
