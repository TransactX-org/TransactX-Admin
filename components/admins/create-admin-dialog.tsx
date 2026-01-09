import { useState, useEffect } from "react"
import { CreateAdminPayload } from "@/lib/api/types"
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
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Shield, Check } from "lucide-react"
import { useCreateAdmin, useAdminRoles } from "@/lib/api/hooks/use-admins"

interface CreateAdminDialogProps {
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

export function CreateAdminDialog({ open, onOpenChange }: CreateAdminDialogProps) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role_id: "",
    })
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["user-management"])
    const createAdminMutation = useCreateAdmin()
    const { data: rolesData, isLoading: rolesLoading } = useAdminRoles()

    // Safely extract roles list, handling potential pagination or different API structures
    const rolesList = Array.isArray(rolesData?.data)
        ? rolesData.data
        // @ts-ignore - Handle case where data might be paginated
        : Array.isArray(rolesData?.data?.data)
            // @ts-ignore
            ? rolesData.data.data
            : []

    // Set default role when roles are loaded
    useEffect(() => {
        if (rolesList.length > 0 && !formData.role_id) {
            setFormData(prev => ({ ...prev, role_id: rolesList[0].id }))
        }
    }, [rolesList, formData.role_id])

    const togglePermission = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        )
    }

    const handleCreate = async () => {
        if (!formData.role_id) return

        await createAdminMutation.mutateAsync({
            ...formData,
            permissions: selectedPermissions,
        })
        onOpenChange(false)
        // Reset form
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            role_id: rolesList[0]?.id || "",
        })
        setSelectedPermissions(["user-management"])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] border-border/40 bg-card/95 backdrop-blur-md rounded-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-black tracking-tight uppercase">Create New Admin</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Configure profile and permissions for a new administrator
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">First Name</Label>
                            <Input
                                placeholder="John"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Last Name</Label>
                            <Input
                                placeholder="Doe"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email Address</Label>
                        <Input
                            type="email"
                            placeholder="admin@transactx.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Password (Optional)</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Role</Label>
                        <Select
                            value={formData.role_id}
                            onValueChange={(value) => setFormData({ ...formData, role_id: value })}
                            disabled={rolesLoading}
                        >
                            <SelectTrigger className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:ring-0 focus:ring-offset-0 font-medium">
                                <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select a role"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/40 bg-card/95 backdrop-blur-md">
                                {rolesList.map((role: any) => (
                                    <SelectItem key={role.id} value={role.id} className="text-xs font-bold uppercase tracking-widest">
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Assign Permissions</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                        <Label className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none">
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
                </div>

                <DialogFooter className="p-6 bg-muted/20 shrink-0">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={createAdminMutation.isPending || !formData.email || !formData.first_name || !formData.role_id}
                        className="rounded-xl tx-bg-primary hover:opacity-90 font-black uppercase tracking-widest text-[10px] h-11 px-8"
                    >
                        {createAdminMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2 stroke-[3px]" />
                        )}
                        Create Admin
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
