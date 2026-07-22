"use client"

import { useEffect, useState } from "react"
import { Search, X, Loader2, Plus, Check } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers } from "@/lib/api/hooks/use-users"
import { User } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface UserPickerProps {
    selected: User[]
    onChange: (users: User[]) => void
    placeholder?: string
    maxSelection?: number
}

export function UserPicker({
    selected,
    onChange,
    placeholder = "Search by name, email or username...",
    maxSelection,
}: UserPickerProps) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 350)
        return () => clearTimeout(timer)
    }, [query])

    const searchEnabled = debouncedQuery.length >= 2
    const { data, isFetching, error } = useUsers(1, 8, searchEnabled ? { search: debouncedQuery } : undefined)

    const results = searchEnabled ? data?.data?.data || [] : []
    const errorMessage = error
        ? (error as any)?.response?.data?.message || "Could not load users. Please try again."
        : null
    const atLimit = maxSelection !== undefined && selected.length >= maxSelection

    const isSelected = (user: User) => selected.some((u) => u.id === user.id)

    const toggleUser = (user: User) => {
        if (isSelected(user)) {
            onChange(selected.filter((u) => u.id !== user.id))
        } else if (!atLimit) {
            onChange([...selected, user])
        }
    }

    const initials = (user: User) =>
        (user.name || user.email || "?")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()

    return (
        <div className="space-y-2">
            {/* Selected chips */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selected.map((user) => (
                        <span
                            key={user.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary pl-2 pr-1 py-1 text-xs font-medium"
                        >
                            {user.name || user.email}
                            <button
                                type="button"
                                onClick={() => toggleUser(user)}
                                className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                                aria-label={`Remove ${user.name || user.email}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Search input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={atLimit ? "Selection limit reached" : placeholder}
                    disabled={atLimit}
                    className="pl-9 h-9 text-xs bg-muted/20 border-border/40 rounded-xl"
                />
                {isFetching && searchEnabled && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Results */}
            {searchEnabled && (
                <div className="rounded-xl border border-border/40 bg-background overflow-hidden divide-y divide-border/20 max-h-56 overflow-y-auto">
                    {errorMessage && !isFetching ? (
                        <p className="text-xs text-destructive text-center py-4 px-3">{errorMessage}</p>
                    ) : results.length === 0 && !isFetching ? (
                        <p className="text-xs text-muted-foreground text-center py-4">No users found</p>
                    ) : (
                        results.map((user) => {
                            const active = isSelected(user)
                            return (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => toggleUser(user)}
                                    disabled={!active && atLimit}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                                        active ? "bg-primary/5" : "hover:bg-muted/30",
                                        !active && atLimit && "opacity-40 cursor-not-allowed"
                                    )}
                                >
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                            {initials(user)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-xs font-semibold truncate">{user.name}</span>
                                        <span className="block text-[10px] text-muted-foreground truncate">{user.email}</span>
                                    </span>
                                    {active ? (
                                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                    ) : (
                                        <Plus className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                                    )}
                                </button>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}
