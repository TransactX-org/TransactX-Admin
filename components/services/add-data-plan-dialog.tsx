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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createDataPlan } from "@/lib/api/services/data.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dataKeys } from "@/lib/api/hooks/use-data"

interface AddDataPlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddDataPlanDialog({ open, onOpenChange }: AddDataPlanDialogProps) {
    const [formData, setFormData] = useState({
        network: "",
        name: "",
        amount: "",
        data_amount: "", // e.g. "1GB"
        validity: "30_days",
    })
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createDataPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dataKeys.all })
            toast({ title: "Success", description: "Data plan added successfully" })
            onOpenChange(false)
            setFormData({ network: "", name: "", amount: "", data_amount: "", validity: "30_days" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add data plan",
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
                    <DialogTitle className="text-xl font-bold">Add Data Plan</DialogTitle>
                    <DialogDescription>Create a new data bundle plan.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Network</Label>
                        <Select value={formData.network} onValueChange={(v) => setFormData({ ...formData, network: v })}>
                            <SelectTrigger className="bg-muted/10">
                                <SelectValue placeholder="Select Network" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mtn">MTN</SelectItem>
                                <SelectItem value="glo">Glo</SelectItem>
                                <SelectItem value="airtel">Airtel</SelectItem>
                                <SelectItem value="9mobile">9mobile</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. MTN 1GB Monthly"
                            className="bg-muted/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data_amount">Data Amount</Label>
                        <Input
                            id="data_amount"
                            value={formData.data_amount}
                            onChange={(e) => setFormData({ ...formData, data_amount: e.target.value })}
                            placeholder="e.g. 1GB"
                            className="bg-muted/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Price</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="e.g. 1000"
                            className="bg-muted/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="validity">Validity</Label>
                        <Select value={formData.validity} onValueChange={(v) => setFormData({ ...formData, validity: v })}>
                            <SelectTrigger className="bg-muted/10">
                                <SelectValue placeholder="Select Validity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1_day">1 Day</SelectItem>
                                <SelectItem value="7_days">7 Days</SelectItem>
                                <SelectItem value="30_days">30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={mutation.isPending || !formData.name}>
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Plan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
