"use client"

import { useState, useEffect } from "react"
import { Admin, UpdateAdminRolePayload } from "@/lib/api/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Shield, Check } from "lucide-react"
import { useUpdateAdminRole } from "@/lib/api/hooks/use-admins"
import { parsePermissions } from "@/lib/utils"

interface UpdatePermissionsDialogProps {
    admin: Admin
    open: boolean
    onOpenChange: (open: boolean) => void
}

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

export function UpdatePermissionsDialog({ admin, open, onOpenChange }: UpdatePermissionsDialogProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
    const updateRoleMutation = useUpdateAdminRole()

    useEffect(() => {
        if (open && admin) {
            setSelectedPermissions(parsePermissions(admin.permissions))
        }
    }, [open, admin])

    const togglePermission = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        )
    }

    const handleUpdate = async () => {
        await updateRoleMutation.mutateAsync({
            id: admin.id,
            payload: {
                role_id: admin.role.id,
                permissions: selectedPermissions,
            },
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-border/40 bg-card/95 backdrop-blur-md rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-black tracking-tight uppercase">Update Permissions</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Modify permissions for <span className="text-foreground tracking-normal lowercase">{admin.name}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_PERMISSIONS.map((permission) => {
                            const isChecked = selectedPermissions.includes(permission)
                            return (
                                <div
                                    key={permission}
                                    onClick={() => togglePermission(permission)}
                                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${isChecked
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-muted/10 border-border/10 hover:bg-muted/20"
                                        }`}
                                >
                                    <Label
                                        htmlFor={permission}
                                        className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none"
                                    >
                                        {permission.replace("-", " ")}
                                    </Label>
                                    <div className={`h-5 w-5 rounded-lg border transition-all flex items-center justify-center ${isChecked ? "bg-primary border-primary" : "bg-background border-border"
                                        }`}>
                                        {isChecked && <Check className="h-3 w-3 text-white stroke-[4px]" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/20 mt-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={updateRoleMutation.isPending}
                        className="rounded-xl tx-bg-primary hover:opacity-90 font-black uppercase tracking-widest text-[10px] h-10 px-6"
                    >
                        {updateRoleMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4 mr-2 stroke-[3px]" />
                        )}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
