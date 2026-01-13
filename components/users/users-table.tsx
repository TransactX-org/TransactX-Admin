"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Ban, Trash2, Loader2, Mail } from "lucide-react"
import { useUsers, useDeleteUser } from "@/lib/api/hooks/use-users"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { PaginationSelector } from "@/components/ui/pagination-selector"

interface UsersTableProps {
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
}

export function UsersTable({ filters }: UsersTableProps) {
  const router = useRouter()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(15)

  // Map filters to API parameters
  const apiFilters = {
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
  }

  const { data, isLoading, error } = useUsers(currentPage, perPage, apiFilters)
  const deleteUserMutation = useDeleteUser()

  const users = data?.data?.data || []
  const pagination = data?.data || null

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    const allIds = users.map((u) => u.id)
    const isAllSelected = allIds.every(id => selectedRows.includes(id))

    if (isAllSelected) {
      setSelectedRows(prev => prev.filter(id => !allIds.includes(id)))
    } else {
      setSelectedRows(prev => [...Array.from(new Set([...prev, ...allIds]))])
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUserMutation.mutateAsync(id)
    }
  }

  const getStatusConfig = (status: string) => {
    const s = status.toUpperCase()
    if (s === "ACTIVE") {
      return { variant: "default" as const, className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" }
    }
    if (s === "SUSPENDED" || s === "INACTIVE") {
      return { variant: "destructive" as const, className: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20" }
    }
    if (s === "NEW") {
      return { variant: "secondary" as const, className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20" }
    }
    return { variant: "outline" as const, className: "" }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  const truncateId = (id: string) => {
    if (!id) return ""
    return `${id.slice(0, 4)}...${id.slice(-4)}`
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">System Users</h2>
            <p className="text-sm text-muted-foreground font-medium">Manage and monitor all platform accounts.</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs animate-in zoom-in-95">
                <span className="mr-2 h-2 w-2 rounded-full tx-bg-primary" />
                {selectedRows.length} Selected
              </Button>
            )}
            <Button size="sm" className="tx-bg-primary h-9 font-semibold">Bulk Action</Button>
          </div>
        </div>

        {/* Content Section */}
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border border-border/40 bg-card overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="w-[48px] px-4">
                      <Checkbox
                        checked={users.length > 0 && users.every(u => selectedRows.includes(u.id))}
                        onCheckedChange={toggleAllRows}
                        className="rounded-full size-3"
                      />
                    </TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">User</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">Role</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">Email</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">Join Date</TableHead>
                    <TableHead className="text-right px-4 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-b-border/40">
                        <TableCell colSpan={8} className="h-16 h-skeleton" />
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <span className="text-sm text-destructive">Failed to load users</span>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <span className="text-sm text-muted-foreground">No users found</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => {
                      const status = getStatusConfig(user.status)
                      const isSelected = selectedRows.includes(user.id)
                      return (
                        <TableRow key={user.id} className={cn("border-b-border/40 hover:bg-muted/30 transition-colors group", isSelected && "bg-muted/50")}>
                          <TableCell className="px-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleRowSelection(user.id)}
                              className="rounded-full size-3"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-border/40">
                                <AvatarImage src={user.avatar || undefined} />
                                <AvatarFallback className="text-[10px] font-bold tx-bg-primary text-white">
                                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold leading-none">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-tighter">ID: {truncateId(user.id)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/40">
                              {user.user_type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className={cn("font-bold text-[10px] px-2.5 py-0.5 rounded-md border shadow-none", status.className)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 rounded-xl border-border/40 shadow-xl">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${user.id}`)} className="cursor-pointer gap-2 py-2">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  <span>View Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2 py-2">
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                  <span>Edit Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete User</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-card border border-border/40 h-skeleton" />
                ))
              ) : users.length === 0 ? (
                <div className="text-center py-10 bg-card/30 rounded-2xl border border-dashed border-border/40">
                  <p className="text-sm text-muted-foreground">No users found</p>
                </div>
              ) : (
                users.map((user) => {
                  const status = getStatusConfig(user.status)
                  const isSelected = selectedRows.includes(user.id)
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        "p-5 rounded-2xl border transition-all duration-200 bg-card active:scale-[0.98]",
                        isSelected ? "border-primary/40 ring-1 ring-primary/20 bg-primary/5 shadow-sm" : "border-border/40"
                      )}
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="p-1 -ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowSelection(user.id);
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => { }}
                              className="rounded-full size-4"
                            />
                          </div>
                          <Avatar className="h-12 w-12 ring-2 ring-background border border-border/40">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="tx-bg-primary text-white font-bold text-lg">
                              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-base leading-none tracking-tight">{user.name}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/10 uppercase">
                                {user.user_type}
                              </span>
                              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest font-bold opacity-60">
                                #{truncateId(user.id)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge variant={status.variant} className={cn("text-[10px] font-bold px-3 py-1 rounded-lg border", status.className)}>
                          {user.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-4 border-t border-border/10 mt-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="font-medium truncate max-w-[150px]">{user.email}</span>
                        </div>
                        <span className="text-muted-foreground font-medium opacity-60">{formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between mt-6 px-1">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
                  Page <span className="font-bold text-foreground">{pagination.current_page}</span> of {pagination.last_page}
                </p>
                <div className="flex items-center gap-4">
                  <PaginationSelector value={perPage} onValueChange={setPerPage} />

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!pagination.prev_page_url || isLoading}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="h-9 text-xs font-bold hover:bg-muted rounded-xl"
                    >
                      Prev
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!pagination.next_page_url || isLoading}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="h-9 text-xs font-bold tx-text-primary hover:bg-primary/5 rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
