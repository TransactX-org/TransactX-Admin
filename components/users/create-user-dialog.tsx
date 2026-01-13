"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"
import { useCreateUser } from "@/lib/api/hooks/use-users"
import { CreateUserPayload } from "@/lib/api/types"

interface CreateUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
    const [formData, setFormData] = useState<CreateUserPayload>({
        name: "",
        email: "",
        username: "",
        password: "",
        status: "ACTIVE",
        user_type: "individual",
        account_type: "main",
        country: "NG", // Default to Nigeria
        is_active: 1,
        verify_email: 1,
        create_wallet: 1,
    })

    const createUserMutation = useCreateUser()

    const handleCreate = async () => {
        await createUserMutation.mutateAsync(formData)
        onOpenChange(false)
        // Reset form to defaults
        setFormData({
            name: "",
            email: "",
            username: "",
            password: "",
            status: "ACTIVE",
            user_type: "individual",
            account_type: "main",
            country: "NG",
            is_active: 1,
            verify_email: 1,
            create_wallet: 1,
        })
    }

    const isValid = formData.name && formData.email && formData.username && formData.password

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-border/40 bg-card/95 backdrop-blur-md rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 bg-muted/20 border-b border-border/10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-black tracking-tight uppercase">Add New User</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                        Create a new user account with default settings
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</Label>
                        <Input
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Username</Label>
                            <Input
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Type</Label>
                            <Select
                                value={formData.user_type}
                                onValueChange={(value: "individual" | "business") => setFormData({ ...formData, user_type: value })}
                            >
                                <SelectTrigger className="h-11 rounded-2xl bg-muted/10 border-border/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40">
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email Address</Label>
                        <Input
                            type="email"
                            placeholder="user@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Password</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="h-11 rounded-2xl bg-muted/10 border-border/10 focus:bg-background transition-all font-medium"
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 bg-muted/20 border-t border-border/10">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={createUserMutation.isPending || !isValid}
                        className="rounded-xl tx-bg-primary hover:opacity-90 font-black uppercase tracking-widest text-[10px] h-11 px-8"
                    >
                        {createUserMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <UserPlus className="h-4 w-4 mr-2 stroke-[3px]" />
                        )}
                        Create User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
