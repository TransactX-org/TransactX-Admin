"use client"

import { useState } from "react"
import { useAdminStats, useAdmins } from "@/lib/api/hooks/use-admins"
import { useCurrentUser } from "@/lib/api/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminStats } from "@/components/admins/admin-stats"
import { AdminTable } from "@/components/admins/admin-table"
import { Button } from "@/components/ui/button"
import { Plus, Shield, Loader2 } from "lucide-react"
import { CreateAdminDialog } from "@/components/admins/create-admin-dialog"

export default function AdminsPage() {
    const [page, setPage] = useState(1)
    const { data: stats, isLoading: statsLoading } = useAdminStats()
    const { data: adminsData, isLoading: adminsLoading } = useAdmins(page)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const user = useCurrentUser()
    const router = useRouter()

    useEffect(() => {
        if (user && !user.is_super_admin) {
            router.push("/dashboard")
        }
    }, [user, router])

    if (!user || !user.is_super_admin) {
        return null // Or a loading spinner while checking auth
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        ADMIN MANAGEMENT
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest pl-1">
                        Manage administrative users, roles, and system permissions
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="h-12 px-6 rounded-2xl tx-bg-primary hover:opacity-90 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2 stroke-[3px]" />
                    Create New Admin
                </Button>
            </div>

            <AdminStats stats={stats?.data} isLoading={statsLoading} />

            <AdminTable
                admins={adminsData?.data?.data || []}
                isLoading={adminsLoading}
                pagination={adminsData?.data}
                page={page}
                onPageChange={setPage}
            />

            <CreateAdminDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
        </div>
    )
}
