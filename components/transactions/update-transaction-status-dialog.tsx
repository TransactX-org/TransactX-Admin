"use client"

import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react"
import { useUpdateTransactionStatus } from "@/lib/api/hooks/use-transactions"
import {
    TRANSACTION_STATUSES,
    formatStatusLabel,
    type TransactionStatus,
} from "@/lib/transaction-status"
import { cn } from "@/lib/utils"

interface UpdateTransactionStatusDialogProps {
    /** Transaction to update; the dialog is open whenever this is set. */
    transactionId: string | null
    currentStatus?: string
    onClose: () => void
}

const statusClassName = (status: string) => {
    const s = status.toUpperCase()
    if (s === "SUCCESSFUL" || s === "SUCCESS") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    if (s === "PENDING" || s === "PROCESSING") return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    if (s === "FAILED" || s === "REVERSED") return "bg-rose-500/10 text-rose-600 border-rose-500/20"
    return "bg-muted/30 text-muted-foreground border-border/20"
}

export function UpdateTransactionStatusDialog({
    transactionId,
    currentStatus,
    onClose,
}: UpdateTransactionStatusDialogProps) {
    const [status, setStatus] = useState<TransactionStatus | "">("")
    const updateStatus = useUpdateTransactionStatus()

    // Reset the selection whenever a different transaction is opened.
    useEffect(() => {
        setStatus("")
    }, [transactionId])

    const normalizedCurrent = currentStatus?.toUpperCase()
    const unchanged = !!status && status === normalizedCurrent
    const canSubmit = !!status && !unchanged && !updateStatus.isPending

    const handleSubmit = async () => {
        if (!transactionId || !status || !canSubmit) return
        try {
            await updateStatus.mutateAsync({ id: transactionId, status })
            onClose()
        } catch {
            // The mutation surfaces its own error toast; keep the dialog open
            // so the admin can retry or cancel.
        }
    }

    return (
        <Dialog open={!!transactionId} onOpenChange={(open) => { if (!open && !updateStatus.isPending) onClose() }}>
            <DialogContent className="max-w-md rounded-3xl border-border/40">
                <DialogHeader>
                    <DialogTitle className="text-lg font-black uppercase tracking-tight">
                        Update transaction status
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 break-all">
                        #{transactionId}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="flex items-center gap-3">
                        <div className="space-y-1.5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Current</p>
                            <Badge className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border shadow-none", statusClassName(normalizedCurrent || ""))}>
                                {normalizedCurrent ? formatStatusLabel(normalizedCurrent) : "Unknown"}
                            </Badge>
                        </div>

                        <ArrowRight className="h-4 w-4 mt-5 text-muted-foreground/40 shrink-0" />

                        <div className="space-y-1.5 flex-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">New status</p>
                            <Select value={status || undefined} onValueChange={(value) => setStatus(value as TransactionStatus)}>
                                <SelectTrigger className="h-10 rounded-xl bg-background border-border/40 text-[10px] font-bold uppercase tracking-widest">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40">
                                    {TRANSACTION_STATUSES.map((option) => (
                                        <SelectItem
                                            key={option}
                                            value={option}
                                            disabled={option === normalizedCurrent}
                                            className="text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            {formatStatusLabel(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2.5 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                            This overrides the recorded status of a financial transaction and is
                            visible to the customer. It does not move any money.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={updateStatus.isPending}
                        className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest border-border/40"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="rounded-xl h-10 text-[10px] font-black uppercase tracking-widest"
                    >
                        {updateStatus.isPending && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}
                        Update status
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
