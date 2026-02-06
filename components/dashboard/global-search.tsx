"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    Loader2,
    FileText
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useUsers } from "@/lib/api/hooks/use-users"
import { useTransactions } from "@/lib/api/hooks/use-transactions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { DialogTitle } from "@/components/ui/dialog" // CommandDialog already renders DialogTitle visually hidden or we might need to add one if accessiblity complains, but commonly CommandDialog handles it. Actually looking at command.tsx, CommandDialog renders DialogTitle in sr-only.

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

    // Fetch users
    const { data: usersData, isLoading: isLoadingUsers } = useUsers(1, 5, {
        search: debouncedQuery,
    })

    // Fetch transactions
    const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactions(1, 5, {
        search: debouncedQuery,
    })

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const users = usersData?.data?.data || []
    const transactions = transactionsData?.data?.data || []
    const isLoading = isLoadingUsers || isLoadingTransactions

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                )}
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search documentation...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

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
                                                runCommand(() => router.push(`/dashboard/users?search=${user.email}`))
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
                                                runCommand(() => router.push(`/dashboard/transactions?search=${tx.transactionId}`))
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
