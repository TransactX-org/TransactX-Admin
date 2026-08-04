"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Time field that opens from anywhere in the box — no hunting for the hour
 * segment or the tiny clock glyph the native input gives you.
 *
 * The panel is rendered inline rather than in a portal on purpose: this field
 * lives inside a Radix Dialog, and the Popover copy in node_modules keeps its
 * own dismissable-layer registry, so a portalled panel lands inside the
 * dialog's `pointer-events: none` body and can't be clicked.
 *
 * Value stays in 24-hour "HH:mm" (what the API expects); the display is 12-hour.
 */

interface TimePickerProps extends Omit<React.ComponentPropsWithoutRef<"button">, "value" | "onChange"> {
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    minuteStep?: number
}

interface ParsedTime {
    hour12: number
    minute: number
    period: "AM" | "PM"
}

function parseTime(value?: string): ParsedTime | null {
    const match = /^(\d{1,2}):(\d{2})/.exec(value?.trim() || "")
    if (!match) return null

    const hour24 = Number(match[1])
    const minute = Number(match[2])
    if (hour24 > 23 || minute > 59) return null

    return {
        hour12: hour24 % 12 === 0 ? 12 : hour24 % 12,
        minute,
        period: hour24 < 12 ? "AM" : "PM",
    }
}

function toValue({ hour12, minute, period }: ParsedTime): string {
    const hour24 = period === "AM" ? hour12 % 12 : (hour12 % 12) + 12
    return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

export function formatTime(value?: string): string {
    const parsed = parseTime(value)
    if (!parsed) return ""
    return `${parsed.hour12}:${String(parsed.minute).padStart(2, "0")} ${parsed.period}`
}

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const PRESETS = ["09:00", "12:00", "18:00"]

function TimeColumn<T extends number | string>({
    label,
    options,
    selected,
    onSelect,
}: {
    label: string
    options: { value: T; label: string }[]
    selected: T | null
    onSelect: (value: T) => void
}) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const activeRef = React.useRef<HTMLButtonElement>(null)

    // Centre the current choice when the panel opens.
    React.useEffect(() => {
        const container = containerRef.current
        const active = activeRef.current
        if (!container || !active) return
        container.scrollTop = active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2
    }, [])

    return (
        <div className="flex flex-1 flex-col min-w-0">
            <span className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            <div ref={containerRef} className="h-[168px] overflow-y-auto pr-1 space-y-0.5">
                {options.map((option) => {
                    const isActive = option.value === selected
                    return (
                        <button
                            key={option.value}
                            ref={isActive ? activeRef : undefined}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onSelect(option.value)}
                            className={cn(
                                "w-full rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                            )}
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
    { value, onChange, placeholder = "Pick a time", className, disabled, minuteStep = 5, ...buttonProps },
    ref
) {
    const [open, setOpen] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const parsed = parseTime(value)

    // Close on a click elsewhere, or on Escape — swallowing Escape so it closes
    // the panel without also closing the dialog behind it.
    React.useEffect(() => {
        if (!open) return

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return
            event.stopPropagation()
            setOpen(false)
        }

        document.addEventListener("pointerdown", handlePointerDown, true)
        document.addEventListener("keydown", handleKeyDown, true)
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown, true)
            document.removeEventListener("keydown", handleKeyDown, true)
        }
    }, [open])

    // Make sure the panel is actually on screen when it opens.
    React.useEffect(() => {
        if (!open) return
        const frame = requestAnimationFrame(() => {
            panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        })
        return () => cancelAnimationFrame(frame)
    }, [open])

    // Nothing chosen yet: the first click fills in the rest sensibly.
    const update = (patch: Partial<ParsedTime>) => {
        onChange(toValue({ hour12: 9, minute: 0, period: "AM", ...parsed, ...patch }))
    }

    const minutes = React.useMemo(() => {
        const steps = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep)
        // Keep an odd saved minute (e.g. 10:37) selectable instead of losing it.
        if (parsed && !steps.includes(parsed.minute)) {
            steps.push(parsed.minute)
            steps.sort((a, b) => a - b)
        }
        return steps
    }, [minuteStep, parsed?.minute])

    return (
        <div ref={rootRef} className="relative">
            <button
                {...buttonProps}
                ref={ref}
                type="button"
                disabled={disabled}
                aria-expanded={open}
                onClick={() => setOpen((isOpen) => !isOpen)}
                className={cn(
                    "relative flex h-10 w-full items-center rounded-md border border-input bg-background pl-9 pr-3 py-2 text-left text-base ring-offset-background transition-colors md:text-sm",
                    "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    open && "border-primary/50",
                    className
                )}
            >
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {parsed ? (
                    <span className="font-medium">{formatTime(value)}</span>
                ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                )}
            </button>

            {open && (
                <div
                    ref={panelRef}
                    className="mt-2 rounded-xl border border-border bg-popover text-popover-foreground p-3 shadow-lg"
                >
                    <div className="flex flex-wrap gap-1.5 pb-3 border-b border-border/60">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                    onChange(preset)
                                    setOpen(false)
                                }}
                                className={cn(
                                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                                    value === preset
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                                )}
                            >
                                {formatTime(preset)}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-3">
                        <TimeColumn
                            label="Hour"
                            options={HOURS.map((hour) => ({ value: hour, label: String(hour) }))}
                            selected={parsed?.hour12 ?? null}
                            onSelect={(hour12) => update({ hour12 })}
                        />
                        <TimeColumn
                            label="Minute"
                            options={minutes.map((minute) => ({ value: minute, label: String(minute).padStart(2, "0") }))}
                            selected={parsed?.minute ?? null}
                            onSelect={(minute) => update({ minute })}
                        />
                        <TimeColumn
                            label="AM / PM"
                            options={[
                                { value: "AM" as const, label: "AM" },
                                { value: "PM" as const, label: "PM" },
                            ]}
                            selected={parsed?.period ?? null}
                            onSelect={(period) => update({ period })}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-border/60">
                        <span className="text-xs text-muted-foreground">
                            {parsed ? formatTime(value) : "No time selected"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
})
