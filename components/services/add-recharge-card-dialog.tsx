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
import { createAirtimeRechargeCard } from "@/lib/api/services/airtime.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { airtimeKeys } from "@/lib/api/hooks/use-airtime"

interface AddRechargeCardDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddRechargeCardDialog({ open, onOpenChange }: AddRechargeCardDialogProps) {
    const [formData, setFormData] = useState({
        network: "",
        amount: "",
        pin: "",
        serial_number: ""
    })
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createAirtimeRechargeCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: airtimeKeys.all })
            toast({ title: "Success", description: "Recharge card added successfully" })
            onOpenChange(false)
            setFormData({ network: "", amount: "", pin: "", serial_number: "" })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add recharge card",
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
                    <DialogTitle className="text-xl font-bold">Add Recharge Card</DialogTitle>
                    <DialogDescription>Manually add an airtime recharge PIN.</DialogDescription>
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
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="e.g. 100"
                            className="bg-muted/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pin">PIN</Label>
                        <Input
                            id="pin"
                            value={formData.pin}
                            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                            placeholder="Recharge PIN"
                            className="bg-muted/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="serial">Serial Number</Label>
                        <Input
                            id="serial"
                            value={formData.serial_number}
                            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            placeholder="Serial Number"
                            className="bg-muted/10"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={mutation.isPending || !formData.pin}>
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Card
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
