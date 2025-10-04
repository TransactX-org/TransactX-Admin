"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, Activity } from "lucide-react"

interface UserDetailsModalProps {
  userId: string | null
  onClose: () => void
}

export function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
  if (!userId) return null

  // Mock user details
  const user = {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    address: "123 Main Street, Lagos, Nigeria",
    role: "User",
    status: "active",
    joinDate: "2025-01-15",
    lastActive: "2025-10-04 14:30",
    totalTransactions: 45,
    totalSpent: "₦125,000",
    recentTransactions: [
      { id: "TXN001", amount: "₦5,000", type: "Payment", date: "2025-10-04" },
      { id: "TXN002", amount: "₦12,500", type: "Transfer", date: "2025-10-03" },
      { id: "TXN003", amount: "₦8,000", type: "Withdrawal", date: "2025-10-02" },
    ],
    activityLog: [
      { action: "Login", time: "2025-10-04 14:30", ip: "192.168.1.1" },
      { action: "Transaction", time: "2025-10-04 14:25", ip: "192.168.1.1" },
      { action: "Profile Update", time: "2025-10-03 10:15", ip: "192.168.1.1" },
    ],
  }

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information about this user</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{user.role}</Badge>
                <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Join Date</p>
                        <p className="font-medium">{user.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{user.totalTransactions}</p>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{user.totalSpent}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              {user.recentTransactions.map((transaction) => (
                <Card key={transaction.id} className="border-2">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <p className="font-bold">{transaction.amount}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              {user.activityLog.map((log, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.time} • IP: {log.ip}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 tx-bg-primary hover:opacity-90">Edit User</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Suspend Account
            </Button>
            <Button variant="destructive" className="flex-1">
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
