"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Clock, Download } from "lucide-react"

interface TransactionDetailsModalProps {
  transactionId: string | null
  onClose: () => void
}

export function TransactionDetailsModal({ transactionId, onClose }: TransactionDetailsModalProps) {
  if (!transactionId) return null

  // Mock transaction details
  const transaction = {
    id: transactionId,
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 801 234 5678",
    },
    amount: "₦5,000",
    type: "Payment",
    status: "success",
    date: "2025-10-04 14:30:25",
    description: "Payment for electricity bill",
    reference: "REF-2025-10-04-001234",
    timeline: [
      { status: "Initiated", time: "2025-10-04 14:30:25", completed: true },
      { status: "Processing", time: "2025-10-04 14:30:28", completed: true },
      { status: "Completed", time: "2025-10-04 14:30:32", completed: true },
    ],
  }

  return (
    <Dialog open={!!transactionId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Complete information about this transaction</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Amount */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-3xl font-bold">{transaction.amount}</p>
            </div>
            <Badge variant={transaction.status === "success" ? "default" : "secondary"} className="text-lg px-4 py-2">
              {transaction.status}
            </Badge>
          </div>

          {/* Transaction Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Transaction Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-mono text-sm">{transaction.reference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{transaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">{transaction.date}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{transaction.description}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{transaction.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{transaction.user.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{transaction.user.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold">Transaction Timeline</h3>
            <div className="space-y-4">
              {transaction.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.status}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 tx-bg-primary hover:opacity-90">Approve Transaction</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
