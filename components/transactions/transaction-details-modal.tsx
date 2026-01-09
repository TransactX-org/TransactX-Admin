"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Clock, Download, Loader2, User, ArrowRightLeft, Cpu, Activity, Info } from "lucide-react"
import { useTransaction } from "@/lib/api/hooks/use-transactions"
import { cn } from "@/lib/utils"

interface TransactionDetailsModalProps {
  transactionId: string | null
  onClose: () => void
}

export function TransactionDetailsModal({ transactionId, onClose }: TransactionDetailsModalProps) {
  const { data: response, isLoading } = useTransaction(transactionId)
  const transaction = response?.data

  const getStatusConfig = (status?: string) => {
    const s = status?.toUpperCase() || ""
    if (s === "SUCCESSFUL" || s === "SUCCESS") {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: "Successful"
      }
    }
    if (s === "PENDING" || s === "PROCESSING") {
      return {
        icon: <Clock className="h-5 w-5 text-amber-500" />,
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        label: "Pending"
      }
    }
    if (s === "FAILED" || s === "REVERSED") {
      return {
        icon: <XCircle className="h-5 w-5 text-rose-500" />,
        className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        label: s === "REVERSED" ? "Reversed" : "Failed"
      }
    }
    return {
      icon: <Info className="h-5 w-5 text-muted-foreground" />,
      className: "bg-muted/10 text-muted-foreground border-border/20",
      label: status || "Unknown"
    }
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return "---"
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const statusConfig = getStatusConfig(transaction?.status)

  return (
    <Dialog open={!!transactionId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Transaction Log
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            Internal Ledger Item #{transactionId}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Decrypting Ledger Entry...</p>
            </div>
          ) : !transaction ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Log details unavailable</p>
            </div>
          ) : (
            <>
              {/* Core Financial Cluster */}
              <div className="flex items-center justify-between p-6 bg-muted/20 border border-border/20 rounded-[2rem] relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Settlement Amount</p>
                  <p className="text-4xl font-black tracking-tighter">{formatCurrency(transaction.amount)}</p>
                </div>
                <div className="relative z-10 text-right">
                  <Badge className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border shadow-none", statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                  <p className="text-[9px] font-bold text-muted-foreground/40 mt-2 uppercase tracking-tight font-mono">
                    {transaction.date_human}
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <ArrowRightLeft size={160} strokeWidth={4} />
                </div>
              </div>

              {/* Transaction DNA */}
              <div className="grid grid-cols-2 gap-6 px-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Reference ID</p>
                  <p className="font-mono text-[11px] font-bold break-all bg-muted/30 px-2 py-1 rounded-md border border-border/10">{transaction.reference}</p>
                </div>
                {transaction.external_reference && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Provider Ref</p>
                    <p className="font-mono text-[11px] font-bold break-all opacity-70">{transaction.external_reference}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Operation Type</p>
                  <p className="font-black text-sm uppercase tracking-tight text-primary">{transaction.type.replace("_", " ")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Total Debited</p>
                  <p className="font-black text-sm uppercase tracking-tight">{formatCurrency(transaction.total_debited)}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Description</p>
                  <p className="text-sm font-medium leading-relaxed italic">"{transaction.description}"</p>
                </div>
              </div>

              <Separator className="bg-border/10" />

              {/* Actor Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Sender Profile</h3>
                  </div>
                  <div className="bg-muted/10 p-4 rounded-2xl border border-border/10 space-y-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Identity</p>
                      <p className="text-sm font-black tracking-tight">{transaction.sender.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">{transaction.sender.email}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Financial Route</p>
                      <p className="text-[11px] font-black uppercase tracking-widest">{transaction.sender.bank_name}</p>
                      <p className="text-[10px] font-mono font-bold opacity-60">AC: {transaction.sender.account_number}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Processing Node</h3>
                  </div>
                  <div className="bg-muted/10 p-4 rounded-2xl border border-border/10 flex flex-col justify-center min-h-[100px]">
                    {transaction.recipient ? (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Recipient / Request</p>
                        <p className="text-sm font-black tracking-tight">{transaction.recipient.requested_from_name}</p>
                        <Badge variant="outline" className="text-[8px] uppercase font-black">{transaction.recipient.status || "UNKNOWN"}</Badge>
                      </div>
                    ) : (
                      <div className="text-center py-2 border-2 border-dashed border-border/20 rounded-xl">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-20">No Secondary Actor</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Payload Overlay */}
              {transaction.payload && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-black uppercase tracking-widest">Extended Metadata</h3>
                    </div>
                    <Badge className="bg-primary text-[8px] font-black px-2 rounded-full">JSON</Badge>
                  </div>
                  <pre className="bg-zinc-950 p-6 rounded-3xl text-[10px] font-mono font-bold leading-relaxed text-zinc-400 overflow-x-auto border border-zinc-800/50 max-h-[200px] custom-scrollbar selection:bg-primary selection:text-white">
                    {JSON.stringify(transaction.payload, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 pt-2 bg-muted/5 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted/20">
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
          <Button className="flex-1 rounded-2xl h-12 tx-bg-primary font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
            Audit Finalized
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
