"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Settings, User, Loader2, FileText } from "lucide-react"

import {
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useUsers } from "@/lib/api/hooks/use-users"
import { useTransactionSearchPool } from "@/lib/api/hooks/use-transactions"
import { matchesSearch } from "@/lib/search"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GlobalSearch() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Debounce search query
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query])

    // Only query once the dialog is open and something has been typed —
    // otherwise this fires on every dashboard page load with an empty query.
    const hasQuery = debouncedQuery.trim().length > 0
    const shouldSearch = open && hasQuery

    // Users search server-side (the endpoint matches name/email/username).
    const { data: usersData, isLoading: isLoadingUsers } = useUsers(
        1,
        5,
        { search: debouncedQuery },
        shouldSearch
    )

    // Transactions search client-side: the endpoint's `search` does not match
    // on transaction id or amount. Shares its cached pool with the
    // transactions page, which filters the same way.
    const { data: transactionPool, isLoading: isLoadingTransactions } = useTransactionSearchPool(
        { status: undefined, type: undefined, start_date: undefined, end_date: undefined },
        shouldSearch
    )

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const users = hasQuery ? (usersData?.data?.data || []) : []
    const transactions = React.useMemo(() => {
        if (!hasQuery) return []
        return (transactionPool?.records ?? [])
            .filter((tx) =>
                matchesSearch(debouncedQuery, {
                    text: [tx.transactionId, tx.user, tx.type, tx.status],
                    amounts: [tx.amount],
                })
            )
            .slice(0, 5)
    }, [hasQuery, transactionPool, debouncedQuery])
    const isLoading = hasQuery && (isLoadingUsers || isLoadingTransactions)

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                )}
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search users, transactions...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            {/* shouldFilter={false}: results are already filtered above, and cmdk's own
                matcher would drop hits our matcher found (e.g. "5,000" vs a 5000 value). */}
            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <CommandInput
                    placeholder="Search by name, email, transaction ID, amount..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {hasQuery && !isLoading && users.length === 0 && transactions.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No results for &ldquo;{debouncedQuery}&rdquo;
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {users.length > 0 && (
                                <CommandGroup heading="Users">
                                    {users.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            value={`user ${user.name} ${user.email}`}
                                            onSelect={() => {
                                                runCommand(() => router.push(`/dashboard/users?search=${encodeURIComponent(user.email)}`))
                                            }}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>{user.name}</span>
                                            <span className="ml-2 text-xs text-muted-foreground">({user.email})</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            <CommandSeparator />

                            {transactions.length > 0 && (
                                <CommandGroup heading="Transactions">
                                    {transactions.map((tx) => (
                                        <CommandItem
                                            key={tx.transactionId}
                                            value={`transaction ${tx.transactionId} ${tx.amount}`}
                                            onSelect={() => {
                                                runCommand(() => router.push(`/dashboard/transactions?search=${encodeURIComponent(tx.transactionId)}`))
                                            }}
                                        >
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>{tx.transactionId}</span>
                                            <span className="ml-auto text-xs font-medium">
                                                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(tx.amount))}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            <CommandSeparator />

                            <CommandGroup heading="Suggestions">
                                <CommandItem
                                    onSelect={() => {
                                        runCommand(() => router.push("/dashboard/users"))
                                    }}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>All Users</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => {
                                        runCommand(() => router.push("/dashboard/transactions"))
                                    }}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>All Transactions</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => {
                                        runCommand(() => router.push("/dashboard/settings"))
                                    }}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
