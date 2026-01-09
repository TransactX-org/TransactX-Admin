"use client"

import { useState } from "react"
import { Admin, PaginatedResponse } from "@/lib/api/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, Mail, Calendar, UserCog, Trash2, Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useDeleteAdmin } from "@/lib/api/hooks/use-admins"
import { UpdatePermissionsDialog } from "./update-permissions-dialog"
import { parsePermissions } from "@/lib/utils"

interface AdminTableProps {
    admins: Admin[]
    isLoading: boolean
    pagination?: PaginatedResponse<Admin>
    page: number
    onPageChange: (page: number) => void
}

export function AdminTable({ admins, isLoading, pagination, page, onPageChange }: AdminTableProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const deleteAdminMutation = useDeleteAdmin()

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (admin: Admin) => {
        if (confirm(`Are you sure you want to delete admin ${admin.name}?`)) {
            await deleteAdminMutation.mutateAsync(admin.id)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 rounded-xl bg-muted/20 border-border/10 focus:bg-background transition-all"
                    />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Showing {filteredAdmins.length} administrators
                </p>
            </div>

            <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/40 bg-muted/5">
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Admin</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Role</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Permissions</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Joined</th>
                                <th className="text-right py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="group hover:bg-muted/10 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
                                                <AvatarImage src={admin.avatar || undefined} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                                    {admin.name.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-black text-sm tracking-tight flex items-center gap-2">
                                                    {admin.name}
                                                    {admin.is_super_admin && (
                                                        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none h-4 px-1.5 rounded text-[8px] font-black uppercase tracking-widest">SUPER</Badge>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <Badge variant="outline" className="h-6 px-3 rounded-lg border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                                            {admin.role.name}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                                            {(() => {
                                                const perms = parsePermissions(admin.permissions)
                                                if (perms.includes("*")) {
                                                    return (
                                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                                                            Full Access
                                                        </Badge>
                                                    )
                                                }
                                                return (
                                                    <>
                                                        {perms.slice(0, 3).map(p => (
                                                            <span key={p} className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-muted/30 border border-border/10 text-muted-foreground/80">
                                                                {p.split("-")[0]}
                                                            </span>
                                                        ))}
                                                        {perms.length > 3 && (
                                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/5 text-primary">
                                                                +{perms.length - 3} more
                                                            </span>
                                                        )}
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                                            <Calendar className="h-3 w-3" />
                                            {admin.created_at || admin.role?.created_at ? new Date(admin.created_at || admin.role.created_at!).toLocaleDateString() : "N/A"}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/40 bg-card/95 backdrop-blur-md shadow-2xl">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-4 py-3">Admin Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-border/40" />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedAdmin(admin)
                                                        setIsUpdateDialogOpen(true)
                                                    }}
                                                    className="px-4 py-2.5 cursor-pointer text-xs font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-colors focus:bg-primary/5 focus:text-primary rounded-xl"
                                                >
                                                    <UserCog className="h-4 w-4 mr-3" />
                                                    Manage Permissions
                                                </DropdownMenuItem>
                                                {!admin.is_super_admin && (
                                                    <>
                                                        <DropdownMenuSeparator className="bg-border/40" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(admin)}
                                                            className="px-4 py-2.5 cursor-pointer text-xs font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 rounded-xl"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-3" />
                                                            Delete Admin
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-border/20">
                    {filteredAdmins.map((admin) => (
                        <div key={admin.id} className="p-4 space-y-4 hover:bg-muted/5 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-primary/5">
                                        <AvatarImage src={admin.avatar || undefined} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                            {admin.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-black text-sm tracking-tight flex items-center gap-2">
                                            {admin.name}
                                            {admin.is_super_admin && (
                                                <Badge className="bg-amber-500/10 text-amber-600 border-none h-4 px-1.5 rounded text-[8px] font-black uppercase tracking-widest">SUPER</Badge>
                                            )}
                                        </div>
                                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase">{admin.email}</div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-muted-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedAdmin(admin)
                                            setIsUpdateDialogOpen(true)
                                        }}>
                                            <UserCog className="h-4 w-4 mr-3" />
                                            Permissions
                                        </DropdownMenuItem>
                                        {!admin.is_super_admin && (
                                            <DropdownMenuItem onClick={() => handleDelete(admin)} className="text-rose-500">
                                                <Trash2 className="h-4 w-4 mr-3" />
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Role</p>
                                    <Badge variant="outline" className="h-6 px-3 rounded-lg border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                                        {admin.role.name}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Joined</p>
                                    <p className="text-[10px] font-bold">
                                        {admin.created_at || admin.role?.created_at ? new Date(admin.created_at || admin.role.created_at!).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Permissions</p>
                                <div className="flex flex-wrap gap-1">
                                    {(() => {
                                        const perms = parsePermissions(admin.permissions)
                                        if (perms.includes("*")) {
                                            return (
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                                                    Full Access
                                                </Badge>
                                            )
                                        }
                                        return perms.map(p => (
                                            <span key={p} className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-muted/30 border border-border/10">
                                                {p.replace("-", " ")}
                                            </span>
                                        ))
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAdmins.length === 0 && (
                    <div className="py-20 text-center space-y-3">
                        <div className="h-16 w-16 rounded-3xl bg-muted/20 flex items-center justify-center mx-auto">
                            <Shield className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">No administrators found</p>
                    </div>
                )}
            </CardContent>

            {/* Pagination */}
            {pagination && pagination.total > pagination.per_page && (
                <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">
                        Page {pagination.current_page} of {pagination.last_page}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => onPageChange(page - 1)}
                            className="h-8 w-8 p-0 rounded-lg border-border/40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === pagination.last_page}
                            onClick={() => onPageChange(page + 1)}
                            className="h-8 w-8 p-0 rounded-lg border-border/40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {selectedAdmin && (
                <UpdatePermissionsDialog
                    admin={selectedAdmin}
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                />
            )}
        </Card>
    )
}
