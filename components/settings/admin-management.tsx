"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdmin, useUpdateAdminRole, useDeleteAdmin } from "@/lib/api/hooks/use-admins"
import { Loader2, Shield, Trash2, UserCog, Check, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const ALL_PERMISSIONS = [
    "wallet-management",
    "user-management",
    "transaction-management",
    "subscription-management",
    "services-management",
    "role-management",
    "admin-management",
    "settings-management",
]

export function AdminManagement() {
    const [adminId, setAdminId] = useState("019b9dbe-237d-71c8-b48d-6a78f2d32c09")
    const { data, isLoading, error } = useAdmin(adminId)
    const updateRoleMutation = useUpdateAdminRole()
    const deleteAdminMutation = useDeleteAdmin()

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

    const admin = data?.data?.admin

    const handleEditOpen = () => {
        if (admin) {
            setSelectedPermissions(admin.permissions)
            setIsEditDialogOpen(true)
        }
    }

    const handleUpdatePermissions = async () => {
        if (!admin) return

        await updateRoleMutation.mutateAsync({
            id: admin.id,
            payload: {
                role_id: admin.role.id,
                permissions: selectedPermissions,
            },
        })
        setIsEditDialogOpen(false)
    }

    const handleDeleteAdmin = async () => {
        if (!admin) return
        if (confirm(`Are you sure you want to delete admin ${admin.name}?`)) {
            await deleteAdminMutation.mutateAsync(admin.id)
        }
    }

    const togglePermission = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        )
    }

    return (
        <div className="space-y-6">
            <Card className="border-border/40 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Admin User Details</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">View and manage admin permissions and roles</CardDescription>
                        </div>
                        <div className="w-full sm:w-64">
                            <Input
                                placeholder="Search by Admin ID"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                className="h-10 rounded-xl bg-muted/10 border-border/40 focus:bg-background transition-all font-medium text-xs"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error || !admin ? (
                        <div className="text-center py-12 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                            {error ? "Error loading admin details" : "No admin found with this ID"}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-muted/20 border border-border/10">
                                <Avatar className="h-20 w-20 ring-4 ring-primary/10">
                                    <AvatarImage src={admin.avatar || undefined} />
                                    <AvatarFallback className="bg-primary text-white text-2xl font-black">
                                        {admin.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-xl font-black tracking-tight">{admin.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground/60">{admin.email}</p>
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                        <Badge variant="outline" className="h-6 px-3 rounded-lg border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                                            {admin.role.name}
                                        </Badge>
                                        {admin.is_super_admin && (
                                            <Badge className="h-6 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest">Super Admin</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleEditOpen} className="h-9 px-4 rounded-xl border-border/40 font-bold uppercase tracking-widest text-[10px]">
                                        <UserCog className="h-3.5 w-3.5 mr-2" />
                                        Permissions
                                    </Button>
                                    {!admin.is_super_admin && (
                                        <Button variant="ghost" size="sm" onClick={handleDeleteAdmin} disabled={deleteAdminMutation.isPending} className="h-9 px-4 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold uppercase tracking-widest text-[10px]">
                                            {deleteAdminMutation.isPending ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                            )}
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1 flex items-center gap-2">
                                        <Shield className="h-3 w-3 text-primary" />
                                        Assigned Permissions
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {admin.permissions.length > 0 ? (
                                            admin.permissions.map((p) => (
                                                <Badge key={p} variant="secondary" className="px-3 py-1 rounded-lg bg-muted/30 border border-border/10 text-[10px] font-bold uppercase tracking-tight">
                                                    {p.replace("-", " ")}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase italic p-4 rounded-xl bg-muted/10 w-full text-center">No permissions assigned</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Role Description</h4>
                                    <div className="text-[11px] font-medium leading-relaxed text-muted-foreground bg-muted/20 p-4 rounded-2xl border border-border/10">
                                        {admin.role.description || "No description available for this role."}
                                    </div>
                                    <div className="flex flex-wrap gap-4 px-1">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Created</p>
                                            <p className="text-[10px] font-bold">{new Date(admin.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Last Updated</p>
                                            <p className="text-[10px] font-bold">{new Date(admin.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Permissions Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Update Permissions</DialogTitle>
                        <DialogDescription>
                            Modify the permissions for <strong>{admin?.name}</strong>. These changes will take effect immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                        {ALL_PERMISSIONS.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <Checkbox
                                    id={permission}
                                    checked={selectedPermissions.includes(permission)}
                                    onCheckedChange={() => togglePermission(permission)}
                                />
                                <Label
                                    htmlFor={permission}
                                    className="text-sm font-medium leading-none cursor-pointer flex-1"
                                >
                                    {permission.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="tx-bg-primary hover:opacity-90"
                            onClick={handleUpdatePermissions}
                            disabled={updateRoleMutation.isPending}
                        >
                            {updateRoleMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
