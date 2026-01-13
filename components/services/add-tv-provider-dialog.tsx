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
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createTvProvider } from "@/lib/api/services/tv.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { tvKeys } from "@/lib/api/hooks/use-tv"

interface AddTvProviderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddTvProviderDialog({ open, onOpenChange }: AddTvProviderDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
    })
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createTvProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tvKeys.all })
            toast({ title: "Success", description: "TV Provider added successfully" })
            onOpenChange(false)
            setFormData({ name: "", code: "" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add provider",
                variant: "destructive"
            })
        }
    })

    const handleCreate = () => {
        mutation.mutate(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-border/40 bg-card/95 backdrop-blur-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add TV Provider</DialogTitle>
                    <DialogDescription>Add a new service provider for TV subscriptions.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Provider Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. DSTV"
                            className="bg-muted/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Provider Code</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="e.g. dstv"
                            className="bg-muted/10"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={mutation.isPending || !formData.name}>
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Provider
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
